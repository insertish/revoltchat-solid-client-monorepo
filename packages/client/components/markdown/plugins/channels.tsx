import { clientController } from '@revolt/client';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

const RE_CHANNEL = /<#([A-z0-9]{26})>/g;

export const remarkChannels: Plugin = () => (tree) => {
  visit(
    tree,
    'text',
    (
      node: { type: 'text'; value: string },
      idx,
      parent: { children: any[] }
    ) => {
      const elements = node.value.split(RE_CHANNEL);
      if (elements.length === 1) return; // no matches

      const client = clientController.getCurrentClient();
      const newNodes = elements.map((value, index) => {
        if (index % 2) {
          const channel = client.channels.get(value);
          if (channel) {
            return {
              type: 'link',
              url: `${location.origin}${
                channel.server ? `/server/${channel.serverId}` : ''
              }/channel/${channel.id}`,
            };
          }
        }

        return {
          type: 'text',
          value,
        };
      });

      parent.children.splice(idx, 1, ...newNodes);
      return idx + newNodes.length;
    }
  );
};
