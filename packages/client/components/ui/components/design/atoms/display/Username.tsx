import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

import { ColouredText } from './ColouredText';
import { Typography } from './Typography';

type Props = {
  /**
   * Username
   */
  username?: string;

  /**
   * Text colour
   */
  colour?: string;
} & Omit<ComponentProps<typeof Typography>, 'variant'>;

/**
 * Username
 */
export function Username(props: Props) {
  const [local, remote] = splitProps(props, ['username', 'colour']);

  return (
    <Typography {...remote} variant='username'>
      <ColouredText
        colour={local.colour!}
        clip={local.colour?.includes('gradient')}
      >
        {local.username}
      </ColouredText>
    </Typography>
  );
}
