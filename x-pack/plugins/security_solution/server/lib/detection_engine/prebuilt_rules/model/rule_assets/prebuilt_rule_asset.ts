/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as z from 'zod';
import {
  RuleSignatureId,
  RuleVersion,
  BaseCreateProps,
  EqlRuleCreateFields,
  QueryRuleCreateFields,
  SavedQueryRuleCreateFields,
  ThresholdRuleCreateFields,
  ThreatMatchRuleCreateFields,
  MachineLearningRuleCreateFields,
  NewTermsRuleCreateFields,
  EsqlRuleCreateFields,
} from '../../../../../../common/api/detection_engine/model/rule_schema';
import type { TypeSpecificCreateProps } from '../../../../../../common/api/detection_engine/model/rule_schema';

type RuleAssetFieldKeys = keyof Omit<TypeSpecificCreateProps, 'type'>;

const PROPERTIES_TO_OMIT: Record<RuleAssetFieldKeys, boolean> = {
  alert_suppression: true,
  actions: true,
  throttle: true,
  meta: true,
};

const RuleAssetBaseCreateProps = BaseCreateProps.omit(PROPERTIES_TO_OMIT);

const EqlRuleAssetFields = EqlRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const QueryRuleAssetFields = QueryRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const SavedQueryRuleAssetFields = SavedQueryRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const ThresholdRuleAssetFields = ThresholdRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const ThreatMatchRuleAssetFields = ThreatMatchRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const NewTermsRuleAssetFields = NewTermsRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const EsqlRuleAssetFields = EsqlRuleCreateFields.omit(PROPERTIES_TO_OMIT);
const MachineLearningRuleAssetFields = MachineLearningRuleCreateFields;

export const RuleAssetTypeSpecificCreateProps = z.discriminatedUnion('type', [
  EqlRuleAssetFields,
  QueryRuleAssetFields,
  SavedQueryRuleAssetFields,
  ThresholdRuleAssetFields,
  ThreatMatchRuleAssetFields,
  NewTermsRuleAssetFields,
  MachineLearningRuleAssetFields,
  EsqlRuleAssetFields,
]);

/**
 * Asset containing source content of a prebuilt Security detection rule.
 * Is defined for each prebuilt rule in https://github.com/elastic/detection-rules.
 * Is shipped via the `security_detection_engine` Fleet package.
 * Is installed as saved objects of type "security-rule" when the package is installed.
 *
 * Additionally, "security-rule" assets can be shipped via other Fleet packages, such as:
 *   - LotL Attack Detection https://github.com/elastic/integrations/pull/2115
 *   - Data Exfiltration Detection
 *
 * Big differences between this schema and RuleCreateProps:
 *  - rule_id is required here
 *  - version is a required field that must exist
 */
export type PrebuiltRuleAsset = z.infer<typeof PrebuiltRuleAsset>;
export const PrebuiltRuleAsset = RuleAssetBaseCreateProps.and(RuleAssetTypeSpecificCreateProps).and(
  z.object({
    rule_id: RuleSignatureId,
    version: RuleVersion,
  })
);
