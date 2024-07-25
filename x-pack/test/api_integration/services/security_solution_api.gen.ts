/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * NOTICE: Do not edit this file manually.
 * This file is automatically generated by the OpenAPI Generator, @kbn/openapi-generator.
 *
 * info:
 *   title: API client for tests
 *   version: Bundle (no version)
 */

import {
  ELASTIC_HTTP_VERSION_HEADER,
  X_ELASTIC_INTERNAL_ORIGIN_REQUEST,
} from '@kbn/core-http-common';
import { replaceParams } from '@kbn/openapi-common/shared';

import { AlertsMigrationCleanupRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals_migration/delete_signals_migration/delete_signals_migration.gen';
import { BulkCreateRulesRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_crud/bulk_create_rules/bulk_create_rules_route.gen';
import { BulkDeleteRulesRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_crud/bulk_delete_rules/bulk_delete_rules_route.gen';
import { BulkDeleteRulesPostRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_crud/bulk_delete_rules/bulk_delete_rules_route.gen';
import { BulkPatchRulesRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_crud/bulk_patch_rules/bulk_patch_rules_route.gen';
import { BulkUpdateRulesRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_crud/bulk_update_rules/bulk_update_rules_route.gen';
import { BulkUpsertAssetCriticalityRecordsRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/bulk_upload_asset_criticality.gen';
import { CreateAlertsMigrationRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals_migration/create_signals_migration/create_signals_migration.gen';
import { CreateAssetCriticalityRecordRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/create_asset_criticality.gen';
import { CreateRuleRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/crud/create_rule/create_rule_route.gen';
import {
  CreateUpdateProtectionUpdatesNoteRequestParamsInput,
  CreateUpdateProtectionUpdatesNoteRequestBodyInput,
} from '@kbn/security-solution-plugin/common/api/endpoint/protection_updates_note/protection_updates_note.gen';
import { DeleteAssetCriticalityRecordRequestQueryInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/delete_asset_criticality.gen';
import { DeleteRuleRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/crud/delete_rule/delete_rule_route.gen';
import { DeprecatedTriggerRiskScoreCalculationRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/risk_engine/entity_calculation_route.gen';
import { EndpointIsolateRedirectRequestBodyInput } from '@kbn/security-solution-plugin/common/api/endpoint/actions/isolate_route.gen';
import { EndpointUnisolateRedirectRequestBodyInput } from '@kbn/security-solution-plugin/common/api/endpoint/actions/unisolate_route.gen';
import {
  ExportRulesRequestQueryInput,
  ExportRulesRequestBodyInput,
} from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/export_rules/export_rules_route.gen';
import { FinalizeAlertsMigrationRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals_migration/finalize_signals_migration/finalize_signals_migration.gen';
import { FindAssetCriticalityRecordsRequestQueryInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/list_asset_criticality.gen';
import { FindRulesRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/find_rules/find_rules_route.gen';
import { GetAgentPolicySummaryRequestQueryInput } from '@kbn/security-solution-plugin/common/api/endpoint/policy/policy.gen';
import { GetAlertsMigrationStatusRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals_migration/get_signals_migration_status/get_signals_migration_status.gen';
import { GetAssetCriticalityRecordRequestQueryInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/get_asset_criticality.gen';
import {
  GetEndpointSuggestionsRequestParamsInput,
  GetEndpointSuggestionsRequestBodyInput,
} from '@kbn/security-solution-plugin/common/api/endpoint/suggestions/get_suggestions.gen';
import { GetPolicyResponseRequestQueryInput } from '@kbn/security-solution-plugin/common/api/endpoint/policy/policy.gen';
import { GetProtectionUpdatesNoteRequestParamsInput } from '@kbn/security-solution-plugin/common/api/endpoint/protection_updates_note/protection_updates_note.gen';
import {
  GetRuleExecutionEventsRequestQueryInput,
  GetRuleExecutionEventsRequestParamsInput,
} from '@kbn/security-solution-plugin/common/api/detection_engine/rule_monitoring/rule_execution_logs/get_rule_execution_events/get_rule_execution_events_route.gen';
import {
  GetRuleExecutionResultsRequestQueryInput,
  GetRuleExecutionResultsRequestParamsInput,
} from '@kbn/security-solution-plugin/common/api/detection_engine/rule_monitoring/rule_execution_logs/get_rule_execution_results/get_rule_execution_results_route.gen';
import { ImportRulesRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/import_rules/import_rules_route.gen';
import { InternalCreateAssetCriticalityRecordRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/internal_create_asset_criticality.gen';
import { InternalDeleteAssetCriticalityRecordRequestQueryInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/internal_delete_asset_criticality.gen';
import { InternalGetAssetCriticalityRecordRequestQueryInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/asset_criticality/internal_get_asset_criticality.gen';
import { ManageAlertTagsRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/alert_tags/set_alert_tags/set_alert_tags.gen';
import { PatchRuleRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/crud/patch_rule/patch_rule_route.gen';
import {
  PerformBulkActionRequestQueryInput,
  PerformBulkActionRequestBodyInput,
} from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/bulk_actions/bulk_actions_route.gen';
import { PerformRuleUpgradeRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/prebuilt_rules/perform_rule_upgrade/perform_rule_upgrade_route.gen';
import { PreviewRiskScoreRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/risk_engine/preview_route.gen';
import { ReadRuleRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/crud/read_rule/read_rule_route.gen';
import { RulePreviewRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_preview/rule_preview.gen';
import { SearchAlertsRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals/query_signals/query_signals_route.gen';
import { SetAlertAssigneesRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/alert_assignees/set_alert_assignees_route.gen';
import { SetAlertsStatusRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/signals/set_signal_status/set_signals_status_route.gen';
import { SuggestUserProfilesRequestQueryInput } from '@kbn/security-solution-plugin/common/api/detection_engine/users/suggest_user_profiles_route.gen';
import { TriggerRiskScoreCalculationRequestBodyInput } from '@kbn/security-solution-plugin/common/api/entity_analytics/risk_engine/entity_calculation_route.gen';
import { UpdateRuleRequestBodyInput } from '@kbn/security-solution-plugin/common/api/detection_engine/rule_management/crud/update_rule/update_rule_route.gen';
import { FtrProviderContext } from '../ftr_provider_context';

export function SecuritySolutionApiProvider({ getService }: FtrProviderContext) {
  const supertest = getService('supertest');

  return {
    /**
      * Migrations favor data integrity over shard size. Consequently, unused or orphaned indices are artifacts of
the migration process. A successful migration will result in both the old and new indices being present.
As such, the old, orphaned index can (and likely should) be deleted.

While you can delete these indices manually,
the endpoint accomplishes this task by applying a deletion policy to the relevant index, causing it to be deleted
after 30 days. It also deletes other artifacts specific to the migration implementation.

      */
    alertsMigrationCleanup(props: AlertsMigrationCleanupProps) {
      return supertest
        .delete('/api/detection_engine/signals/migration')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Create new detection rules in bulk.
     */
    bulkCreateRules(props: BulkCreateRulesProps) {
      return supertest
        .post('/api/detection_engine/rules/_bulk_create')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Delete detection rules in bulk.
     */
    bulkDeleteRules(props: BulkDeleteRulesProps) {
      return supertest
        .delete('/api/detection_engine/rules/_bulk_delete')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Deletes multiple rules.
     */
    bulkDeleteRulesPost(props: BulkDeleteRulesPostProps) {
      return supertest
        .post('/api/detection_engine/rules/_bulk_delete')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Update specific fields of existing detection rules using the `rule_id` or `id` field.
     */
    bulkPatchRules(props: BulkPatchRulesProps) {
      return supertest
        .patch('/api/detection_engine/rules/_bulk_update')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
      * Update multiple detection rules using the `rule_id` or `id` field. The original rules are replaced, and all unspecified fields are deleted.
> info
> You cannot modify the `id` or `rule_id` values.

      */
    bulkUpdateRules(props: BulkUpdateRulesProps) {
      return supertest
        .put('/api/detection_engine/rules/_bulk_update')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    bulkUpsertAssetCriticalityRecords(props: BulkUpsertAssetCriticalityRecordsProps) {
      return supertest
        .post('/api/asset_criticality/bulk')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    createAlertsIndex() {
      return supertest
        .post('/api/detection_engine/index')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
      * Initiate a migration of detection alerts.
Migrations are initiated per index. While the process is neither destructive nor interferes with existing data, it may be resource-intensive. As such, it is recommended that you plan your migrations accordingly.

      */
    createAlertsMigration(props: CreateAlertsMigrationProps) {
      return supertest
        .post('/api/detection_engine/signals/migration')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    createAssetCriticalityRecord(props: CreateAssetCriticalityRecordProps) {
      return supertest
        .post('/api/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Create a new detection rule.
     */
    createRule(props: CreateRuleProps) {
      return supertest
        .post('/api/detection_engine/rules')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    createUpdateProtectionUpdatesNote(props: CreateUpdateProtectionUpdatesNoteProps) {
      return supertest
        .post(
          replaceParams('/api/endpoint/protection_updates_note/{package_policy_id}', props.params)
        )
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    deleteAlertsIndex() {
      return supertest
        .delete('/api/detection_engine/index')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    deleteAssetCriticalityRecord(props: DeleteAssetCriticalityRecordProps) {
      return supertest
        .delete('/api/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Delete a detection rule using the `rule_id` or `id` field.
     */
    deleteRule(props: DeleteRuleProps) {
      return supertest
        .delete('/api/detection_engine/rules')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Calculates and persists Risk Scores for an entity, returning the calculated risk score.
     */
    deprecatedTriggerRiskScoreCalculation(props: DeprecatedTriggerRiskScoreCalculationProps) {
      return supertest
        .post('/api/risk_scores/calculation/entity')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    disableRiskEngine() {
      return supertest
        .post('/internal/risk_score/engine/disable')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    enableRiskEngine() {
      return supertest
        .post('/internal/risk_score/engine/enable')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    endpointIsolateRedirect(props: EndpointIsolateRedirectProps) {
      return supertest
        .post('/api/endpoint/isolate')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    endpointUnisolateRedirect(props: EndpointUnisolateRedirectProps) {
      return supertest
        .post('/api/endpoint/unisolate')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
      * Export detection rules to an `.ndjson` file. The following configuration items are also included in the `.ndjson` file:
- Actions
- Exception lists
> info
> You cannot export prebuilt rules.

      */
    exportRules(props: ExportRulesProps) {
      return supertest
        .post('/api/detection_engine/rules/_export')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object)
        .query(props.query);
    },
    /**
      * Finalize successful migrations of detection alerts. This replaces the original index's alias with the successfully migrated index's alias.
The endpoint is idempotent; therefore, it can safely be used to poll a given migration and, upon completion,
finalize it.

      */
    finalizeAlertsMigration(props: FinalizeAlertsMigrationProps) {
      return supertest
        .post('/api/detection_engine/signals/finalize_migration')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    findAssetCriticalityRecords(props: FindAssetCriticalityRecordsProps) {
      return supertest
        .post('/api/asset_criticality/list')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Retrieve a paginated list of detection rules. By default, the first page is returned, with 20 results per page.
     */
    findRules(props: FindRulesProps) {
      return supertest
        .get('/api/detection_engine/rules/_find')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    getAgentPolicySummary(props: GetAgentPolicySummaryProps) {
      return supertest
        .get('/api/endpoint/policy/summaries')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    getAlertsIndex() {
      return supertest
        .get('/api/detection_engine/index')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
     * Retrieve indices that contain detection alerts of a particular age, along with migration information for each of those indices.
     */
    getAlertsMigrationStatus(props: GetAlertsMigrationStatusProps) {
      return supertest
        .post('/api/detection_engine/signals/migration_status')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    getAssetCriticalityRecord(props: GetAssetCriticalityRecordProps) {
      return supertest
        .get('/api/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    getAssetCriticalityStatus() {
      return supertest
        .get('/internal/asset_criticality/status')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    getEndpointSuggestions(props: GetEndpointSuggestionsProps) {
      return supertest
        .post(replaceParams('/api/endpoint/suggestions/{suggestion_type}', props.params))
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    getPolicyResponse(props: GetPolicyResponseProps) {
      return supertest
        .get('/api/endpoint/policy_response')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Retrieve the status of all Elastic prebuilt detection rules and Timelines.
     */
    getPrebuiltRulesAndTimelinesStatus() {
      return supertest
        .get('/api/detection_engine/rules/prepackaged/_status')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
      * Retrieves whether or not the user is authenticated, and the user's Kibana
space and index privileges, which determine if the user can create an
index for the Elastic Security alerts generated by
detection engine rules.

      */
    getPrivileges() {
      return supertest
        .get('/api/detection_engine/privileges')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    getProtectionUpdatesNote(props: GetProtectionUpdatesNoteProps) {
      return supertest
        .get(
          replaceParams('/api/endpoint/protection_updates_note/{package_policy_id}', props.params)
        )
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
     * Returns the status of both the legacy transform-based risk engine, as well as the new risk engine
     */
    getRiskEngineStatus() {
      return supertest
        .get('/internal/risk_score/engine/status')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    getRuleExecutionEvents(props: GetRuleExecutionEventsProps) {
      return supertest
        .put(
          replaceParams('/internal/detection_engine/rules/{ruleId}/execution/events', props.params)
        )
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    getRuleExecutionResults(props: GetRuleExecutionResultsProps) {
      return supertest
        .put(
          replaceParams('/internal/detection_engine/rules/{ruleId}/execution/results', props.params)
        )
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
      * Import detection rules from an `.ndjson` file, including actions and exception lists. The request must include:
- The `Content-Type: multipart/form-data` HTTP header.
- A link to the `.ndjson` file containing the rules.

      */
    importRules(props: ImportRulesProps) {
      return supertest
        .post('/api/detection_engine/rules/_import')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Initializes the Risk Engine by creating the necessary indices and mappings, removing old transforms, and starting the new risk engine
     */
    initRiskEngine() {
      return supertest
        .post('/internal/risk_score/engine/init')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
     * Install and update all Elastic prebuilt detection rules and Timelines.
     */
    installPrebuiltRulesAndTimelines() {
      return supertest
        .put('/api/detection_engine/rules/prepackaged')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    internalCreateAssetCriticalityRecord(props: InternalCreateAssetCriticalityRecordProps) {
      return supertest
        .post('/internal/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    internalDeleteAssetCriticalityRecord(props: InternalDeleteAssetCriticalityRecordProps) {
      return supertest
        .delete('/internal/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    internalGetAssetCriticalityRecord(props: InternalGetAssetCriticalityRecordProps) {
      return supertest
        .get('/internal/asset_criticality')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    internalUploadAssetCriticalityRecords() {
      return supertest
        .post('/internal/asset_criticality/upload_csv')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
      * And tags to detection alerts, and remove them from alerts.
> info
> You cannot add and remove the same alert tag in the same request.

      */
    manageAlertTags(props: ManageAlertTagsProps) {
      return supertest
        .post('/api/detection_engine/signals/tags')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Update specific fields of an existing detection rule using the `rule_id` or `id` field.
     */
    patchRule(props: PatchRuleProps) {
      return supertest
        .patch('/api/detection_engine/rules')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Apply a bulk action, such as bulk edit, duplicate, or delete, to multiple detection rules. The bulk action is applied to all rules that match the query or to the rules listed by their IDs.
     */
    performBulkAction(props: PerformBulkActionProps) {
      return supertest
        .post('/api/detection_engine/rules/_bulk_action')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object)
        .query(props.query);
    },
    /**
     * Upgrade prebuilt detection rules.
     */
    performRuleUpgrade(props: PerformRuleUpgradeProps) {
      return supertest
        .post('/api/detection_engine/rules/prebuilt/_perform_upgrade')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Calculates and returns a list of Risk Scores, sorted by identifier_type and risk score.
     */
    previewRiskScore(props: PreviewRiskScoreProps) {
      return supertest
        .post('/internal/risk_score/preview')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    readRiskEngineSettings() {
      return supertest
        .get('/internal/risk_score/engine/settings')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    /**
     * Retrieve a detection rule using the `rule_id` or `id` field.
     */
    readRule(props: ReadRuleProps) {
      return supertest
        .get('/api/detection_engine/rules')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * List all unique tags from all detection rules.
     */
    readTags() {
      return supertest
        .get('/api/detection_engine/tags')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
    rulePreview(props: RulePreviewProps) {
      return supertest
        .post('/api/detection_engine/rules/preview')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Find and/or aggregate detection alerts that match the given query.
     */
    searchAlerts(props: SearchAlertsProps) {
      return supertest
        .post('/api/detection_engine/signals/search')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
      * Assign users to detection alerts, and unassign them from alerts.
> info
> You cannot add and remove the same assignee in the same request.

      */
    setAlertAssignees(props: SetAlertAssigneesProps) {
      return supertest
        .post('/api/detection_engine/signals/assignees')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Set the status of one or more detection alerts.
     */
    setAlertsStatus(props: SetAlertsStatusProps) {
      return supertest
        .post('/api/detection_engine/signals/status')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
     * Suggests user profiles.
     */
    suggestUserProfiles(props: SuggestUserProfilesProps) {
      return supertest
        .post('/internal/detection_engine/users/_find')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .query(props.query);
    },
    /**
     * Calculates and persists Risk Scores for an entity, returning the calculated risk score.
     */
    triggerRiskScoreCalculation(props: TriggerRiskScoreCalculationProps) {
      return supertest
        .post('/internal/risk_score/calculation/entity')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    /**
      * Update a detection rule using the `rule_id` or `id` field. The original rule is replaced, and all unspecified fields are deleted.
> info
> You cannot modify the `id` or `rule_id` values.

      */
    updateRule(props: UpdateRuleProps) {
      return supertest
        .put('/api/detection_engine/rules')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '2023-10-31')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana')
        .send(props.body as object);
    },
    uploadAssetCriticalityRecords() {
      return supertest
        .post('/api/asset_criticality/upload_csv')
        .set('kbn-xsrf', 'true')
        .set(ELASTIC_HTTP_VERSION_HEADER, '1')
        .set(X_ELASTIC_INTERNAL_ORIGIN_REQUEST, 'kibana');
    },
  };
}

export interface AlertsMigrationCleanupProps {
  body: AlertsMigrationCleanupRequestBodyInput;
}
export interface BulkCreateRulesProps {
  body: BulkCreateRulesRequestBodyInput;
}
export interface BulkDeleteRulesProps {
  body: BulkDeleteRulesRequestBodyInput;
}
export interface BulkDeleteRulesPostProps {
  body: BulkDeleteRulesPostRequestBodyInput;
}
export interface BulkPatchRulesProps {
  body: BulkPatchRulesRequestBodyInput;
}
export interface BulkUpdateRulesProps {
  body: BulkUpdateRulesRequestBodyInput;
}
export interface BulkUpsertAssetCriticalityRecordsProps {
  body: BulkUpsertAssetCriticalityRecordsRequestBodyInput;
}
export interface CreateAlertsMigrationProps {
  body: CreateAlertsMigrationRequestBodyInput;
}
export interface CreateAssetCriticalityRecordProps {
  body: CreateAssetCriticalityRecordRequestBodyInput;
}
export interface CreateRuleProps {
  body: CreateRuleRequestBodyInput;
}
export interface CreateUpdateProtectionUpdatesNoteProps {
  params: CreateUpdateProtectionUpdatesNoteRequestParamsInput;
  body: CreateUpdateProtectionUpdatesNoteRequestBodyInput;
}
export interface DeleteAssetCriticalityRecordProps {
  query: DeleteAssetCriticalityRecordRequestQueryInput;
}
export interface DeleteRuleProps {
  query: DeleteRuleRequestQueryInput;
}
export interface DeprecatedTriggerRiskScoreCalculationProps {
  body: DeprecatedTriggerRiskScoreCalculationRequestBodyInput;
}
export interface EndpointIsolateRedirectProps {
  body: EndpointIsolateRedirectRequestBodyInput;
}
export interface EndpointUnisolateRedirectProps {
  body: EndpointUnisolateRedirectRequestBodyInput;
}
export interface ExportRulesProps {
  query: ExportRulesRequestQueryInput;
  body: ExportRulesRequestBodyInput;
}
export interface FinalizeAlertsMigrationProps {
  body: FinalizeAlertsMigrationRequestBodyInput;
}
export interface FindAssetCriticalityRecordsProps {
  query: FindAssetCriticalityRecordsRequestQueryInput;
}
export interface FindRulesProps {
  query: FindRulesRequestQueryInput;
}
export interface GetAgentPolicySummaryProps {
  query: GetAgentPolicySummaryRequestQueryInput;
}
export interface GetAlertsMigrationStatusProps {
  query: GetAlertsMigrationStatusRequestQueryInput;
}
export interface GetAssetCriticalityRecordProps {
  query: GetAssetCriticalityRecordRequestQueryInput;
}
export interface GetEndpointSuggestionsProps {
  params: GetEndpointSuggestionsRequestParamsInput;
  body: GetEndpointSuggestionsRequestBodyInput;
}
export interface GetPolicyResponseProps {
  query: GetPolicyResponseRequestQueryInput;
}
export interface GetProtectionUpdatesNoteProps {
  params: GetProtectionUpdatesNoteRequestParamsInput;
}
export interface GetRuleExecutionEventsProps {
  query: GetRuleExecutionEventsRequestQueryInput;
  params: GetRuleExecutionEventsRequestParamsInput;
}
export interface GetRuleExecutionResultsProps {
  query: GetRuleExecutionResultsRequestQueryInput;
  params: GetRuleExecutionResultsRequestParamsInput;
}
export interface ImportRulesProps {
  query: ImportRulesRequestQueryInput;
}
export interface InternalCreateAssetCriticalityRecordProps {
  body: InternalCreateAssetCriticalityRecordRequestBodyInput;
}
export interface InternalDeleteAssetCriticalityRecordProps {
  query: InternalDeleteAssetCriticalityRecordRequestQueryInput;
}
export interface InternalGetAssetCriticalityRecordProps {
  query: InternalGetAssetCriticalityRecordRequestQueryInput;
}
export interface ManageAlertTagsProps {
  body: ManageAlertTagsRequestBodyInput;
}
export interface PatchRuleProps {
  body: PatchRuleRequestBodyInput;
}
export interface PerformBulkActionProps {
  query: PerformBulkActionRequestQueryInput;
  body: PerformBulkActionRequestBodyInput;
}
export interface PerformRuleUpgradeProps {
  body: PerformRuleUpgradeRequestBodyInput;
}
export interface PreviewRiskScoreProps {
  body: PreviewRiskScoreRequestBodyInput;
}
export interface ReadRuleProps {
  query: ReadRuleRequestQueryInput;
}
export interface RulePreviewProps {
  body: RulePreviewRequestBodyInput;
}
export interface SearchAlertsProps {
  body: SearchAlertsRequestBodyInput;
}
export interface SetAlertAssigneesProps {
  body: SetAlertAssigneesRequestBodyInput;
}
export interface SetAlertsStatusProps {
  body: SetAlertsStatusRequestBodyInput;
}
export interface SuggestUserProfilesProps {
  query: SuggestUserProfilesRequestQueryInput;
}
export interface TriggerRiskScoreCalculationProps {
  body: TriggerRiskScoreCalculationRequestBodyInput;
}
export interface UpdateRuleProps {
  body: UpdateRuleRequestBodyInput;
}
