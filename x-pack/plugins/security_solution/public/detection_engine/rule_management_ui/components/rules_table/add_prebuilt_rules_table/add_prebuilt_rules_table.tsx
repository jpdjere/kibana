/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiInMemoryTable,
  EuiSkeletonLoading,
  EuiProgress,
  EuiSkeletonTitle,
  EuiSkeletonText,
} from '@elastic/eui';
import React from 'react';

import { RULES_TABLE_INITIAL_PAGE_SIZE, RULES_TABLE_PAGE_SIZE_OPTIONS } from '../constants';
import { AddPrebuiltRulesTableNoItemsMessage } from './add_prebuilt_rules_no_items_message';
import { useAddPrebuiltRulesTableContext } from './add_prebuilt_rules_table_context';
import { AddPrebuiltRulesTableFilters } from './add_prebuilt_rules_table_filters';
import { useAddPrebuiltRulesTableColumns } from './use_add_prebuilt_rules_table_columns';

/**
 * Table Component for displaying new rules that are available to be installed
 */
export const AddPrebuiltRulesTable = React.memo(() => {
  const addRulesTableContext = useAddPrebuiltRulesTableContext();

  const {
    state: { rules, filteredRules, isFetched, isLoading, selectedRules, isRefreshingTable },
    actions: { selectRules },
  } = addRulesTableContext;
  const rulesColumns = useAddPrebuiltRulesTableColumns();

  const isTableEmpty = isFetched && rules.length === 0;

  const isInstallingPackageForFirstTime = isRefreshingTable && rules.length === 0;

  return (
    <>
      {isRefreshingTable && (
        <EuiProgress
          data-test-subj="loadingRulesInfoProgress"
          size="xs"
          position="absolute"
          color="accent"
        />
      )}
      <EuiSkeletonLoading
        isLoading={isLoading || isInstallingPackageForFirstTime}
        loadingContent={
          <>
            <EuiSkeletonTitle />
            <EuiSkeletonText />
          </>
        }
        loadedContent={
          isTableEmpty ? (
            <AddPrebuiltRulesTableNoItemsMessage />
          ) : (
            <>
              <AddPrebuiltRulesTableFilters />
              <EuiInMemoryTable
                items={filteredRules}
                sorting
                pagination={{
                  initialPageSize: RULES_TABLE_INITIAL_PAGE_SIZE,
                  pageSizeOptions: RULES_TABLE_PAGE_SIZE_OPTIONS,
                }}
                isSelectable
                selection={{
                  selectable: () => true,
                  onSelectionChange: selectRules,
                  initialSelected: selectedRules,
                }}
                itemId="rule_id"
                data-test-subj="add-prebuilt-rules-table"
                columns={rulesColumns}
              />
            </>
          )
        }
      />
    </>
  );
});

AddPrebuiltRulesTable.displayName = 'AddPrebuiltRulesTable';
