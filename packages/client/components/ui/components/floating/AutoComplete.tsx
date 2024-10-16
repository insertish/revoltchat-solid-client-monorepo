import { CustomEmoji, UnicodeEmoji } from '@revolt/markdown/emoji';
import { ServerMember } from 'revolt.js';
import type { JSX } from 'solid-js';
import { For, Match, Show, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import type { AutoCompleteState } from '../../directives';
import { Avatar, Column, Row } from '../design';

/**
 * Auto complete popup
 */
export function AutoComplete(
  props: Exclude<JSX.Directives['floating']['autoComplete'], undefined>
) {
  return (
    <Base>
      <Switch>
        <Match when={props.state().matched === 'emoji'}>
          <For
            each={
              (props.state() as AutoCompleteState & { matched: 'emoji' })
                .matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Switch
                  fallback={
                    <>
                      <UnicodeEmoji
                        emoji={(match as { codepoint: string }).codepoint}
                      />{' '}
                      <Name>:{match.shortcode}:</Name>
                    </>
                  }
                >
                  <Match when={match.type === 'custom'}>
                    <CustomEmoji id={(match as { id: string }).id} />{' '}
                    <Name>:{match.shortcode}:</Name>
                  </Match>
                </Switch>
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === 'user'}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: 'user';
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Avatar src={match.user.animatedAvatarURL} size={24} />{' '}
                <Name>{match.user.displayName}</Name>
                {match.user instanceof ServerMember &&
                  match.user.displayName !== match.user.user?.username && (
                    <>
                      {' '}
                      @{match.user.user?.username}#
                      {match.user.user?.discriminator}
                    </>
                  )}
              </Entry>
            )}
          </For>
        </Match>
        <Match when={props.state().matched === 'channel'}>
          <For
            each={
              (
                props.state() as AutoCompleteState & {
                  matched: 'channel';
                }
              ).matches
            }
          >
            {(match, index) => (
              <Entry align selected={index() === props.selection()}>
                <Name>#{match.channel.name}</Name>
              </Entry>
            )}
          </For>
        </Match>
      </Switch>
    </Base>
  );
}

/**
 * Individual auto complete entry
 */
const Entry = styled(Row)<{ selected: boolean }>`
  cursor: pointer;
  padding: ${(props) => props.theme!.gap.sm} ${(props) => props.theme!.gap.md};
  background: ${(props) =>
    props.selected
      ? props.theme!.colours['component-context-menu-item-hover-background']
      : 'transparent'};
`;

/**
 * Entry name
 */
const Name = styled.div`
  font-size: 0.9em;
`;

/**
 * Auto complete container
 */
const Base = styled(Column)`
  --emoji-size: 1.4em;

  padding: ${(props) => props.theme!.gap.md} 0;
  border-radius: ${(props) => props.theme!.borderRadius.md};

  backdrop-filter: ${(props) => props.theme!.effects.blur.md};
  color: ${(props) =>
    props.theme!.colours['component-context-menu-foreground']};
  background: ${(props) =>
    props.theme!.colours['component-context-menu-background']};
`;
