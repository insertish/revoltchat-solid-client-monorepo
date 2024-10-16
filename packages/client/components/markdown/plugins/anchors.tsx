import MdChat from '@material-design-icons/svg/outlined/chat.svg?component-solid';
import MdChevronRight from '@material-design-icons/svg/outlined/chevron_right.svg?component-solid';
// import { determineLink } from "../../../lib/links";
// import { modalController } from "../../../controllers/modals/ModalController";
import MdTag from '@material-design-icons/svg/outlined/tag.svg?component-solid';
import { useClient } from '@revolt/client';
import { paramsFromPathname } from '@revolt/routing';
import { Avatar, iconSize } from '@revolt/ui';
import type { JSX } from 'solid-js';
import { splitProps, Switch } from 'solid-js';
import { cva } from 'styled-system/css';

const link = cva({
  base: {
    color: '#0088ce !important',
  },
});

const internalLink = cva({
  base: {
    verticalAlign: 'bottom',

    gap: '4px',
    paddingLeft: '2px',
    paddingRight: '6px',
    alignItems: 'center',
    display: 'inline-flex',
    textDecoration: 'none !important',

    cursor: 'pointer',
    fontWeight: 600,
    borderRadius: 'var(--borderRadius-lg)',
    color: 'var(--colours-messaging-component-mention-foreground)',
    background: 'var(--colours-messaging-component-mention-background)',
  },
});

export function RenderAnchor(
  props: JSX.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const [localProps, remoteProps] = splitProps(props, ['href']);

  // Pass-through no href or if anchor
  if (!localProps.href) return <a href={localProps.href} {...props} />;

  const internal = false;
  try {
    const url = new URL(localProps.href);
    if (
      [
        location.origin,
        'https://app.revolt.chat',
        'https://revolt.chat',
      ].includes(url.origin)
    ) {
      const newUrl = new URL(url.pathname, location.origin);

      const client = useClient();
      const params = paramsFromPathname(url.pathname);
      if (params.exactChannel) {
        return (
          <a class={internalLink()} href={newUrl.toString()}>
            <MdTag {...iconSize('1em')} />
            {client().channels.get(params.channelId!)?.name}
            {params.exactMessage && (
              <>
                <MdChevronRight {...iconSize('1em')} />
                <MdChat {...iconSize('1em')} />
              </>
            )}
          </a>
        );
      } else if (params.exactServer) {
        const server = () => client().servers.get(params.serverId!);
        return (
          <a class={internalLink()} href={newUrl.toString()}>
            <Avatar size={16} src={server()?.iconURL} /> {server()?.name}
          </a>
        );
      } else {
        return (
          <a
            {...remoteProps}
            class={link()}
            href={newUrl.toString()}
            rel='noreferrer'
          />
        );
      }
    }
  } catch (e) {}

  // TODO: link warning
  // Determine type of link

  /*const link = determineLink(localProps.href);
  if (link.type === "none") return <a {...props} />;

  // Render direct link if internal
  if (link.type === "navigate") {
    return <Link to={link.path} children={props.children} />;
  }*/

  return (
    <a
      {...remoteProps}
      class={link()}
      href={localProps.href}
      target={'_blank'}
      rel='noreferrer'
      // onClick={(ev) => modalController.openLink(href) && ev.preventDefault()}
    />
  );
}
