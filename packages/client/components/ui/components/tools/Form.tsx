/* eslint-disable solid/reactivity */
import type { ComponentProps, JSX } from 'solid-js';
import { For, Match, Show, Switch } from 'solid-js';
import type { SetStoreFunction } from 'solid-js/store';
import { createStore } from 'solid-js/store';

import { Button, Column } from '../design';
import type { Type, TypeProps, Value } from './InputElement';
import { emptyValue, InputElement } from './InputElement';

/**
 * Form schema
 */
export type FormTemplate = Record<string, Type>;

/**
 * Generate value object from form schema
 */
export type MapFormToValues<T extends FormTemplate> = {
  [Property in keyof T]: Value<T[Property]>;
};

/**
 * Generate data object from form schema
 */
type MapFormToData<T extends FormTemplate> = {
  [Property in keyof T]: TypeProps<T[Property]>;
};

/**
 * Form props
 */
export interface Props<T extends FormTemplate> {
  /**
   * Form schema
   */
  schema: T;

  /**
   * Props required for rendering form elements
   */
  data: MapFormToData<T>;

  /**
   * Handle changes to the data
   */
  onChange?: (data: MapFormToValues<T>, key: keyof T) => void;

  /**
   * Handle form submission
   */
  onSubmit?: (data: MapFormToValues<T>) => void;

  /**
   * Provide an observable object of values
   */
  store?: MapFormToValues<T>;

  /**
   * Set store function (if providing a store)
   */
  setStore?: SetStoreFunction<MapFormToValues<T>>;

  /**
   * Provide default values for keys
   */
  defaults?: Partial<MapFormToValues<T>>;

  /**
   * Submit button properties
   */
  submitBtn?: Omit<ComponentProps<typeof Button>, 'type'>;

  /**
   * Whether all elements are disabled
   */
  disabled?: boolean;

  /**
   * Custom form layout
   */
  children?: JSX.Element;
}

/**
 * Get initial values to use for the form data
 * @param schema Schema to use
 * @param defaults Defaults to apply
 * @returns Initial values
 */
export function getInitialValues<T extends FormTemplate>(
  schema: T,
  defaults?: Partial<MapFormToValues<T>>
) {
  const values: Partial<MapFormToValues<T>> = {};

  Object.keys(schema).forEach(
    (key) =>
      (values[key as keyof typeof values] =
        defaults?.[key] ?? emptyValue(schema[key]))
  );

  return values as MapFormToValues<T>;
}

/**
 * Dynamic Form component
 */
export function Form<T extends FormTemplate>(props: Props<T>) {
  const keys = Object.keys(props.schema);

  let store: MapFormToValues<T>, setStore: SetStoreFunction<typeof store>;
  if (props.store) {
    store = props.store;
    setStore = props.setStore!;
  } else {
    const newStore = createStore(
      getInitialValues(props.schema, props.defaults)
    );
    store = newStore[0];
    setStore = newStore[1];
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit?.(store);
      }}
    >
      <Column>
        <Switch
          fallback={
            <For each={keys}>
              {(key) => (
                <InputElement
                  type={props.schema[key]}
                  disabled={props.disabled}
                  value={() =>
                    store[key] as Value<(typeof props.schema)[typeof key]>
                  }
                  onChange={(value) => {
                    setStore(key as never, value as never);
                    props.onChange?.(store, key);
                  }}
                  {...props.data[key]}
                />
              )}
            </For>
          }
        >
          <Match when={props.children}>{props.children}</Match>
        </Switch>

        <Show when={props.submitBtn}>
          <Button
            type='submit'
            children='Submit'
            isDisabled={props.disabled}
            {...props.submitBtn}
          />
        </Show>
      </Column>
    </form>
  );
}

/**
 * Example on using <Form />:
    function test() {
        return (
            <Form
                schema={{
                    test: "checkbox",
                }}
                data={{
                    test: {
                        title: "this is my checkbox",
                        description: "oh yeah",
                    },
                }}
                onChange={(v, key) => {
                    if (key === "test") {
                        console.log("test changed!");
                    }
                }}
                onSubmit={(v) => {
                    v.test;
                }}
            />
        );
    }
*/
