import { Message } from '@revolt/app';
import { useTranslation } from '@revolt/i18n';
import { Avatar, Column, Initials, styled } from '@revolt/ui';
import type { API } from 'revolt.js';
import { Server, User } from 'revolt.js';

import { createFormModal } from '../form';
import type { PropGenerator } from '../types';

const CONTENT_REPORT_REASONS: API.ContentReportReason[] = [
  'Illegal',
  'IllegalGoods',
  'IllegalExtortion',
  'IllegalPornography',
  'IllegalHacking',
  'ExtremeViolence',
  'PromotesHarm',
  'UnsolicitedSpam',
  'Raid',
  'SpamAbuse',
  'ScamsFraud',
  'Malware',
  'Harassment',
  'NoneSpecified',
];

const USER_REPORT_REASONS: API.UserReportReason[] = [
  'UnsolicitedSpam',
  'SpamAbuse',
  'InappropriateProfile',
  'Impersonation',
  'BanEvasion',
  'Underage',
  'NoneSpecified',
];

/**
 * Modal to report content
 */
const ReportContent: PropGenerator<'report_content'> = (props) => {
  const t = useTranslation();

  return createFormModal({
    modalProps: {
      title: `Tell us what's wrong with this ${
        /* TEMP TODO */ props.target instanceof User
          ? 'user'
          : props.target instanceof Server
            ? 'server'
            : 'message'
      }`,
    },
    schema: {
      preview: 'custom',
      category: 'combo',
      detail: 'text',
    },
    data: {
      preview: {
        element: (
          <ContentContainer use:scrollable>
            {props.target instanceof User ? (
              <Column align='center'>
                <Avatar src={props.target.animatedAvatarURL} size={64} />
                {props.target.displayName}
              </Column>
            ) : props.target instanceof Server ? (
              <Column align='center'>
                <Avatar
                  src={props.target.animatedIconURL}
                  fallback={<Initials input={props.target.name} />}
                  size={64}
                />
                {props.target.name}
              </Column>
            ) : (
              <Message message={props.target as never} />
            )}
          </ContentContainer>
        ),
      },
      category: {
        options: [
          {
            name: 'Please select a reason',
            value: '',
            disabled: true,
            selected: true,
          },
          ...(props.target instanceof User
            ? USER_REPORT_REASONS
            : CONTENT_REPORT_REASONS
          ).map((value) => ({
            name: t(
              `app.special.modals.report.content_reason.${value}`,
              {},
              value
            ),
            value,
          })),
        ],
        field: 'Pick a category',
      },
      detail: {
        field: 'Give us some detail',
      },
    },
    callback: async ({ category, detail }) => {
      if (!category || (category === 'NoneSpecified' && !detail))
        throw 'NoReasonProvided';

      await props.client.api.post('/safety/report', {
        content:
          props.target instanceof User
            ? {
                type: 'User',
                id: props.target.id,
                report_reason: category as API.UserReportReason,
                message_id: props.contextMessage?.id,
              }
            : props.target instanceof Server
              ? {
                  type: 'Server',
                  id: props.target.id,
                  report_reason: category as API.ContentReportReason,
                }
              : {
                  type: 'Message',
                  id: props.target.id,
                  report_reason: category as API.ContentReportReason,
                },
        additional_context: detail,
      });
    },
    submit: {
      children: 'Report',
    },
  });
};

const ContentContainer = styled.div`
  max-width: 100%;
  max-height: 240px;

  > div {
    margin-top: 0 !important;
    pointer-events: none;
    user-select: none;
  }
`;

export default ReportContent;
