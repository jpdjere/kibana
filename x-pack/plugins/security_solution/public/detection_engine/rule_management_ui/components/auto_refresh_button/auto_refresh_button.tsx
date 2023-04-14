/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useState } from 'react';
import {
  EuiButtonEmpty,
  EuiContextMenuPanel,
  EuiPopover,
  EuiSpacer,
  EuiSwitch,
  EuiSwitchEvent,
  EuiTextColor,
} from '@elastic/eui';
import * as i18n from '../../../../detections/pages/detection_engine/rules/translations';
import { FormattedMessage } from '@kbn/i18n-react';
import { css } from '@emotion/react';

export interface AutoRefreshButtonProps {
  isRefreshOn: boolean;
  isDisabled: boolean;
  reFetchRules: () => {};
  setIsRefreshOn: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * AutoRefreshButton - component for toggling auto-refresh setting.
 *
 * @param isRefreshOn whether or not auto refresh is enabled
 * @param isDisabled whether or not component is in disabled state
 * @param reFetchRules action for re-fetching rules
 * @param setIsRefreshOn action for enabling/disabling refresh
 */
const AutoRefreshButtonComponent = ({
  isRefreshOn,
  isDisabled,
  reFetchRules,
  setIsRefreshOn,
}: AutoRefreshButtonProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAutoRefreshSwitch = useCallback(
    (closePopover: () => void) => (e: EuiSwitchEvent) => {
      const refreshOn = e.target.checked;
      if (refreshOn) {
        reFetchRules();
      }
      setIsRefreshOn(refreshOn);
      closePopover();
    },
    [reFetchRules, setIsRefreshOn]
  );

  const handleGetRefreshSettingsPopoverContent = useCallback(
    (closePopover: () => void) => (
      <EuiContextMenuPanel
        items={[
          <EuiSwitch
            key="allRulesAutoRefreshSwitch"
            label={i18n.REFRESH_RULE_POPOVER_DESCRIPTION}
            checked={isRefreshOn ?? false}
            onChange={handleAutoRefreshSwitch(closePopover)}
            compressed
            disabled={isDisabled}
            data-test-subj="refreshSettingsSwitch"
          />,
          ...(isDisabled
            ? [
                <div key="refreshSettingsSelectionNote">
                  <EuiSpacer size="s" />
                  <EuiTextColor color="subdued" data-test-subj="refreshSettingsSelectionNote">
                    <FormattedMessage
                      id="xpack.securitySolution.detectionEngine.rules.refreshRulePopoverSelectionHelpText"
                      defaultMessage="Note: Refresh is disabled while there is an active selection."
                    />
                  </EuiTextColor>
                </div>,
              ]
            : []),
        ]}
      />
    ),
    [isRefreshOn, handleAutoRefreshSwitch, isDisabled]
  );

  return (
    <EuiPopover
      isOpen={isPopoverOpen}
      closePopover={() => setIsPopoverOpen(false)}
      button={
        <EuiButtonEmpty
          data-test-subj="autoRefreshButton"
          color={'text'}
          iconType={'timeRefresh'}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          disabled={isDisabled}
          css={css`
            margin-left: 10px;
          `}
        >
          {isRefreshOn ? 'On' : 'Off'}
        </EuiButtonEmpty>
      }
    >
      {handleGetRefreshSettingsPopoverContent(() => setIsPopoverOpen(false))}
    </EuiPopover>
  );
};

AutoRefreshButtonComponent.displayName = 'AutoRefreshButtonComponent';

export const AutoRefreshButton = React.memo(AutoRefreshButtonComponent);

AutoRefreshButton.displayName = 'AutoRefreshButton';
