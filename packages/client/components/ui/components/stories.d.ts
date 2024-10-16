import type { Component, ComponentProps } from 'solid-js';
import type { JSX } from 'solid-js';

type Decorator<T extends Component<P>, P = object> = Component<{
  children: JSX.Element;
  childProps: ComponentProps<T>;
}>;

declare interface Story<T extends Component<P>, P = object> {
  title: string;
  props?: ComponentProps<T>;
  decorators?: Decorator<T, P>[];
  component?: T;
  skipRegressionTests?: boolean;
}

declare interface ComponentStory<T extends Component<P>, P = object> {
  category?: string;
  component: T;
  stories: Story<T, P>[];
  props?: ComponentProps<T>;
  decorators?: Decorator<T, P>[];
  propTypes?: Record<
    keyof ComponentProps<T>,
    | 'string'
    | 'boolean'
    | 'number'
    | 'function'
    | 'component'
    | (string | boolean)[]
  >;
  effects?: Record<
    keyof ComponentProps<T>,
    (props: ComponentProps<T>, ...args: unknown[]) => Partial<ComponentProps<T>>
  >;
}
