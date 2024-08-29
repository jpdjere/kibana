/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { calculateRuleSourceFromAsset } from './calculate_rule_source_from_asset';
import { getRulesSchemaMock } from '../../../../../../../../common/api/detection_engine/model/rule_schema/mocks';
import { getPrebuiltRuleMock } from '../../../../../prebuilt_rules/model/rule_assets/prebuilt_rule_asset.mock';

describe('calculateRuleSourceFromAsset', () => {
  it('calculates as internal if no asset is found', () => {
    const result = calculateRuleSourceFromAsset({
      rule: getRulesSchemaMock(),
      assetWithMatchingVersion: undefined,
      ruleIdExists: false,
    });

    expect(result).toEqual({
      type: 'internal',
    });
  });

  it('calculates as customized external type if an asset is found, but no asset with a matching version', () => {
    const ruleToImport = getRulesSchemaMock();
    const result = calculateRuleSourceFromAsset({
      rule: ruleToImport,
      assetWithMatchingVersion: undefined,
      ruleIdExists: true,
    });

    expect(result).toEqual({
      type: 'external',
      is_customized: true,
    });
  });

  describe('matching rule_id and version is found', () => {
    it('calculates as customized external type if the imported rule has all fields unchanged from the asset', () => {
      const ruleToImport = getRulesSchemaMock();
      const result = calculateRuleSourceFromAsset({
        rule: getRulesSchemaMock(), // version 1
        assetWithMatchingVersion: getPrebuiltRuleMock({
          ...ruleToImport,
          version: 1, // version 1 (same version as imported rule)
          // no other overwrites -> no differences
        }),
        ruleIdExists: true,
      });

      expect(result).toEqual({
        type: 'external',
        is_customized: false,
      });
    });

    it('calculates as non-customized external type the imported rule has fields which differ from the asset', () => {
      const ruleToImport = getRulesSchemaMock();
      const result = calculateRuleSourceFromAsset({
        rule: getRulesSchemaMock(), // version 1
        assetWithMatchingVersion: getPrebuiltRuleMock({
          ...ruleToImport,
          version: 1, // version 1 (same version as imported rule)
          name: 'Customized name', // mock a customization
        }),
        ruleIdExists: true,
      });

      expect(result).toEqual({
        type: 'external',
        is_customized: true,
      });
    });
  });
});
