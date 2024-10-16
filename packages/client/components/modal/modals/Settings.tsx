import { Settings, SettingsConfigurations } from '@revolt/app';
import { Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Motion, Presence } from 'solid-motionone';

import type { PropGenerator } from '../types';

/**
 * Modal to display server information
 */
const SettingsModal: PropGenerator<'settings'> = ({
  config: configKey,
  context,
}) => {
  const config = SettingsConfigurations[configKey];

  return {
    _children: (props) => {
      return (
        <Portal mount={document.getElementById('floating')!}>
          <div
            style={{
              position: 'fixed',
              width: '100%',
              height: '100vh',
              left: 0,
              top: 0,
              'pointer-events': 'none',
            }}
          >
            <Presence>
              <Show when={props?.show}>
                <Motion.div
                  style={{
                    height: '100%',
                    'pointer-events': 'all',
                    display: 'flex',
                    background: 'var(--colours-settings-background)',
                  }}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{
                    duration: 0.3,
                    easing: [0.17, 0.67, 0.58, 0.98],
                  }}
                >
                  <Settings
                    onClose={props.onClose}
                    render={config.render}
                    title={config.title}
                    list={config.list}
                    context={context as never}
                  />
                </Motion.div>
              </Show>
            </Presence>
          </div>
        </Portal>
      );
    },
  };
};

export default SettingsModal;
