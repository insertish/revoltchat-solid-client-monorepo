import { getController } from '@revolt/common';
import type { File, ImageEmbed, VideoEmbed } from 'revolt.js';
import { Match, Show, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Column } from '../../design/layout';
import { SizedContent } from '../../design/layout/SizedContent';
import { Spoiler } from '../../design/layout/Spoiler';
import { FileInfo } from './FileInfo';
import { TextFile } from './TextFile';

/**
 * List of attachments
 */
export const AttachmentContainer = styled(Column)`
  padding: ${(props) => props.theme!.gap.md};
  border-radius: ${(props) => props.theme!.borderRadius.md};

  color: ${(props) =>
    props.theme!.colours['messaging-component-attachment-foreground']};
  background: ${(props) =>
    props.theme!.colours['messaging-component-attachment-background']};
`;

/**
 * Print human-readable file size
 */
export function humanFileSize(size: number) {
  if (size > 1e6) {
    return `${(size / 1e6).toFixed(2)} MB`;
  } else if (size > 1e3) {
    return `${(size / 1e3).toFixed(2)} KB`;
  }

  return `${size} B`;
}

/**
 * Render a given list of files
 */
export function Attachment(props: { file: File }) {
  return (
    <Switch fallback={`Could not render ${props.file.metadata.type}!`}>
      <Match when={props.file.metadata.type === 'Image'}>
        <SizedContent
          width={(props.file.metadata as ImageEmbed).width}
          height={(props.file.metadata as ImageEmbed).height}
        >
          <Show when={props.file.isSpoiler}>
            <Spoiler contentType='Image' />
          </Show>
          <img
            // TODO: cursor: pointer
            onClick={() =>
              getController('modal').push({
                type: 'image_viewer',
                file: props.file,
              })
            }
            loading='lazy'
            src={props.file.createFileURL({ max_side: 512 }, true)}
          />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === 'Video'}>
        <SizedContent
          width={(props.file.metadata as VideoEmbed).width}
          height={(props.file.metadata as VideoEmbed).height}
        >
          <Show when={props.file.isSpoiler}>
            <Spoiler contentType='Video' />
          </Show>
          <video controls preload='metadata' src={props.file.url} />
        </SizedContent>
      </Match>
      <Match when={props.file.metadata.type === 'Audio'}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
          <SizedContent width={360} height={48}>
            <audio controls src={props.file.url} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === 'File'}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
        </AttachmentContainer>
      </Match>
      <Match when={props.file.metadata.type === 'Text'}>
        <AttachmentContainer>
          <FileInfo file={props.file} />
          <SizedContent width={480} height={120}>
            <TextFile file={props.file} />
          </SizedContent>
        </AttachmentContainer>
      </Match>
    </Switch>
  );
}
