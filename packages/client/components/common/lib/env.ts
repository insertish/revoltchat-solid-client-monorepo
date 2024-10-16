export default {
  /**
   * What API server to connect to by default.
   */
  DEFAULT_API_URL:
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_API_URL : undefined) ??
    (import.meta.env.VITE_API_URL as string) ??
    'https://revolt.chat/api',
  /**
   * What WS server to connect to by default.
   */
  DEFAULT_WS_URL:
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_WS_URL : undefined) ??
    (import.meta.env.VITE_WS_URL as string) ??
    'wss://revolt.chat/events',
  /**
   * What media server to connect to by default.
   */
  DEFAULT_MEDIA_URL:
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_WS_URL : undefined) ??
    (import.meta.env.VITE_WS_URL as string) ??
    'https://autumn.revolt.chat',
  /**
   * What proxy server to connect to by default.
   */
  DEFAULT_PROXY_URL:
    (import.meta.env.DEV ? import.meta.env.VITE_DEV_WS_URL : undefined) ??
    (import.meta.env.VITE_WS_URL as string) ??
    'https://jan.revolt.chat',
  /**
   * hCaptcha site key to use if enabled
   */
  HCAPTCHA_SITEKEY: import.meta.env.VITE_HCAPTCHA_SITEKEY as string,
  /**
   * Maximum number of replies a message can have
   */
  MAX_REPLIES: (import.meta.env.VITE_CFG_MAX_REPLIES as number) ?? 5,
  /**
   * Maximum number of attachments a message can have
   */
  MAX_ATTACHMENTS: (import.meta.env.VITE_CFG_MAX_ATTACHMENTS as number) ?? 5,
  /**
   * Session ID to set during development.
   */
  DEVELOPMENT_SESSION_ID: import.meta.env.DEV
    ? (import.meta.env.VITE_SESSION_ID as string)
    : undefined,
  /**
   * Token to set during development.
   */
  DEVELOPMENT_TOKEN: import.meta.env.DEV
    ? (import.meta.env.VITE_TOKEN as string)
    : undefined,
  /**
   * User ID to set during development.
   */
  DEVELOPMENT_USER_ID: import.meta.env.DEV
    ? (import.meta.env.VITE_USER_ID as string)
    : undefined,
};
