/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { EuiLink } from '@elastic/eui';
import { css } from '@emotion/react';
import React from 'react';

export const DISMISS = i18n.translate('xpack.securitySolution.detectionEngine.rules.dismissTitle', {
  defaultMessage: 'Dismiss',
});

export const NEW_PREBUILT_RULES_CALLOUT_TITLE = i18n.translate(
  'xpack.securitySolution.detectionEngine.rules.newPrebuiltRulesCalloutTitle',
  {
    defaultMessage:
      'New Elastic rules are available to be installed. Click on the “Add Elastic Rules” button to Review and install.',
  }
);

export const RULE_UPDATES_LINK = i18n.translate(
  'xpack.securitySolution.detectionEngine.rules.ruleUpdatesLinkTitle',
  {
    defaultMessage: 'Rule Updates',
  }
);

export const UPDATE_RULES_CALLOUT_TITLE = (
  <FormattedMessage
    id="xpack.securitySolution.detectionEngine.rules.updatePrebuiltRulesCalloutTitle"
    defaultMessage="Updates available for installed rules. Review and update in&nbsp;{link}."
    values={{
      link: (
        <EuiLink
          css={css`
            font-weight: 400;
          `}
        >
          {RULE_UPDATES_LINK}
        </EuiLink>
      ),
    }}
  />
);
