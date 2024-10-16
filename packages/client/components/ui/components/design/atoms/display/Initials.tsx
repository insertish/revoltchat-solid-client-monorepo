export interface Props {
  /**
   * Input string
   */
  input: string;

  /**
   * Maximum length
   */
  maxLength?: number;
}

/**
 * Generate initials from some string
 * @param input Input string
 * @param maxLength Max number of initials
 * @returns Initials from string
 */
export function toInitials(input: string, maxLength = 2) {
  return input
    .split(/\s+/)
    .map((x) => x[0])
    .filter((x) => x)
    .slice(0, maxLength);
}

/**
 * Initials component
 *
 * Takes some string and displays the first letter of each word
 */
export function Initials(props: Props) {
  return <>{toInitials(props.input, props.maxLength).join('')}</>;
}
