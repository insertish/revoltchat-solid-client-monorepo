import MdBadge from '@material-design-icons/svg/outlined/badge.svg?component-solid';
import MdCrop169 from '@material-design-icons/svg/outlined/crop_16_9.svg?component-solid';
import MdDelete from '@material-design-icons/svg/outlined/delete.svg?component-solid';
import MdReplaceImage from '@material-design-icons/svg/outlined/edit.svg?component-solid';
import MdEditNote from '@material-design-icons/svg/outlined/edit_note.svg?component-solid';
import MdImage from '@material-design-icons/svg/outlined/image.svg?component-solid';
import { useClient } from '@revolt/client';
import { createOwnProfileResource } from '@revolt/client/resources';
import { modalController } from '@revolt/modal';
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  iconSize,
} from '@revolt/ui';
import type { User } from 'revolt.js';
import { Match, Switch } from 'solid-js';

export function EditProfileButtons(props: { user: User }) {
  const client = useClient();
  const profile = createOwnProfileResource();

  function selectImage(tag: string, cb: (id: string) => void) {
    const el = document.createElement('input');
    el.type = 'file';
    el.accept = 'image/*';

    el.onchange = async () => {
      if (el.files) {
        const [file] = el.files;
        if (file) {
          const body = new FormData();
          body.append('file', file);

          const data = await fetch(
            `${client().configuration?.features.autumn.url}/${tag}`,
            {
              method: 'POST',
              body,
            }
          ).then((res) => res.json());

          // TODO: show progress (at least pending, use mutations from tanstack query?)
          // TODO: handle errors

          cb(data.id);
        }
      }
    };

    document.body.append(el);
    el.click();
    el.remove();
  }

  function replaceAvatar() {
    selectImage('avatars', (avatar) => props.user.edit({ avatar }));
  }

  function replaceBanner() {
    selectImage('backgrounds', (background) =>
      props.user.edit({ profile: { background } }).then(() => profile.refetch())
    );
  }

  return (
    <CategoryButtonGroup>
      <CategoryButton
        description='Set a global name'
        icon={<MdBadge {...iconSize(22)} />}
        action='chevron'
        onClick={() =>
          modalController.push({
            type: 'edit_display_name',
            user: props.user,
          })
        }
      >
        Display Name
      </CategoryButton>
      <Switch
        fallback={
          <CategoryButton
            description='Set a profile picture'
            icon={<MdImage {...iconSize(22)} />}
            action='chevron'
            onClick={replaceAvatar}
          >
            Avatar
          </CategoryButton>
        }
      >
        <Match when={props.user.avatar}>
          <CategoryCollapse
            icon={<MdImage {...iconSize(22)} />}
            title='Avatar'
            description='Change or remove your profile picture'
          >
            <CategoryButton
              description='Set a new picture'
              icon={<MdReplaceImage {...iconSize(22)} />}
              action='chevron'
              onClick={replaceAvatar}
            >
              Replace Avatar
            </CategoryButton>
            <CategoryButton
              description='Remove your current avatar'
              icon={<MdDelete {...iconSize(22)} />}
              action='chevron'
              onClick={() => props.user.edit({ remove: ['Avatar'] })}
            >
              Remove Avatar
            </CategoryButton>
          </CategoryCollapse>
        </Match>
      </Switch>
      <Switch
        fallback={
          <CategoryButton
            description='Set a profile banner'
            icon={<MdCrop169 {...iconSize(22)} />}
            action='chevron'
            onClick={replaceBanner}
          >
            Banner
          </CategoryButton>
        }
      >
        <Match when={profile.data?.banner}>
          <CategoryCollapse
            icon={<MdCrop169 {...iconSize(22)} />}
            title='Banner'
            description='Change or remove your profile banner'
          >
            <CategoryButton
              description='Set a new banner'
              icon={<MdReplaceImage {...iconSize(22)} />}
              action='chevron'
              onClick={replaceBanner}
            >
              Replace Banner
            </CategoryButton>
            <CategoryButton
              description='Remove your current banner'
              icon={<MdDelete {...iconSize(22)} />}
              action='chevron'
              onClick={() => props.user.edit({ remove: ['ProfileBackground'] })}
            >
              Remove Banner
            </CategoryButton>
          </CategoryCollapse>
        </Match>
      </Switch>
      <CategoryButton
        description='Set a profile description'
        icon={<MdEditNote {...iconSize(22)} />}
        action='chevron'
      >
        Bio
      </CategoryButton>
    </CategoryButtonGroup>
  );
}
