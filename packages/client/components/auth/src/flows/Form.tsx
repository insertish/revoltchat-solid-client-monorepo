import { mapAnyError } from '@revolt/client';
import { useTranslation } from '@revolt/i18n';
import { Checkbox, Column, FormGroup, Input, Typography } from '@revolt/ui';
import type { HCaptchaFunctions } from 'solid-hcaptcha';
import HCaptcha from 'solid-hcaptcha';
import type { JSX } from 'solid-js';
import { createSignal, For, Show } from 'solid-js';
import { cva } from 'styled-system/css';

/**
 * Available field types
 */
type Field = 'email' | 'password' | 'new-password' | 'log-out' | 'username';

/**
 * Properties to apply to fields
 */
const useFieldConfiguration = () => {
  const t = useTranslation();

  return {
    email: {
      type: 'email',
      name: () => t('login.email'),
      placeholder: () => t('login.enter.email'),
    },
    password: {
      minLength: 8,
      type: 'password',
      name: () => t('login.password'),
      placeholder: () => t('login.enter.password'),
    },
    'new-password': {
      minLength: 8,
      type: 'password',
      autocomplete: 'new-password',
      name: () => t('login.new_password'),
      placeholder: () => t('login.enter.new_password'),
    },
    'log-out': {
      name: () => t('login.log_out_other'),
    },
    username: {
      minLength: 2,
      type: 'text',
      autocomplete: 'none',
      name: () => t('login.username'),
      placeholder: () => t('login.enter.username'),
    },
  };
};

const labelRow = cva({
  base: {
    gap: 'var(--gap-sm)',
    display: 'flex',
    alignItems: 'center',
  },
});

interface FieldProps {
  /**
   * Fields to gather
   */
  fields: Field[];
}

/**
 * Render a bunch of fields with preset values
 */
export function Fields(props: FieldProps) {
  const fieldConfiguration = useFieldConfiguration();
  const [failedValidation, setFailedValidation] = createSignal(false);

  /**
   * If an input element notifies us it was invalid, enable live input validation.
   */
  function onInvalid() {
    setFailedValidation(true);
  }

  return (
    <For each={props.fields}>
      {(field) => (
        <FormGroup>
          {field === 'log-out' ? (
            <label class={labelRow()}>
              <Checkbox name='log-out' />
              <Typography variant='label'>
                {fieldConfiguration['log-out'].name()}
              </Typography>
            </label>
          ) : (
            <>
              <Typography variant='label'>
                {fieldConfiguration[field].name()}
              </Typography>
              <Input
                required
                {...fieldConfiguration[field]}
                name={field}
                placeholder={fieldConfiguration[field].placeholder()}
                submissionTried={failedValidation()}
                onInvalid={onInvalid}
              />
            </>
          )}
        </FormGroup>
      )}
    </For>
  );
}

interface Props {
  /**
   * Form children
   */
  children: JSX.Element;

  /**
   * Whether to include captcha token
   */
  captcha?: string;

  /**
   * Submission handler
   */
  onSubmit: (data: FormData) => Promise<void> | void;
}

/**
 * Small wrapper for HTML form
 */
export function Form(props: Props) {
  const t = useTranslation();
  const [error, setError] = createSignal('');
  let hcaptcha: HCaptchaFunctions | undefined;

  /**
   * Handle submission
   * @param event Form Event
   */
  async function onSubmit(event: Event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    if (props.captcha) {
      if (!hcaptcha) return alert('hCaptcha not loaded!');
      const response = await hcaptcha.execute();
      formData.set('captcha', response!.response);
    }

    try {
      await props.onSubmit(formData);
    } catch (err) {
      setError(mapAnyError(err));
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Column>
        {props.children}
        <Show when={error()}>
          <Typography variant='legacy-settings-description'>
            {t(`error.${error()}`, undefined, error())}
          </Typography>
        </Show>
      </Column>
      <Show when={props.captcha}>
        <HCaptcha
          sitekey={props.captcha!}
          onLoad={(instance) => (hcaptcha = instance)}
          size='invisible'
        />
      </Show>
    </form>
  );
}
