import type { DefaultTheme } from 'solid-styled-components';
import { styled } from 'solid-styled-components';

interface Props {
  /**
   * Gap between child elements.
   */
  gap?: keyof DefaultTheme['gap'];

  /**
   * This column is a group of elements and should be visually distinct.
   */
  group?: string | true;

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
}

/**
 * Generic Flex Column
 */
export const Column = styled('div')<Props>`
  display: flex;
  flex-direction: column;
  flex-grow: ${(props) => (props.grow ? 1 : 'initial')};
  gap: ${(props) => props.theme!.gap[props.gap ?? 'md']};

  margin: ${(props) =>
    props.group
      ? `${typeof props.group === 'string' ? props.group : '16px'} 0`
      : '0'};

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
