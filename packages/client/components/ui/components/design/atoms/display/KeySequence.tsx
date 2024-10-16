import {
  KeybindSequence,
  type KeyComboSequence as TKeySequence,
} from '@revolt/keybinds';
import type { Component } from 'solid-js';
import { createMemo, For } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Key } from './Key';

export interface Props {
  sequence: string | TKeySequence;
  short?: boolean;
  /** if the key should be styled in a more simple way */
  simple?: boolean;
}

const Base = styled('kbd', 'KeySequence')`
  display: inline-flex;
  place-items: center;
  flex-wrap: wrap;
  gap: 1ch;

  line-height: 1;
  font-size: 0.85em;
  font-family: ${(props) => props.theme?.fonts.monospace};

  & > kbd {
    display: inline-flex;
    align-items: center;
    gap: 0.5ch;
  }
`;

export const KeySequence: Component<Props> = (props) => {
  // accepting strings and parsing them isn't really needed other than a nice api?
  const sequence = createMemo(() =>
    typeof props.sequence === 'string'
      ? KeybindSequence.parse(props.sequence)
      : props.sequence
  );

  return (
    <Base {...props}>
      <For each={sequence()}>
        {(combo) => (
          <For each={combo}>
            {(key, index) => (
              <>
                {index() !== 0 && '+'}
                <Key {...props}>{key}</Key>
              </>
            )}
          </For>
        )}
      </For>
    </Base>
  );
};
