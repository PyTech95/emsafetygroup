import { useAsset } from '../lib/assets';

interface EmSafetyLogoProps {
  variant?: 'dark' | 'light' | 'navy';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
  showSlogan?: boolean;
  sloganPlacement?: 'below' | 'right' | 'centered';
  markOnly?: boolean;
}

export default function EmSafetyLogo({
  variant = 'navy',
  size = 'md',
  className = '',
  showSlogan = true,
  sloganPlacement = 'below',
}: EmSafetyLogoProps) {
  const asset = useAsset();
  const isLight = variant === 'light';

  const heightClass = {
    xs: 'h-10 sm:h-11',
    sm: 'h-14',
    md: 'h-[81px] sm:h-[107px]',
    lg: 'h-[77px] sm:h-[97px]',
    xl: 'h-[117px] sm:h-[135px]',
  }[size];

  const sloganSizeClass = {
    xs: 'text-[10px] leading-[1.25]',
    sm: 'text-[11px] sm:text-[12px] leading-[1.3]',
    md: 'text-[13px] sm:text-[14.5px] leading-[1.32]',
    lg: 'text-[15px] sm:text-[17px] leading-[1.35]',
    xl: 'text-[18px] sm:text-[21px] leading-[1.35]',
  }[size];

  const img = (
    <img
      src={asset('/assets/images/em-logo.png')}
      alt="E.M Safety — Consulenze e Formazioni"
      className={`${heightClass} w-auto object-contain [filter:drop-shadow(0_3px_8px_rgba(23,23,23,0.22))] ${
        isLight ? 'bg-white rounded-lg px-3 py-1.5' : ''
      }`}
    />
  );

  const compact = sloganPlacement === 'below' && (size === 'xs' || size === 'sm');
  const slogan = showSlogan ? (
    compact ? (
      <div
        className={`font-sans font-light text-[8.5px] leading-[1.35] max-w-[180px] ${
          isLight ? 'text-neutral-300' : 'text-neutral-600'
        }`}
        data-testid="em-safety-slogan"
      >
        Costruiamo Sistemi che trasformano la compliance in Valore aggiunto
      </div>
    ) : (
      <div
        className={`font-sans font-light tracking-wide ${sloganSizeClass} ${
          isLight ? 'text-neutral-300' : 'text-neutral-700'
        } ${sloganPlacement === 'centered' ? 'text-center' : 'text-left'}`}
        data-testid="em-safety-slogan"
      >
        <div className="whitespace-nowrap">Costruiamo Sistemi che</div>
        <div className="whitespace-nowrap">trasformano la compliance</div>
        <div className="whitespace-nowrap">in Valore aggiunto</div>
      </div>
    )
  ) : null;

  return (
    <span
      className={`inline-flex select-none ${
        sloganPlacement === 'right' ? 'items-center gap-4' : 'flex-col items-start gap-2'
      } ${className}`}
      data-testid="em-safety-logo"
    >
      {img}
      {slogan}
    </span>
  );
}
