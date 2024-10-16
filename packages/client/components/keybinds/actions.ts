import type { KeyComboSequence } from '.';

export enum KeybindAction {
  // Navigation
  NavigateChannelUp = 'navigate_channel_up',
  NavigateChannelDown = 'navigate_channel_down',
  NavigateServerUp = 'navigate_server_up',
  NavigateServerDown = 'navigate_server_down',

  AutoCompleteUp = 'auto_complete_up',
  AutoCompleteDown = 'auto_complete_down',
  AutoCompleteSelect = 'auto_complete_select',

  NavigatePreviousContext = 'navigate_previous_context',
  NavigatePreviousContextModal = 'navigate_previous_context_modal',
  NavigatePreviousContextSettings = 'navigate_previous_context_settings',

  InputSubmit = 'input_submit',
  InputCancel = 'input_cancel',
  InputForceSubmit = 'input_force_submit',

  MessagingMarkChannelRead = 'messaging_mark_channel_read',
  MessagingScrollToBottom = 'messaging_scroll_to_bottom',
  MessagingEditPreviousMessage = 'messaging_edit_previous_message',

  // Developer
  DeveloperToggleAllExperiments = 'developer_toggle_all_experiments',
}

export type KeybindActions = Record<KeybindAction, KeyComboSequence[]>;
