import type { JSX } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  /**
   * Pixel width of the content
   */
  width: number;

  /**
   * Pixel height of the content
   */
  height: number;

  /**
   * The content itself
   */
  children: JSX.Element;
}

/**
 * Sized content base container
 */
const Base = styled('figure')`
  margin: 0;

  > :not(.container),
  .Spoiler {
    display: block;
    object-fit: contain;
    aspect-ratio: var(--width) / var(--height);
    border-radius: ${(props) => props.theme!.borderRadius.md};
  }

  video,
  iframe,
  .Spoiler.Video {
    min-width: ${(props) => props.theme!.layout.attachments['min-width']};
    max-width: ${(props) => props.theme!.layout.attachments['max-width']};

    min-height: ${(props) => props.theme!.layout.attachments['min-height']};
    max-height: ${(props) => props.theme!.layout.attachments['max-height']};
  }
`;

/**
 * Render tall content
 */
const Tall = styled(Base)`
  img,
  .Spoiler.Image {
    width: auto;
    min-height: ${(props) => props.theme!.layout.attachments['min-height']};
    max-height: ${(props) => props.theme!.layout.attachments['max-height']};
  }

  .Spoiler.Image {
    height: var(--height-px);
  }
`;

/**
 * Render wide content
 */
const Wide = styled(Base)`
  img,
  .Spoiler.Image {
    height: auto;
    min-width: ${(props) => props.theme!.layout.attachments['min-width']};
    max-width: ${(props) => props.theme!.layout.attachments['max-width']};
  }

  .Spoiler.Image,
  .Spoiler.Video {
    width: var(--width-px);
  }

  video,
  .Spoiler.Video {
    height: auto;
  }
`;

/**
 * Automatic message content sizing for images, videos and embeds
 */
export function SizedContent(props: Props) {
  // Height and width should never update? (maybe if we add removable attachments)
  // eslint-disable-next-line solid/reactivity
  const Base = props.height > props.width ? Tall : Wide;
  return (
    <Base
      style={{
        '--width': props.width,
        '--height': props.height,
        '--width-px': props.width + 'px',
        '--height-px': props.height + 'px',
      }}
    >
      {props.children}
    </Base>
  );
}
