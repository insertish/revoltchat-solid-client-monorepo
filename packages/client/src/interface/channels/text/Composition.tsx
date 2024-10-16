import { useClient } from '@revolt/client';
import { debounce } from '@revolt/common';
import { useTranslation } from '@revolt/i18n';
import { modalController } from '@revolt/modal';
import { state } from '@revolt/state';
import {
  Button,
  CompositionPicker,
  FileCarousel,
  FileDropAnywhereCollector,
  FilePasteCollector,
  InlineIcon,
  MessageBox,
  MessageReplyPreview,
} from '@revolt/ui';
import type { Channel } from 'revolt.js';
import { API } from 'revolt.js';
import {
  BiRegularPlus,
  BiSolidFileGif,
  BiSolidHappyBeaming,
  BiSolidSend,
} from 'solid-icons/bi';
import { For, Match, onCleanup, onMount, Show, Switch } from 'solid-js';

interface Props {
  /**
   * Channel to compose for
   */
  channel: Channel;

  /**
   * Notify parent component when a message is sent
   */
  onMessageSend?: () => void;
}

/**
 * Tests for code block delimiters (``` at start of line)
 */
const RE_CODE_DELIMITER = new RegExp('^```', 'gm');

/**
 * Message composition engine
 */
export function MessageComposition(props: Props) {
  const t = useTranslation();
  const client = useClient();

  /**
   * Reference to the message input box
   */
  let ref: HTMLTextAreaElement | undefined;

  /**
   * Get the draft for the current channel
   * @returns Draft
   */
  function draft() {
    return state.draft.getDraft(props.channel.id);
  }

  /**
   * Keep track of last time we sent a typing packet
   */
  let isTyping: number | undefined = undefined;

  /**
   * Send typing packet
   */
  function startTyping() {
    if (typeof isTyping === 'number' && +new Date() < isTyping) return;

    const ws = client()!.events;
    if (ws.state() === 2) {
      isTyping = +new Date() + 2500;
      ws.send({
        type: 'BeginTyping',
        channel: props.channel.id,
      });
    }
  }

  /**
   * Send stop typing packet
   */
  function stopTyping() {
    if (isTyping) {
      const ws = client()!.events;
      if (ws.state() === 2) {
        isTyping = undefined;
        ws.send({
          type: 'EndTyping',
          channel: props.channel.id,
        });
      }
    }
  }

  /**
   * Stop typing after some time
   */
  const delayedStopTyping = debounce(stopTyping, 1000); // eslint-disable-line solid/reactivity

  /**
   * Send a message using the current draft
   * @param useContent Content to send
   */
  async function sendMessage(useContent?: unknown) {
    props.onMessageSend?.();

    if (typeof useContent === 'string') {
      return props.channel.sendMessage(useContent);
    }

    state.draft.sendDraft(client(), props.channel);
  }

  /**
   * Shorthand for updating the draft
   */
  function setContent(content: string) {
    state.draft.setDraft(props.channel.id, { content });
    startTyping();
  }

  /**
   * Determine whether we are in a code block
   * @param cursor Cursor position
   * @returns Whether we are in a code block
   */
  function isInCodeBlock(cursor: number): boolean {
    const contentBeforeCursor = (draft().content ?? '').substring(0, cursor);

    let delimiterCount = 0;
    for (const _delimiter of contentBeforeCursor.matchAll(RE_CODE_DELIMITER)) {
      delimiterCount++;
    }

    // Odd number of ``` delimiters before cursor => we are in code block
    return delimiterCount % 2 === 1;
  }

  /**
   * Handle key presses in input box
   * @param event Keyboard Event
   */
  function onKeyDownMessageBox(
    event: KeyboardEvent & { currentTarget: HTMLTextAreaElement }
  ) {
    const insideCodeBlock = isInCodeBlock(event.currentTarget.selectionStart);
    const usingBracketIndent =
      (event.ctrlKey || event.metaKey) &&
      (event.key === '[' || event.key === ']');

    if (
      (event.key === 'Tab' || usingBracketIndent) &&
      !event.isComposing &&
      insideCodeBlock
    ) {
      // Handle code block indentation.
      event.preventDefault();

      const indent = '  '; // 2 spaces

      const selectStart = event.currentTarget.selectionStart;
      const selectEnd = event.currentTarget.selectionEnd;
      let selectionStartColumn = 0;
      let selectionEndColumn = 0;

      const lines = (draft().content ?? '').split('\n');
      const selectLines = [];

      // Get indexes of selected lines
      let selectionBegun = false;
      let lineIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const currentLine = lines[i];
        const endOfLine = lineIndex + currentLine.length;

        if (selectStart >= lineIndex && selectStart <= endOfLine) {
          selectionBegun = true;
          selectionStartColumn = selectStart - lineIndex;
        }

        if (selectionBegun) selectLines.push(i);

        if (selectEnd <= endOfLine) {
          selectionEndColumn = selectEnd - lineIndex;
          break;
        }

        lineIndex += currentLine.length + 1; // add 1 to account for missing newline char
      }

      if ((event.shiftKey && event.key === 'Tab') || event.key === '[') {
        const whitespaceRegex = new RegExp(`(?<=^ *) {1,${indent.length}}`);

        // Used to ensure selection remains the same after indentation changes
        let charsRemoved = 0;
        let charsRemovedFirstLine = 0;

        // Remove indentation on selected lines, where possible.
        for (let i = 0; i < selectLines.length; i++) {
          const selectedLineIndex = selectLines[i];
          const currentLine = lines[selectedLineIndex];
          const result = whitespaceRegex.exec(currentLine);

          // If result == null, there's no more spacing to remove on this line.
          if (result != null) {
            lines[selectedLineIndex] = currentLine.substring(result[0].length);
            charsRemoved += result[0].length;
            if (i === 0) charsRemovedFirstLine = result[0].length;
          }
        }

        setContent(lines.join('\n'));

        // Update selection positions.
        event.currentTarget.selectionStart =
          selectStart - charsRemovedFirstLine;
        event.currentTarget.selectionEnd = selectEnd - charsRemoved;
      } else {
        // Used to ensure selection remains the same after indentation changes
        let indentsAdded = 0;

        // Add indentation to selected lines.
        for (const selectedLineIndex of selectLines) {
          const currentLine = lines[selectedLineIndex];

          if (selectStart === selectEnd && event.key === 'Tab') {
            // Insert spacing at current position instead of line start
            const beforeIndent = currentLine.slice(0, selectionStartColumn);
            const afterIndent = currentLine.slice(selectionEndColumn);

            lines[selectedLineIndex] = beforeIndent + indent + afterIndent;
          } else {
            // Insert spacing at beginning of selected line
            lines[selectedLineIndex] = indent + currentLine;
          }

          indentsAdded++;
        }

        setContent(lines.join('\n'));

        // Update selection positions.
        event.currentTarget.selectionStart = selectStart + indent.length;
        event.currentTarget.selectionEnd =
          selectEnd + indent.length * indentsAdded;
      }
    }

    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.isComposing &&
      !insideCodeBlock /*&& props.ref*/
    ) {
      event.preventDefault();
      sendMessage();
      stopTyping();
    } else {
      delayedStopTyping();
    }
  }

  /**
   * Handle ESC key being pressed
   * @param event Keyboard Event
   */
  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (state.draft.popFromDraft(props.channel.id)) {
        event.preventDefault();
      }
    } else if (
      // Don't take focus from other input elements
      !(event.target instanceof HTMLInputElement) &&
      // Don't take focus from modals
      !modalController.isOpen() &&
      // Only focus if pasting to allow copying of text elsewhere
      (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() === 'v')
    ) {
      ref?.focus();
    }
  }

  // Bind onKeyDown to the document
  onMount(() => document.addEventListener('keydown', onKeyDown));
  onCleanup(() => document.removeEventListener('keydown', onKeyDown));

  /**
   * Handle files being added to the draft.
   * @param files List of files
   */
  function onFiles(files: File[]) {
    for (const file of files) {
      if (file.size > 20_000_000) {
        alert('file too large');
      }
    }

    const validFiles = Array.from(files).filter(
      (file) => file.size <= 20_000_000
    );

    for (const file of validFiles) {
      state.draft.addFile(props.channel.id, file);
    }
  }

  /**
   * Add a file to the message
   */
  function addFile() {
    const input = document.createElement('input');
    input.accept = '*';
    input.type = 'file';
    input.multiple = true;
    input.style.display = 'none';

    input.addEventListener('change', async (e) => {
      // Get all attached files
      const files = (e.currentTarget as HTMLInputElement)?.files;

      // Remove element from DOM
      input.remove();

      // Skip execution if no files specified
      if (!files) return;
      onFiles([...files]);
    });

    // iOS requires us to append the file input
    // to DOM to allow us to add any images
    document.body.appendChild(input);
    input.click();
  }

  /**
   * Remove a file by its ID
   * @param fileId File ID
   */
  function removeFile(fileId: string) {
    state.draft.removeFile(props.channel.id, fileId);
  }

  return (
    <>
      <FileCarousel
        files={draft().files ?? []}
        getFile={state.draft.getFile}
        addFile={addFile}
        removeFile={removeFile}
      />
      <For each={draft().replies ?? []}>
        {(reply) => {
          const message = client()!.messages.get(reply.id);

          /**
           * Toggle mention on reply
           */
          function toggle() {
            state.draft.toggleReplyMention(props.channel.id, reply.id);
          }

          /**
           * Dismiss a reply
           */
          function dismiss() {
            state.draft.removeReply(props.channel.id, reply.id);
          }

          return (
            <MessageReplyPreview
              message={message}
              mention={reply.mention}
              toggle={toggle}
              dismiss={dismiss}
              self={message?.authorId === client()!.user!.id}
            />
          );
        }}
      </For>
      <MessageBox
        ref={ref}
        content={draft()?.content ?? ''}
        setContent={setContent}
        actionsStart={
          <Switch fallback={<InlineIcon size='short' />}>
            <Match
              when={
                props.channel.havePermission('UploadFiles') &&
                state.experiments.isEnabled('file_uploads')
              }
            >
              <InlineIcon size='wide'>
                <Button variant='plain' size='fluid' onPress={addFile}>
                  <BiRegularPlus size={24} />
                </Button>
              </InlineIcon>
            </Match>
          </Switch>
        }
        actionsEnd={
          <CompositionPicker sendGIFMessage={sendMessage}>
            {(triggerProps) => (
              <>
                <Show when={state.experiments.isEnabled('gif_picker')}>
                  <InlineIcon size='normal'>
                    <Button
                      variant='plain'
                      size='fluid'
                      onPress={triggerProps.onClickGif}
                    >
                      <BiSolidFileGif size={24} />
                    </Button>
                  </InlineIcon>
                </Show>
                <Show when={state.experiments.isEnabled('emoji_picker')}>
                  <InlineIcon size='normal'>
                    <Button
                      variant='plain'
                      size='fluid'
                      onPress={triggerProps.onClickEmoji}
                    >
                      <BiSolidHappyBeaming size={24} />
                    </Button>
                  </InlineIcon>
                </Show>
                <Show
                  when={state.settings.getValue('appearance:show_send_button')}
                >
                  <InlineIcon size='normal'>
                    <Button variant='plain' size='fluid' onPress={sendMessage}>
                      <BiSolidSend size={24} />
                    </Button>
                  </InlineIcon>
                </Show>

                <div ref={triggerProps.ref} />
              </>
            )}
          </CompositionPicker>
        }
        placeholder={
          props.channel.type === 'SavedMessages'
            ? t('app.main.channel.message_saved')
            : props.channel.type === 'DirectMessage'
              ? t('app.main.channel.message_who', {
                  person: props.channel.recipient?.username as string,
                })
              : t('app.main.channel.message_where', {
                  channel_name: props.channel.name as string,
                })
        }
        sendingAllowed={props.channel.havePermission('SendMessage')}
        autoCompleteConfig={{
          onKeyDown: onKeyDownMessageBox,
          client: client(),
          searchSpace: props.channel.server
            ? {
                members: client().serverMembers.filter(
                  (member) => member.id.server === props.channel.serverId
                ),
                channels: props.channel.server.channels,
              }
            : props.channel.type === 'Group'
              ? { users: props.channel.recipients, channels: [] }
              : { channels: [] },
        }}
        updateDraftSelection={(start, end) =>
          state.draft.setSelection(props.channel.id, start, end)
        }
      />
      <FilePasteCollector onFiles={onFiles} />
      <FileDropAnywhereCollector onFiles={onFiles} />
    </>
  );
}
