/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui';
import React from 'react';
import * as i18n from './translations';
import { MlJobUpgradeModal } from '../../../../../detections/components/modals/ml_job_upgrade_modal';
import { useUpgradePrebuiltRulesTableContext } from './upgrade_prebuilt_rules_table_context';

export const UpgradePrebuiltRulesTableButtons = () => {
  const {
    state: { rules, selectedRules, loadingRules, isUpgradeModalVisible, legacyJobsInstalled },
    actions: {
      upgradeAllRules,
      upgradeSelectedRules,
      upgradeRulesWrapper,
      mlJobUpgradeModalConfirm,
      mlJobUpgradeModalCancel,
    },
  } = useUpgradePrebuiltRulesTableContext();

  const isRulesAvailableForUpgrade = rules.length > 0;
  const numberOfSelectedRules = selectedRules.length ?? 0;
  const shouldDisplayUpgradeSelectedRulesButton = numberOfSelectedRules > 0;

  const isRuleUpgrading = loadingRules.length > 0;

  return (
    <>
      <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false} wrap={true}>
        {shouldDisplayUpgradeSelectedRulesButton ? (
          <EuiFlexItem grow={false}>
            <EuiButton
              onClick={() => upgradeRulesWrapper('SPECIFIC_RULES', upgradeSelectedRules)}
              disabled={isRuleUpgrading}
            >
              <>
                {i18n.UPDATE_SELECTED_RULES(numberOfSelectedRules)}
                {isRuleUpgrading ? <EuiLoadingSpinner size="s" /> : undefined}
              </>
            </EuiButton>
          </EuiFlexItem>
        ) : null}
        <EuiFlexItem grow={false}>
          <EuiButton
            fill
            iconType="plusInCircle"
            onClick={() => upgradeRulesWrapper('ALL_RULES', upgradeAllRules)}
            disabled={!isRulesAvailableForUpgrade || isRuleUpgrading}
          >
            {i18n.UPDATE_ALL}
            {isRuleUpgrading ? <EuiLoadingSpinner size="s" /> : undefined}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
      {isUpgradeModalVisible && (
        <MlJobUpgradeModal
          jobs={legacyJobsInstalled}
          onCancel={mlJobUpgradeModalCancel}
          onConfirm={mlJobUpgradeModalConfirm}
        />
      )}
    </>
  );
};
