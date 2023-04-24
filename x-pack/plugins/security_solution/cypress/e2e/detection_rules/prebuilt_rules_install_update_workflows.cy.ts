/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createRuleAssetSavedObject } from '../../helpers/rules';
import {
  LOAD_PREBUILT_RULES_BTN,
  LOAD_PREBUILT_RULES_ON_PAGE_HEADER_BTN,
  RULES_MANAGEMENT_TABLE,
  RULES_ROW,
  TOASTER,
  UPDATE_PREBUILT_RULES_CALLOUT_BUTTON,
} from '../../screens/alerts_detection_rules';
import { waitForRulesTableToBeLoaded } from '../../tasks/alerts_detection_rules';
import { createNewRuleAsset, installAvailableRules } from '../../tasks/api_calls/prebuilt_rules';
import { cleanKibana, resetRulesTableState, deleteAlertsAndRules } from '../../tasks/common';
import { esArchiverResetKibana } from '../../tasks/es_archiver';
import { login, visitWithoutDateRange } from '../../tasks/login';
import { SECURITY_DETECTIONS_RULES_URL } from '../../urls/navigation';

interface PackageItem {
  name: string;
  result: {
    installSource: string;
  };
}

describe('Detection rules, Prebuilt Rules Installation and Update workflow', () => {
  before(() => {
    cleanKibana();
    login();
  });
  beforeEach(() => {
    resetRulesTableState();
    deleteAlertsAndRules();
    esArchiverResetKibana();

    visitWithoutDateRange(SECURITY_DETECTIONS_RULES_URL);
  });

  describe('Installation of prebuilt rules package via Fleet', () => {
    it('should install package from Fleet in the background', () => {
      waitForRulesTableToBeLoaded();
      cy.intercept('POST', '/api/fleet/epm/packages/_bulk?prerelease=true').as('installPackage');

      /* Assert that the package in installed from Fleet by checking that
      /* the installSource is "registry", as opposed to "bundle" */
      cy.wait('@installPackage').then(({ response }) => {
        cy.wrap(response?.statusCode).should('eql', 200);

        const packages = response?.body.items.map(({ name, result }: PackageItem) => ({
          name,
          installSource: result.installSource,
        }));

        expect(packages.length).to.have.greaterThan(0);
        expect(packages).to.deep.include.members([
          { name: 'security_detection_engine', installSource: 'registry' },
        ]);
      });
    });
  });

  describe('Installation of prebuilt rules', () => {
    const RULE_1 = createRuleAssetSavedObject({
      name: 'Test rule 1',
      rule_id: '111147bb-b27a-47ec-8b62-ef1a5d342e19',
    });
    const RULE_2 = createRuleAssetSavedObject({
      name: 'Test rule 2',
      rule_id: '22227bb-b27a-47ec-8b62-ef1a5d342e19',
    });
    beforeEach(() => {
      // Prevent the installation of the package
      // `security_detection_engine` from Fleet
      cy.intercept('POST', '/api/fleet/epm/packages/_bulk?prerelease=true', {}).as(
        'getPrebuiltRules'
      );
      // Create two mock rules
      createNewRuleAsset('.kibana', RULE_1);
      createNewRuleAsset('.kibana', RULE_2);
      waitForRulesTableToBeLoaded();
    });

    it('should install available rules when user clicks on main installation call to action', () => {
      cy.get(LOAD_PREBUILT_RULES_BTN).click();
      cy.get(LOAD_PREBUILT_RULES_BTN).should('have.attr', 'disabled');
      cy.get(LOAD_PREBUILT_RULES_BTN).should('not.exist');
      cy.get(RULES_MANAGEMENT_TABLE).find(RULES_ROW).should('have.length', 2);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_1['security-rule'].name);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_2['security-rule'].name);
    });

    it('should install available rules succesfully when user clicks on header installation call to action', () => {
      cy.get(LOAD_PREBUILT_RULES_ON_PAGE_HEADER_BTN).click();
      cy.get(LOAD_PREBUILT_RULES_ON_PAGE_HEADER_BTN).should('have.attr', 'disabled');
      cy.get(LOAD_PREBUILT_RULES_ON_PAGE_HEADER_BTN).should('not.exist');
      cy.get(RULES_MANAGEMENT_TABLE).find(RULES_ROW).should('have.length', 2);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_1['security-rule'].name);
      cy.get(RULES_MANAGEMENT_TABLE).contains(RULE_2['security-rule'].name);
    });

    it('should fail gracefully with toast error message when request to install rules fails', () => {
      /* Stub request to install rules to fail */
      cy.intercept('PUT', '/api/detection_engine/rules/prepackaged', {
        statusCode: 500,
      }).as('installPrebuiltRules');
      cy.get(LOAD_PREBUILT_RULES_BTN).click();
      cy.get(LOAD_PREBUILT_RULES_BTN).should('have.attr', 'disabled');
      cy.wait('@installPrebuiltRules');
      cy.get(LOAD_PREBUILT_RULES_BTN).should('not.have.attr', 'disabled');
      cy.get(TOASTER).should('be.visible').contains('Failed to installed pre-packaged rules');
    });
  });

  describe('Update of prebuilt rules', () => {
    const RULE_ID = '111147bb-b27a-47ec-8b62-ef1a5d342e19';
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
      /* Prevent the installation of the package */
      /* `security_detection_engine` from Fleet  */
      cy.intercept('POST', '/api/fleet/epm/packages/_bulk?prerelease=true', {}).as(
        'getPrebuiltRules'
      );
      // Create a new rule and install it
      createNewRuleAsset('.kibana', OUTDATED_RULE);
      installAvailableRules();
      // Create a second version of the rule, making it available for update
      createNewRuleAsset('.kibana', UPDATED_RULE);
      waitForRulesTableToBeLoaded();
    });

    it('should update rule succesfully when user clicks on update callout', () => {
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).click();
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).should('have.attr', 'disabled');
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).should('not.exist');
      cy.get(RULES_MANAGEMENT_TABLE).find(RULES_ROW).should('have.length', 1);
      cy.get(RULES_MANAGEMENT_TABLE).should('not.contain', OUTDATED_RULE['security-rule'].name);
      cy.get(RULES_MANAGEMENT_TABLE).contains(UPDATED_RULE['security-rule'].name);
    });

    it('should fail gracefully with toast error message when request to update rules fails', () => {
      /* Stub request to update rules to fail */
      cy.intercept('PUT', '/api/detection_engine/rules/prepackaged', {
        statusCode: 500,
      }).as('updatePrebuiltRules');
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).click();
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).should('have.attr', 'disabled');
      cy.wait('@updatePrebuiltRules');

      /* Assert that the rule has not been updated in the UI */
      cy.get(RULES_MANAGEMENT_TABLE).should('contain', OUTDATED_RULE['security-rule'].name);
      cy.get(RULES_MANAGEMENT_TABLE).should('not.contain', UPDATED_RULE['security-rule'].name);
      cy.get(UPDATE_PREBUILT_RULES_CALLOUT_BUTTON).should('not.have.attr', 'disabled');
      /* Toast error is generic and mentions "installation" instead of "update" for all cases */
      cy.get(TOASTER).should('be.visible').contains('Failed to installed pre-packaged rules');
    });
  });
});
