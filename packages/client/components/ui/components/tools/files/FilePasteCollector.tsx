import { onCleanup, onMount } from 'solid-js';

interface Props {
  /**
   * Callback for pasted files
   * @param files List of files
   */
  onFiles: (files: File[]) => void;
}

/**
 * Utility for capturing pasted files
 */
export function FilePasteCollector(props: Props) {
  /**
   * Handle document paste event
   * @param event Event
   */
  function onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (typeof items === 'undefined') return;

    // Filter for files
    const files: File[] = [...items]
      .filter((item) => !item.type.startsWith('text/'))
      .map((item) => item.getAsFile()!)
      .filter((item) => item);

    if (files.length) {
      event.preventDefault();
      props.onFiles(files);
    }
  }

  onMount(() => document.addEventListener('paste', onPaste));
  onCleanup(() => document.removeEventListener('paste', onPaste));

  return <></>;
}
