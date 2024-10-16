import { splitProps } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import type { DefaultTheme, StylesArg } from 'solid-styled-components';
import { css, useTheme } from 'solid-styled-components';

type TypographyProps = {
  /**
   * Which variant to use
   */
  readonly variant: keyof DefaultTheme['typography'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & JSX.HTMLAttributes<any>;

/**
 * Generate typography (JS-mapped) CSS styles from theme and variant
 * @param theme Theme
 * @param variant Variant
 * @returns (JS-mapped) CSS styles
 */
export function generateTypography(
  theme: DefaultTheme,
  variant: keyof DefaultTheme['typography']
) {
  const { fontSize, fontWeight, lineHeight, margin, textTransform, colour } =
    theme.typography[variant] ?? {};

  const styles = {
    fontSize,
    fontWeight,
    lineHeight,
    margin,
    textTransform,
  } as Record<string, string>;

  if (colour) {
    styles.color = theme.colours[colour];
  }

  return styles as StylesArg<object>;
}

/**
 * Generate typography CSS styles from theme and variant
 * @param theme Theme
 * @param variant Variant
 * @returns CSS styles
 */
export function generateTypographyCSS(
  theme: DefaultTheme,
  variant: keyof DefaultTheme['typography']
) {
  const { fontSize, fontWeight, lineHeight, margin, textTransform, colour } =
    theme.typography[variant] ?? {};

  const styles = {
    'font-size': fontSize,
    'font-weight': fontWeight,
    'line-height': lineHeight,
    margin,
    'text-transform': textTransform,
  } as Record<string, string>;

  if (colour) {
    styles.color = theme.colours[colour];
  }

  return Object.keys(styles)
    .filter((key) => styles[key])
    .map((key) => `${key}:${styles[key]};`)
    .join('');
}

/**
 * Typography component for displaying text around the app
 * @param props Text rendering options
 */
export const Typography = (props: TypographyProps) => {
  /* eslint-disable solid/reactivity, solid/components-return-once */
  const [local, others] = splitProps(props, ['variant']);

  const theme = useTheme();
  const className = css(generateTypography(theme, local.variant));

  switch (theme.typography[local.variant]?.element) {
    case 'h1':
      return <h1 class={className} {...others} />;
    case 'h2':
      return <h2 class={className} {...others} />;
    case 'h3':
      return <h3 class={className} {...others} />;
    case 'h4':
      return <h4 class={className} {...others} />;
    case 'label':
      return <label class={className} {...others} />;
    case 'div':
      return <div class={className} {...others} />;
    default:
      return <span class={className} {...others} />;
  }
  /* eslint-enable solid/reactivity, solid/components-return-once */
};
