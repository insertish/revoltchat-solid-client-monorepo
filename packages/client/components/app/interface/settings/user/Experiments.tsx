import { state } from '@revolt/state';
import {
  AVAILABLE_EXPERIMENTS,
  EXPERIMENTS,
} from '@revolt/state/stores/Experiments';
import {
  CategoryButton,
  CategoryButtonGroup,
  Checkbox,
  FormGroup,
} from '@revolt/ui';
import { For } from 'solid-js';

/**
 * Experiments
 */
export default function Experiments() {
  return (
    <CategoryButtonGroup>
      <For each={AVAILABLE_EXPERIMENTS}>
        {(key) => (
          <FormGroup>
            <CategoryButton
              action={
                <Checkbox
                  value={state.experiments.isEnabled(key)}
                  onChange={(enabled) =>
                    state.experiments.setEnabled(key, enabled)
                  }
                />
              }
              description={EXPERIMENTS[key].description}
              onClick={() => void 0}
            >
              {EXPERIMENTS[key].title}
            </CategoryButton>
          </FormGroup>
        )}
      </For>
    </CategoryButtonGroup>
  );
}
