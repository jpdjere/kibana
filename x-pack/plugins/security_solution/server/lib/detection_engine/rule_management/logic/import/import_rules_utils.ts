/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import type { SavedObject } from '@kbn/core/server';
import type {
  ImportExceptionsListSchema,
  ImportExceptionListItemSchema,
  ExceptionListSchema,
} from '@kbn/securitysolution-io-ts-list-types';

import type { RuleToImport } from '../../../../../../common/api/detection_engine/rule_management';
import type { ImportRuleResponse } from '../../../routes/utils';
import { createBulkErrorObject } from '../../../routes/utils';
import { checkRuleExceptionReferences } from './check_rule_exception_references';
import type { IDetectionRulesClient } from '../detection_rules_client/detection_rules_client_interface';
import type { PrebuiltRuleAsset } from '../../../prebuilt_rules';

export type PromiseFromStreams = RuleToImport | Error;
export interface RuleExceptionsPromiseFromStreams {
  rules: PromiseFromStreams[];
  exceptions: Array<ImportExceptionsListSchema | ImportExceptionListItemSchema>;
  actionConnectors: SavedObject[];
}

/**
 * Takes rules to be imported and either creates or updates rules
 * based on user overwrite preferences
 * @param ruleChunks {array} - rules being imported
 * @param rulesResponseAcc {array} - the accumulation of success and
 * error messages gathered through the rules import logic
 * @param mlAuthz {object}
 * @param overwriteRules {boolean} - whether to overwrite existing rules
 * with imported rules if their rule_id matches
 * @param detectionRulesClient {object}
 * @param existingLists {object} - all exception lists referenced by
 * rules that were found to exist
 * @returns {Promise} an array of error and success messages from import
 */
export const importRules = async ({
  ruleChunks,
  rulesResponseAcc,
  overwriteRules,
  detectionRulesClient,
  existingLists,
  prebuiltRuleAssets,
  allowMissingConnectorSecrets,
  allowPrebuiltRules,
}: {
  ruleChunks: PromiseFromStreams[][];
  rulesResponseAcc: ImportRuleResponse[];
  overwriteRules: boolean;
  detectionRulesClient: IDetectionRulesClient;
  existingLists: Record<string, ExceptionListSchema>;
  prebuiltRuleAssets?: PrebuiltRuleAsset[];
  allowMissingConnectorSecrets?: boolean;
  allowPrebuiltRules?: boolean;
}) => {
  let importRuleResponse: ImportRuleResponse[] = [...rulesResponseAcc];

  // If we had 100% errors and no successful rule could be imported we still have to output an error.
  // otherwise we would output we are success importing 0 rules.
  if (ruleChunks.length === 0) {
    return importRuleResponse;
  }

  while (ruleChunks.length) {
    const batchParseObjects = ruleChunks.shift() ?? [];
    const newImportRuleResponse = await Promise.all(
      batchParseObjects.reduce<Array<Promise<ImportRuleResponse>>>((accum, parsedRule) => {
        const importsWorkerPromise = new Promise<ImportRuleResponse>(async (resolve, reject) => {
          try {
            if (parsedRule instanceof Error) {
              // If the JSON object had a validation or parse error then we return
              // early with the error and an (unknown) for the ruleId
              resolve(
                createBulkErrorObject({
                  statusCode: 400,
                  message: parsedRule.message,
                })
              );
              return null;
            }

            if (!allowPrebuiltRules && parsedRule.immutable) {
              resolve(
                createBulkErrorObject({
                  statusCode: 400,
                  message: i18n.translate(
                    'xpack.securitySolution.detectionEngine.rules.importPrebuiltRulesUnsupported',
                    {
                      defaultMessage:
                        'Importing prebuilt rules is not supported. To import this rule as a custom rule, remove its "immutable" property try again.',
                    }
                  ),
                  ruleId: parsedRule.rule_id,
                })
              );

              return null;
            }

            if (allowPrebuiltRules) {
              if (parsedRule.rule_id && !parsedRule.version) {
                resolve(
                  createBulkErrorObject({
                    statusCode: 400,
                    message: i18n.translate(
                      'xpack.securitySolution.detectionEngine.rules.cannotImportPrebuiltRuleWithoutVersion',
                      {
                        defaultMessage: 'Prebuilt rules must specify a "version" to be imported.',
                      }
                    ),
                    ruleId: parsedRule.rule_id,
                  })
                );
              }

              // TODO rule_source calculated here
              // const ruleSource = calculateRuleSource({
              //   rule: parsedRule,
              //   prebuiltRuleAssets,
              // });

              // parsedRule.rule_source = ruleSource;
            }

            try {
              const [exceptionErrors, exceptions] = checkRuleExceptionReferences({
                rule: parsedRule,
                existingLists,
              });

              importRuleResponse = [...importRuleResponse, ...exceptionErrors];

              const importedRule = await detectionRulesClient.importRule({
                ruleToImport: {
                  ...parsedRule,
                  exceptions_list: [...exceptions],
                },
                overwriteRules,
                allowMissingConnectorSecrets,
              });

              resolve({
                rule_id: importedRule.rule_id,
                status_code: 200,
              });
            } catch (err) {
              const { error, statusCode, message } = err;
              resolve(
                createBulkErrorObject({
                  ruleId: parsedRule.rule_id,
                  statusCode: statusCode ?? error?.status_code ?? 400,
                  message: message ?? error?.message ?? 'unknown error',
                })
              );
            }
          } catch (error) {
            reject(error);
          }
        });
        return [...accum, importsWorkerPromise];
      }, [])
    );
    importRuleResponse = [...importRuleResponse, ...newImportRuleResponse];
  }

  return importRuleResponse;
};
