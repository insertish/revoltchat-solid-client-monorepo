import { Match, Switch } from 'solid-js';
import { useTheme } from 'solid-styled-components';
import { styled } from 'styled-system/jsx';

export interface Props {
  unread: boolean;
  count: number;
}

/**
 * Styles for the counter
 */
const UnreadCounter = styled('div', {
  base: {
    width: '10px',
    height: '10px',
    marginTop: '-1px',
    textAlign: 'center',

    fontSize: '8px',
    fontWeight: 600,

    color: 'var(--customColours-error-onColor)',
  },
});

/**
 * Unreads count SVG graphic
 */
export function UnreadsGraphic(props: Props) {
  const theme = useTheme();

  return (
    <Switch>
      <Match when={props.count > 0}>
        <circle cx='27' cy='5' r='5' fill={theme!.customColours.error.color} />
        <foreignObject x='22' y='0' width='10' height='10'>
          <UnreadCounter>{props.count < 10 ? props.count : '9+'}</UnreadCounter>
        </foreignObject>
      </Match>
      <Match when={props.unread}>
        <circle cx='27' cy='5' r='5' fill={theme!.colours.foreground} />
      </Match>
    </Switch>
  );
}

/**
 * Standalone unreads count element
 */
export function Unreads(props: Props & { size: string }) {
  return (
    <svg viewBox='22 0 10 10' height={props.size}>
      <UnreadsGraphic {...props} />
    </svg>
  );
}
