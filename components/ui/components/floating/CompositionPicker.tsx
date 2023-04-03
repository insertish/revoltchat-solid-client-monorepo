import { useFloating } from "solid-floating-ui";
import { For, JSX, Ref, Show, createEffect, createSignal, on } from "solid-js";
import { Portal } from "solid-js/web";
import { styled } from "solid-styled-components";

import { autoUpdate, flip, offset, shift } from "@floating-ui/dom";
import { Motion, Presence } from "@motionone/solid";

import { ScrollContainer } from "../common";
import { Column, Input } from "../design";

/**
 * Base element
 */
const Base = styled(Column)`
  width: 400px;
  height: 400px;

  padding-inline-end: 5px;
`;

/**
 * Container element for the picker
 */
const SearchBar = styled(Input)`
  border-radius: 3px;
  overflow: hidden;
  border: 2px solid #ccc;
  padding: 12px;
`;

const Container = styled("div", "Picker")`
  flex-grow: 1;
  display: flex;
  height: 400px;
  flex-direction: column;
‎
  color: white;
  background-color: #242424;
  border-radius: ${(props) => props.theme!.borderRadius.md};
  padding: 10px;
‎
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
`;

const GifList = styled(ScrollContainer)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  grid-auto-rows: 200px; /* Set a fixed height */
  overflow: auto;
  padding: 4px;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
`;

interface Props {
  /**
   * User card trigger area
   * @param triggerProps Props that need to be applied to the trigger area
   */
  children: (triggerProps: {
    ref: Ref<any>;
    onClickGif: () => void;
    onClickEmoji: () => void;
  }) => JSX.Element;

  /**
   * Send a message
   */
  sendGIFMessage: (content: string) => void;
}

type GifBoxFile = {
  _id: string;
  fileName: string;
  originalFileName: string;
  extension: string;
  bucket: string;
  mimeType: string;
  uploadDate: string;
  author: string;
  size: number;
  sha512: string;
};

type Gif = {
  author: {
    _id: string;
    displayName: string;
    username: string;
    description: string;
    verified: boolean;
    avatar: GifBoxFile;
  };
  tags: string[];
  title: string;
  _id: string;
  slug: string;
  file: GifBoxFile;
  createdAt: string;
  views: number;
};

/**
 * CompositionPicker component
 *
 * Provides an emoji and GIF picker
 */
export function CompositionPicker(props: Props) {
  const [anchor, setAnchor] = createSignal<HTMLElement>();
  const [floating, setFloating] = createSignal<HTMLDivElement>();
  const [show, setShow] = createSignal(false);

  const position = useFloating(anchor, floating, {
    placement: "top-end",
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const [data, setData] = createSignal<Gif[]>([]);

  let fetched = false;

  createEffect(
    on(
      () => show(),
      (show) => {
        if (show && !fetched) {
          fetch("https://api.gifbox.me/post/popular")
            .then((x) => x.json())
            .then(setData);

          fetched = true;
        }
      }
    )
  );

  function search(query: string) {
    fetch(
      `https://api.gifbox.me/post/search?query=${encodeURIComponent(
        query
      )}&limit=25`
    )
      .then((x) => x.json())
      .then((x) => x.hits)
      .then(setData);
  }

  return (
    <>
      {props.children({
        ref: setAnchor,
        onClickGif: () => setShow(!show()),
        onClickEmoji: () => setShow(!show()),
      })}
      <Portal mount={document.getElementById("floating")!}>
        <Presence>
          <Show when={show()}>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, easing: [0.87, 0, 0.13, 1] }}
            >
              <Base
                ref={setFloating}
                style={{
                  position: position.strategy,
                  top: `${position.y ?? 0}px`,
                  left: `${position.x ?? 0}px`,
                }}
                role="tooltip"
              >
                <Container>
                  <SearchBar
                    placeholder="Type to search..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        search(e.currentTarget.value);
                      }
                    }}
                  />
                  <GifList>
                    <For each={data()}>
                      {(entry) => (
                        <div>
                          <a
                            onClick={() =>
                              props.sendGIFMessage(
                                `https://gifbox.me/view/${entry._id}-${entry.slug}`
                              )
                            }
                          >
                            <img
                              style={{ width: "100%" }}
                              src={`https://api.gifbox.me/file/${entry.file.bucket}/${entry.file.fileName}`}
                            />
                          </a>
                        </div>
                      )}
                    </For>
                  </GifList>
                </Container>
              </Base>
            </Motion>
          </Show>
        </Presence>
      </Portal>
    </>
  );
}
