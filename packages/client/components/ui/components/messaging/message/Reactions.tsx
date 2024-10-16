import { useTranslation } from '@revolt/i18n';
import { Emoji } from '@revolt/markdown';
import { useUsers } from '@revolt/markdown/users';
import type { API } from 'revolt.js';
import { createMemo, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';

import { OverflowingText, Row, Typography } from '../../design';
import { Tooltip } from '../../floating';

interface Props {
  /**
   * Reactions data
   */
  reactions?: Map<string, Set<string>>;

  /**
   * Interactions
   */
  interactions: API.Message['interactions'];

  /**
   * ID of current user
   */
  userId?: string;

  /**
   * Add a reaction
   * @param reaction ID
   */
  addReaction(reaction: string): void;

  /**
   * Remove a reaction
   * @param reaction ID
   */
  removeReaction(reaction: string): void;
}

/**
 * Message reactions
 */
export function Reactions(props: Props) {
  /**
   * Determine two lists of 'required' and 'optional' reactions
   */
  const lists = createMemo(() => {
    const required = new Set<string>();
    const optional = new Set<string>();

    if (props.interactions?.reactions) {
      for (const reaction of props.interactions.reactions) {
        required.add(reaction);
      }
    }

    if (props.reactions) {
      for (const key of props.reactions.keys()) {
        if (!required.has(key)) {
          optional.add(key);
        }
      }
    }

    return {
      required: Array.from(required),
      optional: Array.from(optional),
    };
  });

  /**
   * Determine whether we are showing any reactions
   * @param both Whether to check if both are present
   * @returns Number of either required or optional if present
   */
  const hasReactions = (both?: boolean) => {
    const { required, optional } = lists();
    return both
      ? required.length && optional.length
      : required.length || optional.length;
  };

  return (
    <Show when={hasReactions()}>
      <List>
        <For each={lists().required}>
          {(entry) => (
            <Reaction
              reaction={entry}
              active={props.reactions?.get(entry)?.has(props.userId!)}
              users={props.reactions?.get(entry)}
              addReaction={props.addReaction}
              removeReaction={props.removeReaction}
            />
          )}
        </For>
        <Show when={hasReactions(true)}>
          <Divider />
        </Show>
        <For each={lists().optional}>
          {(entry) => (
            <Reaction
              reaction={entry}
              active={props.reactions?.get(entry)?.has(props.userId!)}
              users={props.reactions?.get(entry)}
              addReaction={props.addReaction}
              removeReaction={props.removeReaction}
            />
          )}
        </For>
        <AddReaction class='add'>{'+'}</AddReaction>
      </List>
    </Show>
  );
}

/**
 * Render the reaction
 */
function Reaction(props: {
  reaction: string;
  active?: boolean;
  users?: Set<string>;
  addReaction(id: string): void;
  removeReaction(id: string): void;
}) {
  const t = useTranslation();
  const users = useUsers([...(props.users?.values() ?? [])]);

  /**
   * Handle toggling reaction
   */
  function onClick() {
    if (props.active) {
      props.removeReaction(props.reaction);
    } else {
      props.addReaction(props.reaction);
    }
  }

  /**
   * Generate list of users
   */
  const peopleList = () => {
    const all = users();
    const list = all.filter((user) => user);
    const unknown =
      all.filter((user) => !user).length + Math.max(0, list.length - 3);

    const usernames = list
      .slice(0, 2)
      .map((user) => user?.username)
      .join(', ');

    if (unknown) {
      if (usernames) {
        return t('app.main.channel.reactions.others_reacted', {
          userlist: usernames,
          count: unknown.toString(),
        });
      } else if (unknown === 1) {
        return t('app.main.channel.reactions.single_reacted');
      } else {
        return t('app.main.channel.reactions.unknown_reacted', {
          count: unknown.toString(),
        });
      }
    } else {
      return t('app.main.channel.reactions.people_reacted', {
        people: usernames,
      });
    }
  };

  return (
    <Tooltip
      placement='top'
      content={() => (
        <Row align gap='lg'>
          <span style={{ '--emoji-size': '3em' }}>
            <Emoji emoji={props.reaction} />
          </span>
          <Typography variant='messages'>
            <PeopleList>{peopleList()}</PeopleList>
          </Typography>
        </Row>
      )}
      aria={peopleList()}
    >
      <ReactionBase active={props.active} onClick={onClick}>
        <Emoji emoji={props.reaction} /> {props.users?.size || 0}
      </ReactionBase>
    </Tooltip>
  );
}

/**
 * Reaction styling
 */
const ReactionBase = styled('div', 'Reaction')<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: ${(props) => props.theme!.gap.md};

  cursor: pointer;
  user-select: none;
  vertical-align: middle;

  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  color: ${(props) =>
    props.theme!.colours[
      `messaging-component-reaction${
        props.active ? '-selected' : ''
      }-foreground`
    ]};
  background: ${(props) =>
    props.theme!.colours[
      `messaging-component-reaction${
        props.active ? '-selected' : ''
      }-background`
    ]};
  transition: ${(props) => props.theme!.transitions.fast} all;

  font-weight: 600;
  font-feature-settings: 'tnum' 1;

  img {
    width: 1.2em;
    height: 1.2em;
    object-fit: contain;
  }

  &:hover {
    filter: brightness(0.9);
  }

  &:active {
    filter: brightness(0.75);
  }
`;

/**
 * Add reaction button styling
 */
const AddReaction = styled(ReactionBase)`
  opacity: 0;
  justify-content: center;

  font-size: var(--emoji-size);
  background: ${(props) =>
    props.theme!.colours['messaging-component-reaction-background']};

  height: 33px;
  aspect-ratio: 1/1;
  padding: ${(props) => props.theme!.gap.sm};
`;

/**
 * List divider
 */
const Divider = styled.div`
  width: 1px;
  height: 14px;
  background: ${(props) =>
    props.theme!.colours['messaging-component-reaction-foreground']};
`;

/**
 * Base component for the reactions list
 */
const List = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(props) => props.theme!.gap.sm};

  &:hover .add {
    opacity: 1;
  }
`;

/**
 * List of people who have reacted
 */
const PeopleList = styled(OverflowingText)`
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  max-width: 200px;
  white-space: pre-wrap;
`;
