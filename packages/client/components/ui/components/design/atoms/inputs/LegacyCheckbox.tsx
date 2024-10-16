import { BiRegularCheck } from 'solid-icons/bi';
import type { JSX } from 'solid-js';
import { createSignal, Show, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

const Base = styled('label')`
  gap: 10px;
  padding: 4px;
  display: flex;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: ${(props) => props.theme!.borderRadius['md']};
  transition: 0.1s ease background-color;

  input {
    display: none;
  }

  &:hover {
    background: var(--unset-bg);

    .check {
      visibility: visible;
      opacity: 1;
    }
  }

  &[disabled] {
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  gap: 3px;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme!.colours['foreground']};
`;

const Title = styled.div`
  font-size: 0.9375rem;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const Description = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--unset-fg);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

const Checkmark = styled.div<Pick<Props, 'value'>>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--unset-fg);
  border-radius: ${(props) => props.theme!.borderRadius['md']};
  background: var(--unset-bg);
  flex-shrink: 0;
  margin: 4px;
  transition: 0.1s ease-in-out all;

  .check {
    transition: inherit;
    color: var(--unset-fg);
    visibility: hidden;
    opacity: 0;
  }

  ${(props) =>
    props.value
      ? `
    border-color: var(--unset-fg);
    background: var(--unset-bg);

    .check {
      visibility: visible;
      opacity: 1;
      color: var(--accent-contrast);
    }
  `
      : ''}
`;

export type Props = {
  readonly disabled?: boolean;

  readonly title?: JSX.Element;
  readonly description?: JSX.Element;

  readonly name?: string;
  readonly value?: boolean;
  readonly onChange?: (state: boolean) => void;
} & Omit<
  JSX.LabelHTMLAttributes<HTMLLabelElement>,
  'value' | 'children' | 'onChange' | 'title'
>;

export function LegacyCheckbox(props: Props) {
  const [local, others] = splitProps(props, [
    'disabled',
    'title',
    'description',
    'name',
    'value',
    'onChange',
  ]);

  const [controlledValue, setControlledValue] = createSignal(false);
  const checked = () => local.value ?? controlledValue();

  return (
    <Base {...others}>
      <Content>
        <Show when={local.title}>
          <TitleContent>
            <Title>{local.title}</Title>
          </TitleContent>
        </Show>
        <Show when={local.description}>
          <Description>{local.description}</Description>
        </Show>
      </Content>
      <input
        name={local.name}
        type='checkbox'
        checked={checked()}
        onChange={() =>
          typeof local.value !== 'undefined'
            ? !local.disabled && local.onChange?.(!local.value)
            : setControlledValue((v) => !v)
        }
      />
      <Checkmark value={checked()} class='checkmark'>
        <BiRegularCheck size={20} class='check' />
      </Checkmark>
    </Base>
  );
}
