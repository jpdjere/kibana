/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { BulkInstallPackageInfo } from '@kbn/fleet-plugin/common';
import type { Rule } from '../../../public/detection_engine/rule_management/logic/types';
import { createRuleAssetSavedObject } from '../../helpers/rules';
import {
  GO_BACK_TO_RULES_TABLE_BUTTON,
  INSTALL_ALL_RULES_BUTTON,
  INSTALL_SELECTED_RULES_BUTTON,
  RULES_MANAGEMENT_TABLE,
  RULES_ROW,
  RULES_UPDATES_TABLE,
  SELECT_ALL_RULES_ON_PAGE_CHECKBOX,
  TOASTER,
  UPGRADE_ALL_RULES_BUTTON,
} from '../../screens/alerts_detection_rules';
import { waitForRulesTableToBeLoaded } from '../../tasks/alerts_detection_rules';
import {
  createNewRuleAsset,
  getRuleAssets,
  installAvailableRules,
  preventPrebuiltRulesPackageInstallation,
} from '../../tasks/api_calls/prebuilt_rules';
import { resetRulesTableState, deleteAlertsAndRules, reload } from '../../tasks/common';
import { esArchiverResetKibana } from '../../tasks/es_archiver';
import { login, visitWithoutDateRange } from '../../tasks/login';
import { SECURITY_DETECTIONS_RULES_URL } from '../../urls/navigation';
import { addElasticRulessButtonClick, ruleUpdatesTabClick } from '../../tasks/prebuilt_rules';

describe('Detection rules, Prebuilt Rules Installation and Update workflow', () => {
  beforeEach(() => {
    login();
    resetRulesTableState();
    deleteAlertsAndRules();
    esArchiverResetKibana();

    visitWithoutDateRange(SECURITY_DETECTIONS_RULES_URL);
  });

  describe('Installation of prebuilt rules package via Fleet', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/fleet/epm/packages/_bulk*').as('installPackage');
      waitForRulesTableToBeLoaded();
    });

    it('should install package from Fleet in the background', () => {
      /* Assert that the package in installed from Fleet by checking that
      /* the installSource is "registry", as opposed to "bundle" */
      cy.wait('@installPackage', {
        timeout: 60000,
      }).then(({ response }) => {
        cy.wrap(response?.statusCode).should('eql', 200);

        const packages = response?.body.items.map(({ name, result }: BulkInstallPackageInfo) => ({
          name,
          installSource: result.installSource,
        }));

        expect(packages.length).to.have.greaterThan(0);
        expect(packages).to.deep.include.members([
          { name: 'security_detection_engine', installSource: 'registry' },
        ]);
      });
    });

    it('should install rules from the Fleet package when user clicks on CTA', () => {
      /* Retrieve how many rules were installed from the Fleet package */
      cy.wait('@installPackage', {
        timeout: 60000,
      }).then(() => {
        getRuleAssets().then((response) => {
          const ruleIds = response.body.hits.hits.map(
            (hit: { _source: { ['security-rule']: Rule } }) => hit._source['security-rule'].rule_id
          );

          const numberOfRulesToInstall = [...new Set(ruleIds)].length;
          addElasticRulessButtonClick();

          cy.get(INSTALL_ALL_RULES_BUTTON).click();
          cy.get(TOASTER)
            .should('be.visible')
            .should('have.text', `${numberOfRulesToInstall} rules installed successfully.`);
        });
      });
    });
  });

  describe('Installation of prebuilt rules', () => {
    const RULE_1 = createRuleAssetSavedObject({
      name: 'Test rule 1',
      rule_id: 'rule_1',
    });
    const RULE_2 = createRuleAssetSavedObject({
      name: 'Test rule 2',
      rule_id: 'rule_2',
    });
    beforeEach(() => {
      preventPrebuiltRulesPackageInstallation();

      /* Create two mock rules */
      createNewRuleAsset({ rule: RULE_1 });
      createNewRuleAsset({ rule: RULE_2 });
      waitForRulesTableToBeLoaded();
    });

    it('should install selected rules when user clicks on Install selected rules', () => {
      addElasticRulessButtonClick();
      cy.get(SELECT_ALL_RULES_ON_PAGE_CHECKBOX).click();
      cy.get(INSTALL_SELECTED_RULES_BUTTON).click();
      cy.get(TOASTER).should('be.visible').should('have.text', `2 rules installed successfully.`);
      cy.get(GO_BACK_TO_RULES_TABLE_BUTTON).click();
      cy.get(RULES_MANAGEMENT_TABLE).find(RULES_ROW).should('have.length', 2);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_1['security-rule'].name);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_2['security-rule'].name);
    });

    it('should fail gracefully with toast error message when request to install rules fails', () => {
      /* Stub request to force rules installation to fail */
      cy.intercept('POST', '/internal/detection_engine/prebuilt_rules/installation/_perform', {
        statusCode: 500,
      }).as('installPrebuiltRules');
      addElasticRulessButtonClick();
      cy.get(SELECT_ALL_RULES_ON_PAGE_CHECKBOX).click();
      cy.get(INSTALL_SELECTED_RULES_BUTTON).click();
      cy.wait('@installPrebuiltRules');
      cy.get(TOASTER).should('be.visible').should('have.text', 'Rule installation failed');
    });
  });

  describe('Update of prebuilt rules', () => {
    const RULE_ID = 'rule_id';
    const OUTDATED_RULE = createRuleAssetSavedObject({
      name: 'Outdated rule',
      rule_id: RULE_ID,
      version: 1,
    });
    const UPDATED_RULE = createRuleAssetSavedObject({
      name: 'Updated rule',
      rule_id: RULE_ID,
      version: 2,
    });
    beforeEach(() => {
      preventPrebuiltRulesPackageInstallation();
      /* Create a new rule and install it */
      createNewRuleAsset({ rule: OUTDATED_RULE });
      installAvailableRules();
      /* Create a second version of the rule, making it available for update */
      createNewRuleAsset({ rule: UPDATED_RULE });
      waitForRulesTableToBeLoaded();
      reload();
    });

    it('should update rule succesfully', () => {
      cy.intercept('POST', '/internal/detection_engine/prebuilt_rules/upgrade/_perform').as(
        'updatePrebuiltRules'
      );
      ruleUpdatesTabClick();
      cy.get(RULES_UPDATES_TABLE).find(RULES_ROW).should('have.length', 1);
      cy.get(RULES_UPDATES_TABLE).contains(OUTDATED_RULE['security-rule'].name);
      cy.get(UPGRADE_ALL_RULES_BUTTON).click();
      cy.wait('@updatePrebuiltRules');
      cy.get(TOASTER).should('be.visible').should('have.text', `1 rule updated successfully.`);
    });

    it('should fail gracefully with toast error message when request to update rules fails', () => {
      /* Stub request to force rules update to fail */
      cy.intercept('POST', '/internal/detection_engine/prebuilt_rules/upgrade/_perform', {
        statusCode: 500,
      }).as('updatePrebuiltRules');
      ruleUpdatesTabClick();
      cy.get(RULES_UPDATES_TABLE).find(RULES_ROW).should('have.length', 1);
      cy.get(RULES_UPDATES_TABLE).contains(OUTDATED_RULE['security-rule'].name);
      cy.get(UPGRADE_ALL_RULES_BUTTON).click();
      cy.wait('@updatePrebuiltRules');
      cy.get(TOASTER).should('be.visible').should('have.text', 'Rule update failed');

      /* Assert that the rule has not been updated in the UI */
      cy.get(RULES_UPDATES_TABLE).should('contain', OUTDATED_RULE['security-rule'].name);
    });
  });
});
