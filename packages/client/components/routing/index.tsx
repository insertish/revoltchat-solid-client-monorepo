import { useLocation } from '@solidjs/router';
import { type Accessor } from 'solid-js';

/**
 * We re-export everything to prevent us importing @solidjs/router
 * more than once in the project, this can cause some weird behaviour
 * where it can't find the context. This is a side-effect of working
 * in a monorepo. Ideally, this should be done any time we import
 * a new library that is used in multiple components.
 */
export {
  Navigate,
  Route,
  Router,
  useBeforeLeave,
  useLocation,
  useNavigate,
  useParams,
} from '@solidjs/router';

const RE_SERVER = /\/server\/([A-Z0-9]{26})/;
const RE_CHANNEL = /\/channel\/([A-Z0-9]{26})/;
const RE_MESSAGE_ID = /\/channel\/[A-Z0-9]{26}\/([A-Z0-9]{26})/;

const RE_SERVER_EXACT = /^\/server\/([A-Z0-9]{26})$/;
const RE_CHANNEL_EXACT =
  /^(?:\/server\/[A-Z0-9]{26})?\/channel\/([A-Z0-9]{26})(?:\/[A-Z0-9]{26})?$/;
const RE_MESSAGE_ID_EXACT =
  /^(?:\/server\/[A-Z0-9]{26})?\/channel\/[A-Z0-9]{26}\/([A-Z0-9]{26})$/;

/**
 * Route parameters available globally
 */
interface GlobalParams {
  /**
   * Server ID
   */
  serverId?: string;

  /**
   * Exact match for server?
   */
  exactServer: boolean;

  /**
   * Channel ID
   */
  channelId?: string;

  /**
   * Exact match for channel?
   */
  exactChannel: boolean;

  /**
   * Message ID
   */
  messageId?: string;

  /**
   * Exact match for message?
   */
  exactMessage: boolean;
}

/**
 * Generate global params from path
 * @param pathname Path
 * @returns Params
 */
export function paramsFromPathname(pathname: string): GlobalParams {
  const params: GlobalParams = {
    exactServer: !!pathname.match(RE_SERVER_EXACT),
    exactChannel: !!pathname.match(RE_CHANNEL_EXACT),
    exactMessage: !!pathname.match(RE_MESSAGE_ID_EXACT),
  };

  // Check for server ID
  const server = pathname.match(RE_SERVER);
  if (server) {
    params.serverId = server[1];
  }

  // Check for channel ID
  const channel = pathname.match(RE_CHANNEL);
  if (channel) {
    params.channelId = channel[1];
  }

  // Check for message ID
  const message = pathname.match(RE_MESSAGE_ID);
  if (message) {
    params.messageId = message[1];
  }

  return params;
}

/**
 * Try to resolve route parameters regardless of the current position within component tree
 */
export function useSmartParams(): Accessor<GlobalParams> {
  const location = useLocation();
  return () => paramsFromPathname(location.pathname);
}
