import { useTranslation } from '@revolt/i18n';
import type { File } from 'revolt.js';
import { createSignal, Match, onMount, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { Preloader } from '../../design/atoms/indicators';
import { Button } from '../../design/atoms/inputs';
import { Row } from '../../design/layout';
import { humanFileSize } from './Attachment';

interface Props {
  /**
   * Relevant file
   */
  file: File;
}

/**
 * Text file container
 */
const Container = styled('pre')`
  display: flex;
  overflow: auto;
  scrollbar-width: thin;
  flex-direction: column;
  color: ${(props) => props.theme!.colours['foreground']};
`;

/**
 * Maximum permissible size in bytes for auto loading text files
 */
const AUTO_LOAD_MAX_SIZE_BYTES = 50_000;

/**
 * Render contents of a text file
 */
export function TextFile(props: Props) {
  const t = useTranslation();
  const [loading, setLoading] = createSignal(false);
  const [contents, setContents] = createSignal<string | undefined>(undefined);

  /**
   * Load the file data
   */
  async function load() {
    setLoading(true);

    const res = await fetch(props.file.url);
    const data = await res.text();

    setContents(data);
  }

  onMount(() => {
    if (props.file.size && props.file.size <= AUTO_LOAD_MAX_SIZE_BYTES) {
      load();
    }
  });

  return (
    <Container>
      <Switch fallback={<Preloader type='ring' grow />}>
        <Match
          when={
            !loading() &&
            !contents() &&
            (!props.file.size || props.file.size > AUTO_LOAD_MAX_SIZE_BYTES)
          }
        >
          <Row align justify grow>
            <Button variant='secondary' onClick={load}>
              {t('app.main.channel.misc.load_file')} (
              {humanFileSize(props.file.size ?? 0)})
            </Button>
          </Row>
        </Match>
        <Match when={typeof contents() !== 'undefined'}>
          <code>{contents()}</code>
        </Match>
      </Switch>
    </Container>
  );
}
