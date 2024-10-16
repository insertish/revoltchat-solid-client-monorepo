import type { DefaultTheme } from 'solid-styled-components';
import { styled } from 'solid-styled-components';

interface Props {
  /**
   * Gap between child elements.
   */
  gap?: keyof DefaultTheme['gap'];

  /**
   * Item alignment
   */
  align?: AlignSetting | 'stretch' | true;

  /**
   * Content justification
   */
  justify?: AlignSetting | 'stretch' | true;

  /**
   * This row should grow to fit parent container.
   */
  grow?: boolean;

  /**
   * This row should wrap.
   */
  wrap?: boolean;
}

/**
 * Generic Flex Row
 */
export const Row = styled('div')<Props>`
  display: flex;
  flex-direction: row;
  flex-grow: ${(props) => (props.grow ? 1 : 'initial')};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : 'initial')};
  gap: ${(props) => props.theme!.gap[props.gap ?? 'md']};

  align-items: ${(props) =>
    props.align
      ? typeof props.align === 'string'
        ? props.align
        : 'center'
      : 'initial'};

  justify-content: ${(props) =>
    props.justify
      ? typeof props.justify === 'string'
        ? props.justify
        : 'center'
      : 'initial'};
`;
