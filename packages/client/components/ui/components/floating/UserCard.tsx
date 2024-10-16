import { getController } from '@revolt/common';
import type { JSX } from 'solid-js';
import { createMemo } from 'solid-js';
import { For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

import { ColouredText, Row, Username } from '../design';

/**
 * Base element for the card
 */
const Base = styled('div', 'Tooltip')`
  color: white;
  background: black;
  width: 400px;
  height: 400px;
`;

/**
 * User Card
 */
export function UserCard(
  props: JSX.Directives['floating']['userCard'] & object
) {
  const roleIds = createMemo(
    () => new Set(props.member?.orderedRoles.map((role) => role.id))
  );

  // Disable it while it's being developed
  if (!getController('state').experiments.isEnabled('user_card')) return null;

  return (
    <Base>
      <Show when={props.member}>
        <Username
          username={props.member!.nickname ?? props.user.username}
          colour={props.member!.roleColour!}
        />
        <br />
      </Show>
      {props.user.username}
      <Show when={props.member}>
        <br />
        <br />
        <For each={props.member!.orderedRoles}>
          {(role) => (
            <div
              onClick={() =>
                props.member!.edit({
                  roles: [...roleIds()].filter((id) => id !== role.id),
                })
              }
            >
              <ColouredText
                colour={role.colour!}
                clip={role.colour?.includes('gradient')}
              >
                {role.name}
              </ColouredText>
            </div>
          )}
        </For>
        <br />
        <Row wrap>
          <For
            each={props.member?.server?.orderedRoles.filter(
              (role) => !roleIds().has(role.id)
            )}
          >
            {(role) => (
              <span
                onClick={() =>
                  props.member!.edit({
                    roles: [...roleIds(), role.id],
                  })
                }
              >
                <ColouredText
                  colour={role.colour!}
                  clip={role.colour?.includes('gradient')}
                >
                  {role.name}
                </ColouredText>
              </span>
            )}
          </For>
        </Row>
      </Show>
    </Base>
  );
}
