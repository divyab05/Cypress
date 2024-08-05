import { Helpers } from '../helpers';
import { adminFormControls } from '../../fixtures/adminPortal/adminFormControls.json'
import { format } from 'util';

export class AdminChecker extends Helpers {

  public checkHomePageElementsAreDisplayedWhenNoEnterpriseIsSelected() {
    this.checker(adminFormControls.dropdown.selectEnterprise, adminFormControls.condition.contains, adminFormControls.values.selectEnterpriseText)
    this.checker(adminFormControls.buttons.manageSubscriptions, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageIntegrations, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageDivisionsAndLocations, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageCarriers, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageCostAccounts, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageAddressBook, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageRoles, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageUsers, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageProducts, adminFormControls.condition.beDisabled, '')
    this.checker(adminFormControls.buttons.manageBusinessRules, adminFormControls.condition.beDisabled, '')
    if (Cypress.env('appEnv').includes('fed') === false) 
      this.checker(adminFormControls.buttons.manageNotificationsAndTemplates, adminFormControls.condition.beDisabled, '')
  }

  public checkIfEnterpriseExist(enterpriseName: string) {
    this.checker(format(adminFormControls.activeEnterprisesGrid.enterprisePath, 1), adminFormControls.condition.contains, enterpriseName);
    this.checker(format(adminFormControls.activeEnterprisesGrid.nidPath, 1), adminFormControls.condition.isEmpty, '');
    this.checker(format(adminFormControls.activeEnterprisesGrid.sapEnterpriseNamePath, 1), adminFormControls.condition.isEmpty, '');
  }

