import { useClient } from '@revolt/client';
import {
  CategoryButton,
  CategoryButtonGroup,
  CategoryCollapse,
  Checkbox,
  Column,
  FormGroup,
  Typography,
} from '@revolt/ui';
import { ServerFlags } from 'revolt.js';
import { BiRegularAbacus, BiRegularGlobe, BiSolidFlag } from 'solid-icons/bi';
import { Show } from 'solid-js';

import type { ServerSettingsProps } from '.';

/**
 * Server overview
 */
export default function ServerOverview(props: ServerSettingsProps) {
  const user = useClient();

  return (
    <Column gap='xl'>
      <Show when={user().user?.privileged}>
        <Column>
          <Typography variant='label'>Platform</Typography>
          <CategoryButtonGroup>
            <CategoryCollapse
              title='Flags'
              icon={<BiSolidFlag size={24} />}
              description='Set visible badges on server'
            >
              <FormGroup>
                <CategoryButton
                  icon='blank'
                  action={
                    <Checkbox
                      value={!props.server.flags}
                      onChange={() =>
                        props.server.edit({
                          flags: 0,
                        })
                      }
                    />
                  }
                  onClick={() => void 0}
                >
                  No flags
                </CategoryButton>
              </FormGroup>
              <FormGroup>
                <CategoryButton
                  icon='blank'
                  action={
                    <Checkbox
                      value={props.server.flags === ServerFlags.Official}
                      onChange={() =>
                        props.server.edit({
                          flags: ServerFlags.Official,
                        })
                      }
                    />
                  }
                  onClick={() => void 0}
                >
                  Official Server
                </CategoryButton>
              </FormGroup>
              <FormGroup>
                <CategoryButton
                  icon='blank'
                  action={
                    <Checkbox
                      value={props.server.flags === ServerFlags.Verified}
                      onChange={() =>
                        props.server.edit({
                          flags: ServerFlags.Verified,
                        })
                      }
                    />
                  }
                  onClick={() => void 0}
                >
                  Verified Server
                </CategoryButton>
              </FormGroup>
            </CategoryCollapse>
            <FormGroup>
              <CategoryButton
                description='Message counts will be collected for server'
                icon={<BiRegularAbacus size={24} />}
                action={
                  <Checkbox
                    value={!!props.server.analytics}
                    onChange={(analytics) =>
                      props.server.edit({
                        analytics,
                      })
                    }
                  />
                }
                onClick={() => void 0}
              >
                Analytics
              </CategoryButton>
            </FormGroup>
            <FormGroup>
              <CategoryButton
                description='Server can be joined from Discover'
                icon={<BiRegularGlobe size={24} />}
                action={
                  <Checkbox
                    value={!!props.server.discoverable}
                    onChange={(discoverable) =>
                      props.server.edit({
                        discoverable,
                      })
                    }
                  />
                }
                onClick={() => void 0}
              >
                Public Server
              </CategoryButton>
            </FormGroup>
          </CategoryButtonGroup>
        </Column>
      </Show>
    </Column>
  );
}
