/**
 * SVG masks required in other components
 */
export function Masks() {
  return (
    <svg width={0} height={0} style={{ position: 'fixed' }}>
      <defs>
        <mask id='holepunch-top-left'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='5' cy='5' r='7' fill={'black'} />
        </mask>
        <mask id='holepunch-top-right'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='27' cy='5' r='7' fill={'black'} />
        </mask>
        <mask id='holepunch-bottom-right'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='27' cy='27' r='7' fill={'black'} />
        </mask>
        <mask id='holepunch-right'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='27' cy='5' r='7' fill={'black'} />
          <circle cx='27' cy='27' r='7' fill={'black'} />
        </mask>
        <mask id='holepunch-overlap'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='32' cy='16' r='18' fill='black' />
        </mask>
        <mask id='holepunch-overlap-subtle'>
          <rect x='0' y='0' width='32' height='32' fill='white' />
          <circle cx='33' cy='16' r='18' fill='black' />
        </mask>
        <mask id='accessible-status-offline'>
          <circle cx='27' cy='27' r='5' fill='white' />
          <circle cx='27' cy='27' r='3' fill='black' />
        </mask>
        <mask id='accessible-status-idle'>
          <circle cx='27' cy='27' r='5' fill='white' />
          <circle cx='25' cy='25' r='4' fill='black' />
        </mask>
        <mask id='accessible-status-busy'>
          <circle cx='27' cy='27' r='5' fill='white' />
          <line
            x1='24'
            y1='27'
            x2='30'
            y2='27'
            stroke='black'
            stroke-width={2}
          />
        </mask>
        <mask id='accessible-status-focus'>
          <circle cx='27' cy='27' r='5' fill='white' />
          <circle cx='27' cy='27' r='4' fill='black' />
          <circle cx='27' cy='27' r='2' fill='white' />
        </mask>
      </defs>
    </svg>
  );
}
