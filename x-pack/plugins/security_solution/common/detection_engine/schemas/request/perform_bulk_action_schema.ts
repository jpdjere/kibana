/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as t from 'io-ts';
import { NonEmptyArray } from '@kbn/securitysolution-io-ts-types';

import {
  throttle,
  action_group as actionGroup,
  action_params as actionParams,
  action_id as actionId,
} from '@kbn/securitysolution-io-ts-alerting-types';

import {
  BulkAction,
  queryOrUndefined,
  BulkActionEditType,
  tags,
  index,
  timeline_id,
  timeline_title,
} from '../common/schemas';

const bulkActionEditPayloadTags = t.type({
  type: t.union([
    t.literal(BulkActionEditType.add_tags),
    t.literal(BulkActionEditType.delete_tags),
    t.literal(BulkActionEditType.set_tags),
  ]),
  value: tags,
});

export type BulkActionEditPayloadTags = t.TypeOf<typeof bulkActionEditPayloadTags>;

const bulkActionEditPayloadIndexPatterns = t.intersection([
  t.type({
    type: t.union([
      t.literal(BulkActionEditType.add_index_patterns),
      t.literal(BulkActionEditType.delete_index_patterns),
      t.literal(BulkActionEditType.set_index_patterns),
    ]),
    value: index,
  }),
  t.exact(t.partial({ overwrite_data_views: t.boolean })),
]);

export type BulkActionEditPayloadIndexPatterns = t.TypeOf<
  typeof bulkActionEditPayloadIndexPatterns
>;

const bulkActionEditPayloadTimeline = t.type({
  type: t.literal(BulkActionEditType.set_timeline),
  value: t.type({
    timeline_id,
    timeline_title,
  }),
});

export type BulkActionEditPayloadTimeline = t.TypeOf<typeof bulkActionEditPayloadTimeline>;

const bulkActionEditPayloadRuleActions = t.type({
  type: t.union([
    t.literal(BulkActionEditType.add_rule_actions),
    t.literal(BulkActionEditType.set_rule_actions),
  ]),
  value: t.type({
    throttle,
    actions: t.array(
      t.exact(
        t.type({
          group: actionGroup,
          id: actionId,
          params: actionParams,
        })
      )
    ),
  }),
});

export type BulkActionEditPayloadRuleActions = t.TypeOf<typeof bulkActionEditPayloadRuleActions>;

export const bulkActionEditPayload = t.union([
  bulkActionEditPayloadTags,
  bulkActionEditPayloadIndexPatterns,
  bulkActionEditPayloadTimeline,
  bulkActionEditPayloadRuleActions,
]);

export type BulkActionEditPayload = t.TypeOf<typeof bulkActionEditPayload>;

/**
 * actions that modifies rules attributes
 */
export type BulkActionEditForRuleAttributes =
  | BulkActionEditPayloadTags
  | BulkActionEditPayloadRuleActions;

/**
 * actions that modifies rules params
 */
export type BulkActionEditForRuleParams =
  | BulkActionEditPayloadIndexPatterns
  | BulkActionEditPayloadTimeline;

export const performBulkActionSchema = t.intersection([
  t.exact(
    t.type({
      query: queryOrUndefined,
    })
  ),
  t.exact(t.partial({ ids: NonEmptyArray(t.string) })),
  t.union([
    t.exact(
      t.type({
        action: t.union([
          t.literal(BulkAction.delete),
          t.literal(BulkAction.disable),
          t.literal(BulkAction.duplicate),
          t.literal(BulkAction.enable),
          t.literal(BulkAction.export),
        ]),
      })
    ),
    t.exact(
      t.type({
        action: t.literal(BulkAction.edit),
        [BulkAction.edit]: NonEmptyArray(bulkActionEditPayload),
      })
    ),
  ]),
]);

export const performBulkActionQuerySchema = t.exact(
  t.partial({
    dry_run: t.union([t.literal('true'), t.literal('false')]),
  })
);

export type PerformBulkActionSchema = t.TypeOf<typeof performBulkActionSchema>;
