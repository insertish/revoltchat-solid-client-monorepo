import { UserContextMenu } from '@revolt/app';
import { Avatar, ColouredText } from '@revolt/ui';
import type { Handler } from 'mdast-util-to-hast';
import { Match, Show, Switch } from 'solid-js';
import { cva } from 'styled-system/css';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import { useUser } from '../users';

const mention = cva({
  base: {
    verticalAlign: 'bottom',

    gap: '4px',
    paddingLeft: '2px',
    paddingRight: '6px',
    alignItems: 'center',
    display: 'inline-flex',

    cursor: 'pointer',
    fontWeight: 600,
    borderRadius: 'var(--borderRadius-lg)',
    color: 'var(--colours-messaging-component-mention-foreground)',
    background: 'var(--colours-messaging-component-mention-background)',
  },
  variants: {
    valid: {
      false: {
        paddingLeft: '6px',
        cursor: 'not-allowed',
      },
    },
  },
});

export function RenderMention(props: { userId: string }) {
  const user = useUser(props.userId);

  return (
    <Switch
      fallback={<span class={mention({ valid: false })}>Unknown User</span>}
    >
      <Match when={user().user}>
        <div
          class={mention()}
          use:floating={{
            userCard: user().user
              ? {
                  user: user().user!,
                  member: user().member,
                }
              : undefined,
            contextMenu: () => <UserContextMenu user={user().user!} />,
          }}
        >
          <Avatar size={16} src={user().avatar} fallback={user().username} />
          <ColouredText
            colour={user().colour!}
            clip={user().colour?.includes('gradient')}
          >
            {user().username}
          </ColouredText>
        </div>
      </Match>
    </Switch>
  );
}

const RE_MENTION = /^mailto:@([0-9ABCDEFGHJKMNPQRSTVWXYZ]{26})$/;

export const remarkMentions: Plugin = () => (tree) => {
  // <@abc> is auto-linkified somewhere in the chain, and I cannot
  // avoid this behaviour even when putting myself first in the
  // chain, so instead we just convert these links where appropriate!
  visit(
    tree,
    'link',
    (node: { type: 'link'; url: string }, idx, parent: { children: any[] }) => {
      const match = RE_MENTION.exec(node.url);
      if (match) {
        parent.children.splice(idx, 1, {
          type: 'mention',
          userId: match[1],
        });
      }
    }
  );

  // This does not work:
  /* visit(
    tree,
    "text",
    (
      node: { type: "text"; value: string },
      idx,
      parent: { children: any[] }
    ) => {
      let elements = node.value.split(RE_MENTIONS);
      if (elements.length === 1) return; // no matches

      let newNodes = elements.map((value, index) =>
        index % 2
          ? {
              type: "mention",
              userId: value,
            }
          : {
              type: "text",
              value,
            }
      );

      parent.children.splice(idx, 1, ...newNodes);
      return idx + newNodes.length;
    }
  ); */
};

export const mentionHandler: Handler = (h, node) => {
  return {
    type: 'element' as const,
    tagName: 'mention',
    children: [],
    properties: {
      userId: node.userId,
    },
  };
};
