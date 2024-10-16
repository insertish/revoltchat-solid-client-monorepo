import { CONFIGURATION } from '@revolt/common';
import { BiRegularPlus, BiRegularXCircle, BiSolidFile } from 'solid-icons/bi';
import { For, Match, Show, Switch } from 'solid-js';
import { styled } from 'solid-styled-components';

import { ALLOWED_IMAGE_TYPES } from '../../../../state/stores/Draft';
import { OverflowingText } from '../../design';
import { generateTypographyCSS } from '../../design/atoms/display/Typography';

interface Props {
  /**
   * Files to display in carousel
   */
  files: string[];

  /**
   * Get file by ID
   * @param fileId ID
   */
  getFile(fileId: string): {
    file: File;
    dataUri: string | undefined;
  };

  /**
   * Invoke file picker to add file
   */
  addFile(): void;

  /**
   * Remove file by ID
   * @param fileId ID
   */
  removeFile(fileId: string): void;
}

/**
 * Determine file size
 * @param size Bytes
 * @returns Human-readable size
 */
export function determineFileSize(size: number) {
  if (size > 1e6) {
    return `${(size / 1e6).toFixed(2)} MB`;
  } else if (size > 1e3) {
    return `${(size / 1e3).toFixed(2)} KB`;
  }

  return `${size} B`;
}

/**
 * File carousel
 */
export function FileCarousel(props: Props) {
  return (
    <Show when={props.files.length}>
      <Container>
        <Carousel use:scrollable={{ direction: 'x' }}>
          <For each={props.files}>
            {(id, index) => {
              /**
               * Get the actual file
               */
              const file = () => props.getFile(id);

              /**
               * Handler for removing the file
               */
              const onClick = () => props.removeFile(id);

              return (
                <>
                  <Show when={index() === CONFIGURATION.MAX_ATTACHMENTS}>
                    <Divider />
                  </Show>

                  <Entry ignored={index() >= CONFIGURATION.MAX_ATTACHMENTS}>
                    <PreviewBox
                      onClick={onClick}
                      image={ALLOWED_IMAGE_TYPES.includes(file().file.type)}
                    >
                      <Switch
                        fallback={
                          <EmptyEntry>
                            <BiSolidFile size={36} />
                          </EmptyEntry>
                        }
                      >
                        <Match
                          when={ALLOWED_IMAGE_TYPES.includes(file().file.type)}
                        >
                          <Image
                            src={file().dataUri}
                            alt={file().file.name}
                            loading='eager'
                          />
                        </Match>
                      </Switch>
                      <Overlay>
                        <BiRegularXCircle size={36} />
                      </Overlay>
                    </PreviewBox>
                    <FileName>
                      <OverflowingText>{file().file.name}</OverflowingText>
                    </FileName>
                    <Size>{determineFileSize(file().file.size)}</Size>
                  </Entry>
                </>
              );
            }}
          </For>
          <EmptyEntry onClick={props.addFile} use:ripple>
            <BiRegularPlus size={48} />
          </EmptyEntry>
        </Carousel>
      </Container>
    </Show>
  );
}

/**
 * Image preview container
 */
const PreviewBox = styled.div<{ image: boolean }>`
  display: grid;
  justify-items: center;
  grid-template: 'main' ${(props) =>
      props.theme!.layout.height['attachment-preview']} / minmax(
      ${(props) => props.theme!.layout.height['attachment-preview']},
      1fr
    );

  cursor: pointer;
  overflow: hidden;
  border-radius: ${(props) => props.theme!.gap.md};

  background: ${(props) =>
    props.theme!.colours[`messaging-upload-file-background`]};
  color: ${(props) => props.theme!.colours['messaging-upload-file-foreground']};

  > * {
    grid-area: main;
  }
`;

/**
 * Image preview
 */
const Image = styled.img`
  width: 100%;
  object-fit: cover;
  margin-bottom: ${(props) => props.theme!.gap.md};
  height: ${(props) => props.theme!.layout.height['attachment-preview']};
`;

/**
 * Overlay container
 */
const Overlay = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  opacity: 0;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  transition: ${(props) => props.theme!.transitions.fast} opacity;

  &:hover {
    opacity: 1;
  }
`;

/**
 * Empty entry container
 */
const EmptyEntry = styled.div`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: ${(props) => props.theme!.layout.height['attachment-preview']};
  height: ${(props) => props.theme!.layout.height['attachment-preview']};

  cursor: pointer;
  border-radius: ${(props) => props.theme!.gap.md};
  background: var(--unset-bg);
`;

/**
 * Carousel entry container
 */
const Entry = styled.div<{ ignored: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  opacity: ${(props) => (props.ignored ? '0.4' : '1')};
`;

/**
 * File name information
 */
const FileName = styled.span`
  ${(props) =>
    generateTypographyCSS(props.theme!, 'composition-file-upload-name')}
  max-width: ${(props) => props.theme!.layout.height['attachment-preview']};
  text-align: center;
`;

/**
 * File size information
 */
const Size = styled.span`
  ${(props) =>
    generateTypographyCSS(props.theme!, 'composition-file-upload-size')}
`;

/**
 * Divider between files to be uploaded and files for next upload
 */
const Divider = styled.div`
  height: 130px;
  flex-shrink: 0;
  width: ${(props) => props.theme!.gap.sm};
  border-radius: ${(props) => props.theme!.borderRadius.md};
  background: ${(props) => props.theme!.colours['messaging-upload-divider']};
`;

/**
 * Inner carousel container
 */
const Carousel = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  overflow-x: auto !important;
  gap: ${(props) => props.theme!.gap.md};
`;

/**
 * Outer carousel container
 */
const Container = styled.div`
  display: flex;
  user-select: none;
  flex-direction: column;

  gap: ${(props) => props.theme!.gap.md};
  padding: ${(props) => props.theme!.gap.md};
  margin: ${(props) => props.theme!.gap.md} 0;
  border-radius: ${(props) => props.theme!.borderRadius.lg};

  background: ${(props) =>
    props.theme!.colours['messaging-message-box-background']};
  color: ${(props) => props.theme!.colours['messaging-message-box-foreground']};
`;
