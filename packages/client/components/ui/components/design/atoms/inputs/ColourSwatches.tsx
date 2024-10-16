import { BiRegularCheck, BiSolidPalette } from 'solid-icons/bi';
import { createSignal, For, Show, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  readonly presets?: string[][];
  readonly value?: string;
  readonly onChange?: (state: string) => void;
}

interface SwatchProps {
  type: 'small' | 'large';
  colour: string;
}

const DEFAULT_PRESETS = [
  [
    '#7B68EE',
    '#3498DB',
    '#1ABC9C',
    '#F1C40F',
    '#FF7F50',
    '#FD6671',
    '#E91E63',
    '#D468EE',
  ],
  [
    '#594CAD',
    '#206694',
    '#11806A',
    '#C27C0E',
    '#CD5B45',
    '#FF424F',
    '#AD1457',
    '#954AA8',
  ],
];

const Base = styled.div`
  display: flex;

  input {
    width: 0;
    padding: 0;
    border: 0;
    margin: 0;
    height: 0;
    top: 72px;
    opacity: 0;
    position: relative;
    pointer-events: none;
  }

  .overlay {
    position: relative;
    width: 0;

    div {
      width: 8px;
      height: 68px;
    }
  }
`;

const Swatch = styled.div<SwatchProps>`
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: ${(props) => props.theme?.borderRadius.md};
  background-color: ${(props) => props.colour};

  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${(props) => props.theme?.transitions.fast};

  &:hover {
    border: 2px solid ${(props) => props.theme?.colours.foreground};
  }

  svg {
    transition: inherit;
    color: ${(props) => props.theme?.colours.background};
  }

  ${(props) =>
    props.type === 'small'
      ? `
          height: 30px;
          width: 30px;
        `
      : `
          width: 68px;
          height: 68px;
        `}
`;

const Rows = styled.div`
  gap: 8px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-bottom: 4px;

  > div {
    gap: 8px;
    display: flex;
    flex-direction: row;
    padding-inline-start: 8px;
  }
`;

export function ColourSwatches(props: Props) {
  const inputRef: HTMLInputElement | null = null!;
  const [local, others] = splitProps(props, ['onChange', 'presets', 'value']);
  const [controlledValue, setControlledValue] = createSignal<string>(
    local.value || '#FD6671'
  );

  return (
    <Base {...others}>
      <input
        ref={inputRef}
        type='color'
        value={controlledValue()}
        onChange={(ev) => setControlledValue(ev.currentTarget.value)}
      />
      <Swatch
        colour={controlledValue()}
        type='large'
        onClick={() => inputRef!.click()}
      >
        <BiSolidPalette size={32} />
      </Swatch>

      <div class='overlay'>
        <div />
      </div>
      <Rows>
        <For each={local.presets ?? DEFAULT_PRESETS}>
          {(row) => (
            <div>
              <For each={row}>
                {(swatch) => (
                  <Swatch
                    colour={swatch}
                    type='small'
                    onClick={() => setControlledValue(swatch)}
                  >
                    <Show when={swatch === controlledValue()}>
                      <BiRegularCheck size={22} />
                    </Show>
                  </Swatch>
                )}
              </For>
            </div>
          )}
        </For>
      </Rows>
    </Base>
  );
}
