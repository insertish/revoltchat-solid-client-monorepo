import { useTranslation } from '@revolt/i18n';
import { createSignal, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  contentType?: 'Image' | 'Video';
}

const Base = styled('div')`
  z-index: 1;
  position: relative;

  .Spoiler {
    cursor: pointer;
    position: absolute;
    backdrop-filter: ${(props) => props.theme!.effects.spoiler};

    display: grid;
    place-items: center;

    span {
      padding: 0.6em;
      font-weight: 600;
      user-select: none;
      text-transform: uppercase;
      box-shadow: 0 0 8px #00000044;
      color: ${(props) => props.theme!.colours.foreground};
      border-radius: ${(props) => props.theme!.borderRadius.lg};
      background: ${(props) => props.theme!.colours.background};
    }
  }
`;

/**
 * Spoiler Element
 */
export function Spoiler(props: Props) {
  const t = useTranslation();
  const [shown, setShown] = createSignal(true);

  return (
    <Show when={shown()}>
      <Base class='container'>
        <div
          class={`Spoiler ${props.contentType}`}
          onClick={() => setShown(false)}
        >
          <span>{t('app.main.channel.misc.spoiler_attachment')}</span>
        </div>
      </Base>
    </Show>
  );
}
