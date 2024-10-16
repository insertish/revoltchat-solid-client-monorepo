import { Column, OverflowingText, styled } from '@revolt/ui';
import type { Accessor, Setter } from 'solid-js';
import { createMemo, For, onMount, Show } from 'solid-js';

// import MdError from "@material-design-icons/svg/filled/error.svg?component-solid";
// import MdOpenInNew from "@material-design-icons/svg/filled/open_in_new.svg?component-solid";
import type { SettingsList } from '..';
import { useSettingsNavigation } from '../Settings';
import {
  SidebarButton,
  SidebarButtonContent,
  SidebarButtonTitle,
} from './SidebarButton';

/**
 * Settings Sidebar Layout
 */
export function SettingsSidebar(props: {
  context: never;
  list: (context: never) => SettingsList;

  setPage: Setter<string | undefined>;
  page: Accessor<string | undefined>;
}) {
  const { navigate } = useSettingsNavigation();
  // const theme = useTheme();

  /**
   * Generate list of categories / links
   */
  const list = createMemo(() => props.list(props.context));

  /**
   * Select first page on load
   */
  onMount(() => {
    if (!props.page()) {
      props.setPage(list().entries[0].entries[0].id);
    }
  });

  return (
    <Base>
      <div use:invisibleScrollable>
        <Content>
          <Column gap='lg'>
            {list().prepend}
            <For each={list().entries}>
              {(category) => (
                <Show when={!category.hidden}>
                  <Column>
                    <Show when={category.title}>
                      <CategoryTitle>{category.title}</CategoryTitle>
                    </Show>
                    <Column gap='s'>
                      <For each={category.entries}>
                        {(entry) => (
                          <Show when={!entry.hidden}>
                            <SidebarButton
                              onClick={() => navigate(entry)}
                              aria-selected={
                                props.page()?.split('/')[0] ===
                                entry.id?.split('/')[0]
                              }
                            >
                              <SidebarButtonTitle>
                                {entry.icon}
                                <SidebarButtonContent>
                                  <OverflowingText>
                                    {entry.title}
                                  </OverflowingText>
                                </SidebarButtonContent>
                              </SidebarButtonTitle>
                              {/*<SidebarButtonIcon>
                                <MdOpenInNew
                                  {...iconSize(20)}
                                  fill={theme!.colour("primary")}
                                />
                                <MdError
                                  {...iconSize(20)}
                                  fill={theme!.colour("primary")}
                                />
                              </SidebarButtonIcon>*/}
                            </SidebarButton>
                          </Show>
                        )}
                      </For>
                    </Column>
                  </Column>
                </Show>
              )}
            </For>
            {list().append}
          </Column>
        </Content>
      </div>
    </Base>
  );
}

/**
 * Base layout of the sidebar
 */
const Base = styled('div', 'Sidebar')`
  display: flex;
  flex: 1 0 218px;
  padding-left: 8px;
  justify-content: flex-end;

  color: ${(props) => props.theme!.colours['settings-foreground']};
`;

/**
 * Aligned content within the sidebar
 */
const Content = styled('div', 'Content')`
  min-width: 230px;
  max-width: 300px;
  padding: 74px 0 8px;
  display: flex;
  gap: 2px;

  flex-direction: column;

  a > div {
    margin: 0;
  }
`;

/**
 * Titles for each category
 */
const CategoryTitle = styled(OverflowingText)`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0 8px;
  margin-inline-end: 20px;
  color: ${(props) => props.theme!.colours['settings-sidebar-category']};
`;
