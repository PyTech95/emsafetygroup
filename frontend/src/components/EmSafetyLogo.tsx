import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';

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
  const t = useText();
  const isLight = variant === 'light';

  const heightClass = {
    xs: 'h-10 sm:h-11',
    sm: 'h-[60px] sm:h-[84px] lg:h-[98px]',
    md: 'h-[81px] sm:h-[107px]',
    lg: 'h-[80px] sm:h-[100px]',
    xl: 'h-[117px] sm:h-[135px]',
  }[size];

  const sloganSizeClass = {
    xs: 'text-[10px] leading-[1.25]',
    sm: 'text-[11px] sm:text-[12.5px] lg:text-[13.5px] leading-[1.35]',
    md: 'text-[13px] sm:text-[14.5px] leading-[1.32]',
    lg: 'text-[14px] sm:text-[16px] leading-[1.35]',
    xl: 'text-[18px] sm:text-[21px] leading-[1.35]',
  }[size];

  const img = (
    <img
      src={asset('/assets/images/em-logo.png')}
      alt="E.M Safety — Consulenze e Formazioni"
      width={827}
      height={480}
      decoding="async"
      className={`${heightClass} w-auto object-contain select-none ${isLight ? 'bg-white rounded-lg px-3 py-1.5' : ''}`}
      style={{ imageRendering: 'auto' }}
    />
  );

  const lines = [t('brand.slogan1'), t('brand.slogan2'), t('brand.slogan3')];
  const compact = sloganPlacement === 'below' && (size === 'xs' || size === 'sm');
  const slogan = showSlogan ? (
    compact ? (
      <div className={`font-sans font-light text-[8.5px] leading-[1.35] max-w-[180px] ${isLight ? 'text-neutral-300' : 'text-neutral-600'}`} data-testid="em-safety-slogan">
        {lines.join(' ')}
      </div>
    ) : (
      <div
        className={`font-sans font-medium tracking-wide ${sloganSizeClass} ${isLight ? 'text-neutral-300' : 'text-[#0b2545]'} ${
          sloganPlacement === 'centered' ? 'text-center' : 'text-left'
        } ${sloganPlacement === 'right' ? 'hidden sm:block' : ''}`}
        data-testid="em-safety-slogan"
      >
        {lines.map((l) => (
          <div key={l} className="whitespace-nowrap">{l}</div>
        ))}
      </div>
    )
  ) : null;

  return (
    <span
      className={`inline-flex select-none ${sloganPlacement === 'right' ? 'items-center gap-3 sm:gap-4' : 'flex-col items-start gap-2'} ${className}`}
      data-testid="em-safety-logo"
    >
      {img}
      {slogan}
    </span>
  );
}