  public checkEnterpriseNameValidationWhenEmpty() {
    this.click(adminFormControls.staticElements.modalHeader);
    this.checker(adminFormControls.validations.enterpriseName, adminFormControls.condition.beVisible, '');
    this.checker(adminFormControls.validations.enterpriseName, adminFormControls.condition.contains, adminFormControls.values.pleaseEnterEnterpriseName);
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.beDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.beDisabled, '');
  }

  public checkEnterpriseIdValidationWhenEmpty() {
    this.selectCheckboxCy(adminFormControls.checkBox.allowCustomEnterpriseId);
    this.clear(adminFormControls.inputs.enterpriseId);
    this.click(adminFormControls.staticElements.modalHeader);
    cy.wait(500)
    this.checker(adminFormControls.validations.enterpriseId, adminFormControls.condition.beVisible, '');
    this.checker(adminFormControls.validations.enterpriseId, adminFormControls.condition.contains, adminFormControls.values.pleaseEnterEnterpriseId);
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.beDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.beDisabled, '');
  }

  public checkCreatingEnterpriseAvailableAfterDeselectIdCheckbox() {
    this.unSelectCheckboxCy(adminFormControls.checkBox.allowCustomEnterpriseId);
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.notBeDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.notBeDisabled, '');
  }

  public checkWhenEnterpriseIdIsFilledButNameIsEmpty() {
    this.checkEnterpriseIdValidationWithValue();
    this.clear(adminFormControls.inputs.enterpriseName);
    this.checkEnterpriseNameValidationWhenEmpty();
  }

  public checkWhenEnterpriseIdAndNameAreFilled() {
    this.selectCheckboxCy(adminFormControls.checkBox.allowCustomEnterpriseId);
    this.checkEnterpriseIdValidationWithValue();
    this.checkEnterpriseNameValidationForMoreThan50Chars();
  }

  public checkEnterpriseIdValidationWithValue() {
    this.sendText(adminFormControls.inputs.enterpriseId, adminFormControls.testData.enterpriseId);
    this.checker(adminFormControls.validations.enterpriseId, adminFormControls.condition.notExist, '');
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.notBeDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.notBeDisabled, '');
  }

  public checkEnterpriseNameValidationWhenOneCharAndTwoChars() {
    this.sendText(adminFormControls.inputs.enterpriseName, 'a');
    this.checker(adminFormControls.validations.enterpriseName, adminFormControls.condition.beVisible, '');
    this.checker(adminFormControls.validations.enterpriseName, adminFormControls.condition.contains, adminFormControls.values.enterpriseNameShouldBeMin2CharsLong);
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.beDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.beDisabled, '');

    this.sendText(adminFormControls.inputs.enterpriseName, 'ab');
    this.checker(adminFormControls.validations.enterpriseName, adminFormControls.condition.notExist, '');
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.notBeDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.notBeDisabled, '');
  }

  public checkEnterpriseNameValidationForMoreThan50Chars() {
    const nameMoreThan50chars = "123456789012345678901234567890123456789012345678901234567890"
    this.sendText(adminFormControls.inputs.enterpriseName, nameMoreThan50chars);
    cy.wait(500)
    this.getValue(adminFormControls.inputs.enterpriseName)
      .then(name => {
        Helpers.log(name.toString())
        expect(name.toString().length).equals(50);
      });
    this.checker(adminFormControls.buttons.saveAndCloseInModal, adminFormControls.condition.notBeDisabled, '');
    this.checker(adminFormControls.buttons.saveAndAddAnotherInModal, adminFormControls.condition.notBeDisabled, '');
  }

  public checkIfActiveEnterpriseUserExist(firstName:string, lastName:string,email:string,status:string,assignedEnterprises:string,groupEnterprise?:string) {
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, firstName);
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, lastName);
    this.checker(format(adminFormControls.adminUsersGrid.emailPath, 1), adminFormControls.condition.contains, email.substr(0,15));
    //this.checker(format(adminFormControls.adminUsersGrid.groupsPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.groupEnterprise);
    this.checker(format(adminFormControls.adminUsersGrid.statusPath, 1), adminFormControls.condition.contains, status);
    this.checker(format(adminFormControls.adminUsersGrid.assignedEnterprises, 1), adminFormControls.condition.contains, assignedEnterprises);
  }

  public checkIfActivePbOperatorUserExist() {
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.firstName);
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.lastName);
    this.checker(format(adminFormControls.adminUsersGrid.emailPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.email.substr(0,15));
    this.checker(format(adminFormControls.adminUsersGrid.groupsPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.groupOperator);
    this.checker(format(adminFormControls.adminUsersGrid.statusPath, 1), adminFormControls.condition.contains, adminFormControls.values.active);
    this.checker(format(adminFormControls.adminUsersGrid.assignedEnterprises, 1), adminFormControls.condition.contains, adminFormControls.values.assignedEnterprises_0);
  }

  public checkIfActivePbSupportUserExist() {
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.firstName);
    this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.lastName);
    this.checker(format(adminFormControls.adminUsersGrid.emailPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.email.substr(0,15));
    this.checker(format(adminFormControls.adminUsersGrid.groupsPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.groupSupport);
    this.checker(format(adminFormControls.adminUsersGrid.statusPath, 1), adminFormControls.condition.contains, adminFormControls.values.active);
    this.checker(format(adminFormControls.adminUsersGrid.assignedEnterprises, 1), adminFormControls.condition.contains, adminFormControls.values.assignedEnterprises_0);
  }

  // public checkIfInActiveEnterpriseUserExist() {
  //   this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.firstName);
  //   this.checker(format(adminFormControls.adminUsersGrid.namePath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.lastName);
  //   this.checker(format(adminFormControls.adminUsersGrid.emailPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.email.substr(0,15));
  //   this.checker(format(adminFormControls.adminUsersGrid.groupsPath, 1), adminFormControls.condition.contains, adminFormControls.testData.adminUserActive.group);
  //   this.checker(format(adminFormControls.adminUsersGrid.statusPath, 1), adminFormControls.condition.contains, adminFormControls.values.inactive);
  //   this.checker(format(adminFormControls.adminUsersGrid.assignedEnterprises, 1), adminFormControls.condition.contains, adminFormControls.values.assignedEnterprises_1);
  // }

  public checkAddedRoleTemplateExist(displayName:string, featureCount:number) {
    this.checker(adminFormControls.roletemplateGrid.roleTemplateName, adminFormControls.condition.contains, displayName);
    this.checker(adminFormControls.roletemplateGrid.features, adminFormControls.condition.contains, featureCount);
  }

  public checkAddedPlanDefinitionExist(displayName:string, featureCount:number, description:string, status:string) {
    this.checker(adminFormControls.planDefinitionGrid.planName, adminFormControls.condition.contains, displayName);
    //this.checker(adminFormControls.planDefinitionGrid.features, adminFormControls.condition.contains, featureCount);
    this.checker(adminFormControls.planDefinitionGrid.description, adminFormControls.condition.contains, description);
    this.checker(adminFormControls.planDefinitionGrid.status, adminFormControls.condition.contains, status);
  }

  public checkAddedLocationExist(displayName:string, featureCount:number, description:string, status:string) {
    this.checker(adminFormControls.planDefinitionGrid.planName, adminFormControls.condition.contains, displayName);
    //this.checker(adminFormControls.planDefinitionGrid.features, adminFormControls.condition.contains, featureCount);
    this.checker(adminFormControls.planDefinitionGrid.description, adminFormControls.condition.contains, description);
    this.checker(adminFormControls.planDefinitionGrid.status, adminFormControls.condition.contains, status);
  }

}
