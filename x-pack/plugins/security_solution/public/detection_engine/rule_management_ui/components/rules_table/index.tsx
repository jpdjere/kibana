/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiSpacer } from '@elastic/eui';
import React from 'react';
import { useRouteSpy } from '../../../../common/utils/route/use_route_spy';
import { RulesManagementTour } from './rules_table/guided_onboarding/rules_management_tour';
import { useSyncRulesTableSavedState } from './rules_table/use_sync_rules_table_saved_state';
import { RulesTables } from './rules_tables';
import type { AllRulesTabs } from './rules_table_toolbar';
import { RulesTableToolbar } from './rules_table_toolbar';
import { usePrebuiltRulesStatus } from '../../../rule_management/logic/prebuilt_rules/use_prebuilt_rules_status';
import { useRulesTableContext } from './rules_table/rules_table_context';

/**
 * Table Component for displaying all Rules for a given cluster. Provides the ability to filter
 * by name, sort by enabled, and perform the following actions:
 *   * Enable/Disable
 *   * Duplicate
 *   * Delete
 *   * Import/Export
 */
export const AllRules = React.memo(() => {
  useSyncRulesTableSavedState();
  const [{ tabName }] = useRouteSpy();
  const rulesTableContext = useRulesTableContext();
  const totalRules = rulesTableContext.state.pagination.total;

  const { num_prebuilt_rules_to_install, num_prebuilt_rules_to_upgrade } =
    usePrebuiltRulesStatus().data?.attributes?.stats || {};

  return (
    <>
      <RulesManagementTour />
      <RulesTableToolbar
        installedTotal={totalRules}
        newTotal={num_prebuilt_rules_to_install}
        updateTotal={num_prebuilt_rules_to_upgrade}
      />
      <EuiSpacer />
      <RulesTables selectedTab={tabName as AllRulesTabs} />
    </>
  );
});

AllRules.displayName = 'AllRules';
