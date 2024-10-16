import type { JSX } from 'solid-js';
import { Match } from 'solid-js';
import { createSignal, onMount, Switch } from 'solid-js';

import { Preloader } from '../design';

/**
 * Render component after other elements have been drawn to DOM
 *
 * Use this to make navigation more snappy and load in more heavy components after the fact.
 */
export function Deferred(props: { children: JSX.Element }) {
  const [render, setRender] = createSignal(false);
  onMount(() => setTimeout(() => setRender(true)));
  return (
    <Switch fallback={<Preloader type='ring' />}>
      <Match when={render()}>{props.children}</Match>
    </Switch>
  );
}
