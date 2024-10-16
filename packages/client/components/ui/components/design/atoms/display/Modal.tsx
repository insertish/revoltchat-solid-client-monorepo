import type { ComponentProps, JSX } from 'solid-js';
import { For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';
import { styled } from 'solid-styled-components';

import { Button } from '../inputs/Button';
import { Typography } from './Typography';

export type Action = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  confirmation?: boolean;
  onClick: () => void | boolean | Promise<boolean>;
};

export interface Props {
  /**
   * Given content padding
   */
  padding?: string;

  /**
   * Maximum width of the modal
   */
  maxWidth?: string;

  /**
   * Maximum height of the modal
   */
  maxHeight?: string;

  /**
   * Whether inputs should be disabled
   */
  disabled?: boolean;

  /**
   * Whether the modal should be transparent
   */
  transparent?: boolean;

  /**
   * Whether the modal should not be dismissable by clicking the empty area
   */
  nonDismissable?: boolean;

  /**
   * Actions to show at the bottom of the modal
   */
  actions?: Action[] | (() => Action[]);

  /**
   * Whether to show the modal
   */
  show?: boolean;

  /**
   * Callback when modal is closed
   */
  onClose?: () => void;

  /**
   * Modal title
   */
  title?: JSX.Element;

  /**
   * Modal description
   */
  description?: JSX.Element;

  /**
   * Modal content
   */
  children?: JSX.Element;
}

/**
 * Fixed position container to centre the modal
 */
const Base = styled('div', 'Modal')<{ show?: boolean }>`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  position: fixed;
  z-index: ${(props) => props.theme!.layout.zIndex['modal']};

  max-height: 100%;
  user-select: none;

  animation-duration: 0.2s;
  animation-fill-mode: forwards;

  display: grid;
  overflow-y: auto;
  place-items: center;

  transition: ${(props) => props.theme!.transitions.medium} all;
  pointer-events: ${(props) => (props.show ? 'all' : 'none')};

  /** TODO: rgb value here */
  background: ${(props) => (props.show ? 'rgba(0, 0, 0, 0.6)' : 'transparent')};
`;

type ContainerProps = Pick<Props, 'transparent' | 'maxWidth' | 'maxHeight'> & {
  actions: boolean;
};

/**
 * Component that wraps all of the actual modal content
 */
const Container = styled.div<ContainerProps>`
  width: ${(props) => (props.maxWidth ? '100%' : 'unset')};
  max-width: min(calc(100vw - 20px), ${(props) => props.maxWidth ?? '450px'});
  max-height: min(calc(100vh - 20px), ${(props) => props.maxHeight ?? '650px'});

  margin: 20px;
  display: flex;
  flex-direction: column;

  color: ${(props) => props.theme!.colours['component-modal-foreground']};
  background: ${(props) =>
    props.transparent
      ? 'transparent'
      : props.theme!.colours['component-modal-background']};
  border-radius: ${(props) =>
    props.transparent ? 'none' : props.theme!.borderRadius.lg};
  overflow: ${(props) => (props.transparent ? 'unset' : 'hidden')};
`;

/**
 * Container for the title elements
 */
const Title = styled.div`
  padding: 1rem;
  flex-shrink: 0;
  word-break: break-word;
  gap: 8px;
  display: flex;
  flex-direction: column;
`;

/**
 * Container for the given content
 */
const Content = styled.div<Props>`
  flex-grow: 1;
  padding-top: 0;
  padding: 0 1rem 1rem;

  overflow-y: auto;
  font-size: 0.9375rem; /** FIXME */

  display: flex;
  flex-direction: column;
`;

/**
 * Container for bottom modal actions
 */
const Actions = styled('div', 'Actions')`
  flex-shrink: 0;

  gap: 8px;
  display: flex;
  padding: 0 1rem 1rem 1rem;
  flex-direction: row-reverse;
`;

/**
 * Modal component
 *
 * This component mounts itself to the body.
 */
export function Modal(props: Props) {
  const showActions = () =>
    typeof props.actions === 'function' ||
    (props.actions ? props.actions.length > 0 : false);

  return (
    <Portal mount={document.getElementById('floating')!}>
      <Base
        show={props.show}
        onClick={() => !props.nonDismissable && props.onClose?.()}
      >
        <Presence>
          <Show when={props.show}>
            <Motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, easing: [0.22, 0.54, 0.41, 1.46] }}
            >
              <Container
                actions={showActions()}
                onClick={(e) => e.stopPropagation()}
              >
                <Show when={props.title || props.description}>
                  <Title>
                    <Show when={props.title}>
                      <Typography variant='modal-title'>
                        {props.title}
                      </Typography>
                    </Show>
                    <Show when={props.description}>
                      <Typography variant='modal-description'>
                        {props.description}
                      </Typography>
                    </Show>
                  </Title>
                </Show>
                <Show when={props.children}>
                  <Content>{props.children}</Content>
                </Show>
                <Show when={showActions()}>
                  <Actions>
                    <For
                      each={
                        typeof props.actions === 'function'
                          ? props.actions()
                          : props.actions
                      }
                    >
                      {(action) => (
                        <Button
                          {...action}
                          isDisabled={props.disabled}
                          onClick={async () => {
                            if (await action.onClick()) {
                              props.onClose?.();
                            }
                          }}
                        />
                      )}
                    </For>
                  </Actions>
                </Show>
              </Container>
            </Motion.div>
          </Show>
        </Presence>
      </Base>
    </Portal>
  );
}
