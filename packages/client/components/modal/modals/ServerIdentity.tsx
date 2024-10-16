import { useTranslation } from '@revolt/i18n';
import { Avatar, Column, Input, MessageContainer, Username } from '@revolt/ui';
import type { ServerMember } from 'revolt.js';
import type { Accessor } from 'solid-js';
import { createEffect, createSignal } from 'solid-js';

import type { PropGenerator } from '../types';

function Preview(props: { nickname: Accessor<string>; member: ServerMember }) {
  createEffect(() => {
    console.info('n:', props.nickname());
  });

  return (
    <>
      <span>Preview</span>
      <MessageContainer
        avatar={<Avatar size={36} src={props.member.animatedAvatarURL} />}
        timestamp={new Date()}
        username={
          <Username
            username={props.nickname()}
            colour={props.member.roleColour!}
          />
        }
      >
        Hello {props.nickname()}!
      </MessageContainer>
    </>
  );
}

/**
 * Modal to update the user's server identity
 */
const ServerIdentity: PropGenerator<'server_identity'> = (props) => {
  const t = useTranslation();
  const [nickname, setNickname] = createSignal(props.member.nickname ?? '');

  const [avatarFile, setAvatarFile] = createSignal<File>();

  return {
    title: t('app.special.popovers.server_identity.title', {
      server: props.member.server!.name,
    }),
    children: (
      <Column>
        {/* <span>developer ui</span> */}
        <span>{t('app.special.popovers.server_identity.nickname')}</span>
        <Input
          value={nickname()}
          onChange={(e) => setNickname(e.currentTarget.value)}
        />
        {/* <span>{t("app.special.popovers.server_identity.avatar")}</span> */}
        {/* <Avatar size={64} src={props.member.animatedAvatarURL} interactive /> */}
        {/* <Preview nickname={nickname} member={props.member} /> */}
      </Column>
    ),
    actions: [
      {
        children: t('app.special.modals.actions.save'),
        async onClick() {
          await props.member.edit(
            nickname()
              ? {
                  nickname: nickname(),
                }
              : {
                  remove: ['Nickname'],
                }
          );

          return true;
        },
      },
    ],
  };
};

export default ServerIdentity;
