import type { Handler } from 'mdast-util-to-hast';
import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

import type { CustomComponentProps } from './remarkRegexComponent';

const Spoiler = styled('span', 'Spoiler')<{ shown: boolean }>`
  padding: 0 2px;
  border-radius: ${(props) => props.theme!.borderRadius.md};

  cursor: ${(props) => (props.shown ? 'auto' : 'pointer')};
  user-select: ${(props) => (props.shown ? 'all' : 'none')};
  color: ${(props) =>
    props.shown ? props.theme!.colours.background : 'transparent'};
  background: ${(props) =>
    props.shown ? props.theme!.colours.foreground : '#151515'};

  > * {
    opacity: ${(props) => (props.shown ? 1 : 0)};
    pointer-events: ${(props) => (props.shown ? 'unset' : 'none')};
  }
`;

export function RenderSpoiler(props: CustomComponentProps & { children: any }) {
  const [shown, setShown] = createSignal(false);

  return (
    <Spoiler shown={shown()} onClick={() => setShown(true)}>
      {props.children}
    </Spoiler>
  );
}

export const remarkSpoiler: Plugin = () => (tree) => {
  visit(
    tree,
    'paragraph',
    (
      node: {
        children: (
          | { type: 'text'; value: string }
          | { type: 'paragraph'; children: any[] }
          | { type: 'spoiler'; children: any[] }
        )[];
      },
      idx,
      parent
    ) => {
      // Visitor state
      let searchingForEnd = -1;
      let spoilerContent: object[] = [];

      // Visit all children of paragraphs
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        // Find the next text element to start a spoiler from
        if (child.type === 'text') {
          const components = child.value.split('||');
          if (components.length === 1) continue; // no spoilers

          // Handle terminating spoiler tag
          if (searchingForEnd !== -1) {
            // Get all preceding elements
            const elements = node.children.splice(
              searchingForEnd,
              i - searchingForEnd
            );

            // Create a spoiler
            node.children.splice(i, 0, {
              type: 'spoiler',
              children: [
                ...spoilerContent,
                ...elements,
                {
                  type: 'text',
                  value: components.shift(),
                },
              ],
            });

            // Adjust our current index
            i += elements.length + 1;

            searchingForEnd = -1;
            spoilerContent = [];
          }

          // Replace current child with next component
          child.value = components.shift()!;

          // Check how many spoilers we have to process
          const spillOver = components.length % 2 === 1;
          const innerElements = (components.length - (spillOver ? 1 : 0)) / 2;

          // Convert inner elements into spoilers
          if (innerElements) {
            for (let j = 0; j < innerElements; j++) {
              node.children.splice(
                i + 1,
                0,
                {
                  type: 'spoiler',
                  children: [
                    {
                      type: 'text',
                      value: components.shift(),
                    },
                  ],
                },
                {
                  type: 'text',
                  value: components.shift()!,
                }
              );

              i += 2;
            }
          }

          // Update state if we are looking for the end of a spoiler
          if (spillOver) {
            searchingForEnd = i + 1;
            spoilerContent.push({
              type: 'text',
              value: components.pop(),
            });
          }
        }
      }
    }
  );
};

export const spoilerHandler: Handler = (h, node) => {
  return {
    type: 'element' as const,
    tagName: 'spoiler',
    children: h.all({
      type: 'paragraph',
      children: node.children,
    }),
    properties: {},
  };
};
