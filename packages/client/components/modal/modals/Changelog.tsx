import { dayjs, useTranslation } from '@revolt/i18n';
import { CategoryButton, Column, styled } from '@revolt/ui';
import type { Action } from '@revolt/ui/components/design/atoms/display/Modal';
import { createSignal, For, Match, Switch } from 'solid-js';

import type { PropGenerator } from '../types';

/**
 * Changelog element
 */
type Element =
  | string
  | {
      type: 'image';
      src: string;
    };

/**
 * Changelog post
 */
export interface ChangelogPost {
  date: Date;
  title: string;
  content: Element[];
}

/**
 * Modal to display changelog
 */
const Changelog: PropGenerator<'changelog'> = (props) => {
  const t = useTranslation();

  const [log, setLog] = createSignal(props.initial);

  /**
   * Get the currently selected log
   * @returns Log
   */
  const currentLog = () =>
    typeof log() !== 'undefined' ? props.posts[log()!] : undefined;

  return {
    title: (
      <Switch fallback={t('app.special.modals.changelogs.title')}>
        <Match when={currentLog()}>{currentLog()!.title}</Match>
      </Switch>
    ),
    description: (
      <Switch fallback={t('app.special.modals.changelogs.description')}>
        <Match when={currentLog()}>
          {dayjs(currentLog()!.date).calendar()}
        </Match>
      </Switch>
    ),
    actions: () => {
      const actions: Action[] = [
        {
          variant: 'primary',
          children: t('app.special.modals.actions.close'),
          onClick: () => true,
        },
      ];

      if (currentLog()) {
        actions.push({
          variant: 'plain',
          children: t('app.special.modals.changelogs.older'),
          onClick: () => {
            setLog(undefined);
            return false;
          },
        });
      }

      return actions;
    },
    children: (
      <Switch
        fallback={
          <Column>
            <For each={props.posts}>
              {(entry, index) => {
                /**
                 * Handle changing post
                 */
                const onClick = () => setLog(index());

                return (
                  <CategoryButton onClick={onClick}>
                    {entry.title}
                  </CategoryButton>
                );
              }}
            </For>
          </Column>
        }
      >
        <Match when={currentLog()}>
          <RenderLog post={currentLog()!} />
        </Match>
      </Switch>
    ),
  };
};

/**
 * Render a single changelog post
 */
function RenderLog(props: { post: ChangelogPost }) {
  return (
    <Column>
      <For each={props.post.content}>
        {(entry) => (
          <Switch>
            <Match when={typeof entry === 'string'}>{entry as string}</Match>
            <Match when={typeof entry === 'object' && entry.type === 'image'}>
              <Image src={(entry as { src: string }).src} />
            </Match>
          </Switch>
        )}
      </For>
    </Column>
  );
}

/**
 * Image wrapper
 */
const Image = styled.img`
  border-radius: var(--border-radius);
`;

export default Changelog;
