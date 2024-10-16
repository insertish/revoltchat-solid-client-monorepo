import { BiRegularCheck } from 'solid-icons/bi';
import { createSignal, splitProps } from 'solid-js';
import { styled } from 'solid-styled-components';

export interface Props {
  readonly disabled?: boolean;

  readonly name?: string;
  readonly value?: boolean;
  readonly onChange?: (state: boolean) => void;
}

/**
 * Checkbox
 */
export function Checkbox(props: Props) {
  const [controlledValue, setControlledValue] = createSignal(false);
  const checked = () => props.value ?? controlledValue();

  return (
    <Checkmark value={checked()} class='checkmark'>
      <BiRegularCheck size={20} class='check' />
      <Input
        name={props.name}
        type='checkbox'
        checked={checked()}
        onChange={() =>
          typeof props.value !== 'undefined'
            ? !props.disabled && props.onChange?.(!props.value)
            : setControlledValue((v) => !v)
        }
      />
    </Checkmark>
  );
}
const Input = styled.input`
  display: none;
`;

const Checkmark = styled.div<Pick<Props, 'value'>>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid
    ${(props) => props.theme!.colours['component-checkbox-foreground']};
  border-radius: ${(props) => props.theme!.borderRadius['md']};
  background: ${(props) =>
    props.theme!.colours['component-checkbox-background']};
  flex-shrink: 0;
  margin: 4px;
  transition: 0.1s ease-in-out all;

  .check {
    transition: inherit;
    fill: ${(props) =>
      props.theme!.colours['component-checkbox-foreground-check']};
    visibility: hidden;
    opacity: 0;
  }

  ${(props) =>
    props.value
      ? `
    border-color: ${props.theme!.colours['component-checkbox-foreground']};
    background: ${props.theme!.colours['component-checkbox-foreground']};

    .check {
      visibility: visible;
      opacity: 1;
      color: ${props.theme!.colours['component-checkbox-foreground-check']};
    }
  `
      : ''}
`;
