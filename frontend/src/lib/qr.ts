import QRCode from 'qrcode';
import { verifyUrl } from './training';

const QR_OPTS = { errorCorrectionLevel: 'M' as const, margin: 2, color: { dark: '#000000', light: '#ffffff' } };

/** Anteprima QR (data URL) per il pannello admin. */
export function qrDataUrl(code: string, width = 320): Promise<string> {
  return QRCode.toDataURL(verifyUrl(code), { ...QR_OPTS, width });
}

/** PNG 1000px pronto per la stampa: QR code + codice dell'attestato sotto. */
export async function qrPngBlob(code: string): Promise<Blob> {
  const qr = document.createElement('canvas');
  await QRCode.toCanvas(qr, verifyUrl(code), { ...QR_OPTS, width: 1000 });
  const out = document.createElement('canvas');
  out.width = 1000;
  out.height = 1120;
  const ctx = out.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(qr, 0, 0, 1000, 1000);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 60px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(code, 500, 1065);
  return new Promise((resolve, reject) => out.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const safe = (s: string) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');

export function qrFilename(c: { code: string; first_name: string; last_name: string }) {
  return `QR_${safe(c.last_name)}_${safe(c.first_name)}_${c.code}.png`;
}

/** CSV compatibile con Excel italiano (separatore ;, BOM UTF-8). */
export function toCsv(rows: (string | number | null | undefined)[][]): Blob {
  const esc = (v: string | number | null | undefined) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return new Blob(['﻿' + rows.map((r) => r.map(esc).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
}

/** ZIP con un PNG per attestato + elenco CSV con i link di verifica. */
export async function qrZip(certs: { code: string; first_name: string; last_name: string }[], onProgress?: (n: number) => void): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  let n = 0;
  for (const c of certs) {
    zip.file(qrFilename(c), await qrPngBlob(c.code));
    onProgress?.(++n);
  }
  const csv = toCsv([['Cognome', 'Nome', 'Codice', 'Link verifica', 'File QR'], ...certs.map((c) => [c.last_name, c.first_name, c.code, verifyUrl(c.code), qrFilename(c)])]);
  zip.file('elenco_attestati.csv', csv);
  return zip.generateAsync({ type: 'blob' });
}

/** Legge un file CSV (UTF-8 o Windows-1252) separato da ; , o tab. */
export async function readCsv(file: File): Promise<string[][]> {
  const buf = await file.arrayBuffer();
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch {
    text = new TextDecoder('windows-1252').decode(buf);
  }
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/)[0] || '';
  const delim = [';', '\t', ','].sort((a, b) => first.split(b).length - first.split(a).length)[0];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) { row.push(cell.trim()); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim()); cell = '';
      if (row.some((c) => c)) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some((c) => c)) rows.push(row);
  return rows;
}
