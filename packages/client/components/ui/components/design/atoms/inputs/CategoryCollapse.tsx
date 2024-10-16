import type { ComponentProps, JSX } from 'solid-js';
import { createSignal, Match, splitProps, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Column } from '../../layout';
import { CategoryButton } from './CategoryButton';

type Props = Omit<
  ComponentProps<typeof CategoryButton>,
  'onClick' | 'children'
> & {
  children?: JSX.Element;
  title?: JSX.Element;

  scrollable?: boolean;
};

/**
 * Category button with collapsed children (Fluent)
 */
export function CategoryCollapse(props: Props) {
  const [local, remote] = splitProps(props, ['action', 'children']);

  const [opened, setOpened] = createSignal(false);

  /**
   * Toggle the opened state and scroll to the beginning of contents
   */
  const toggleOpened = () => {
    const openedState = opened();

    if (!openedState) {
      column.scroll({ top: 0 });
    }

    setOpened(!openedState);
  };

  let details: HTMLDivElement;
  let column: HTMLDivElement;

  /**
   * Recalculate the column height for transition
   */
  const updatedHeight = () => {
    const calculatedHeight = opened() ? Math.min(column.scrollHeight, 340) : 0;

    return `${calculatedHeight}px`;
  };

  return (
    <Details
      ref={details!}
      onClick={toggleOpened}
      class={opened() ? 'open' : undefined}
    >
      <summary>
        <CategoryButton
          {...remote}
          action={[local.action, 'collapse'].flat()}
          onClick={() => void 0}
        >
          {props.title}
        </CategoryButton>
      </summary>
      <Switch
        fallback={
          <StaticInnerColumn
            gap='xs'
            ref={column!}
            style={{ height: updatedHeight() }}
          >
            {props.children}
          </StaticInnerColumn>
        }
      >
        <Match when={props.scrollable}>
          <InnerColumn
            gap='xs'
            ref={column!}
            style={{ height: updatedHeight() }}
            use:scrollable
          >
            {props.children}
          </InnerColumn>
        </Match>
      </Switch>
    </Details>
  );
}

/**
 * Column with inner content
 */
const InnerColumn = styled(Column)`
  border-radius: ${(props) => props.theme!.borderRadius.md};
  transition: 0.3s;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

/**
 * Non-scrollable inner column
 */
const StaticInnerColumn = styled(InnerColumn)`
  overflow: hidden;
`;

/**
 * Parent base component
 */
const Details = styled.div`
  summary {
    transition: 0.3s;
  }

  &:not(.open) ${InnerColumn.class} {
    opacity: 0;
    pointer-events: none;
  }

  /* add transition to the icon */
  summary div:last-child svg {
    transition: 0.3s;
  }

  /* rotate chevron when it is open */
  &.open summary div:last-child svg {
    transform: rotate(180deg);
  }

  /* add additional padding between top button and children when it is open */
  &.open summary {
    margin-bottom: ${(props) => props.theme!.gap.xs};
  }

  /* hide the default details component marker */
  summary {
    list-style: none;
  }

  summary::marker,
  summary::-webkit-details-marker {
    display: none;
  }

  /* connect elements vertically */
  > :not(summary) .CategoryButton {
    /* and set child backgrounds */
    background: ${(props) =>
      props.theme!.colours['component-categorybtn-background-collapse']};
  }

  /*> :not(summary) > :last-child.CategoryButton {
    margin-bottom: 8px;
  }*/
`;
