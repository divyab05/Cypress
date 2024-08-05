import { Helpers } from '../../helpers';
import { format } from 'util';
import { AdminCommands } from '../../../support/adminPortal/adminCommands';
import { adminFormControls } from '../../../fixtures/adminPortal/adminFormControls.json';
import { config } from '../../../fixtures/adminPortal/adminConfig.json';

const adminCommands = new AdminCommands();

export class SSOUsersPage extends Helpers {

  ssoUsersFilter() {
    cy.wait(1000);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
  }

  public switchToSSOUsersMappingsTab() {
    cy.wait(1000);
    this.click(adminFormControls.buttons.tabSSOUserMappings);
      this.waitForSpinners();
      this.waitForSpinnerIcon();
  }

  public searchSSOUserEmail(email: string) {
    this.ssoUsersFilter();
    this.type(adminFormControls.inputs.searchUser, email);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn);
    cy.wait(1000);
  }

  public navigateToManageSSOUsers() {
    cy.wait(1000);
    this.click(adminFormControls.buttons.manageUsers);
      this.waitForSpinners();
      this.waitForSpinnerIcon();
      this.getElement(adminFormControls.buttons.nonSSOUser).should('be.visible', { timeout: 9000 });
      this.waitForSpinnerIcon();
  }

  public navigateToManageSignInSecurity() {
    cy.wait(1000);
    this.click(adminFormControls.buttons.manageSignInSecurity);
    this.waitForSpinners();
    this.waitForSpinnerIcon();
    this.getElement(adminFormControls.buttons.updateAttributeMappingBtn).should('be.visible', { timeout: 9000 });
  }

  public searchAndDeleteSSOUser(email: string) {
    this.searchSSOUserEmail(email);
    cy.get('body').then(($body) => {
      if ($body.find('.table.ng-star-inserted').length) {
        Helpers.log('Searched SSO user not found!');
      } else if ($body.find('.p-datatable.p-component').length) {
        this.click(adminFormControls.buttons.deleteUserLink, false, 1000);
        this.click(adminFormControls.buttons.btnOK);
          cy.wait(1000);
      }
    });
  }

  public gotoManageSSOUsers(enterprise: string) {
    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    this.navigateToManageSSOUsers();
  }

  public gotoUsersPage() {
    this.click(adminFormControls.buttons.settingsMenuItems, false);
    this.click(adminFormControls.buttons.manageUsersLink, true);
  }

  public goToManageDivisionsAndLocations(enterprise: string) {
    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    this.click(adminFormControls.buttons.manageDivisionsAndLocations);
    cy.wait(1000);
  }

  public checkIfNonSSOUserIsAlreadyCreatedAndDelete(user) {
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'Non-SSO Users');
    this.type(adminFormControls.inputs.searchUser, user.email);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find('.table.ng-star-inserted').length) {
        Helpers.log('Searched Non-SSO user not found!');
      } else if ($body.find('.p-datatable.p-component').length) {
        this.click(adminFormControls.buttons.deleteUserLink, false, 1000);
        this.click(adminFormControls.buttons.btnOK);
        cy.wait(1000);
        this.click(adminFormControls.buttons.clearBtn);
      }
    });
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
  }

  public checkIfAnyPopUpWindowIsVisible() {
    cy.wait(2000);
    cy.get('body').then(($body) => {
      if ($body.find("div[role='dialog']").length) {
        this.click(adminFormControls.buttons.closeModalButtonCss_2).wait(1000);
      } else {
        Helpers.log('No pop-up window is there');
      }
    });
  }

  public prepareSSOUser(email: string, enterprise: string) {
    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise)
    this.navigateToManageSSOUsers();
    cy.wait(2000);
    this.searchAndDeleteSSOUser(email);
  }

  public searchAndDeleteClientUser(user: string){
    this.click(adminFormControls.buttons.settingsMenuItems);
    this.click(adminFormControls.buttons.manageUsersLink);
    cy.wait(2000);
    this.ssoUsersFilter();
    this.type(adminFormControls.inputs.searchEmailInSSO, user);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find('.table.ng-star-inserted').length) {
        Helpers.log('Searched SSO user not found!');
      } else if ($body.find('.p-datatable.p-component').length) {
        this.click(adminFormControls.buttons.deleteUserLink, false, 1000);
        this.click(adminFormControls.buttons.btnOK);
        cy.wait(1000);
      }
    });
  }

  public addSSOUserMapping(uid: string, access_level: string, role: string, location: string, costAccount?, divisionName?) {
    this.click(adminFormControls.buttons.addSSOUserMapping);
    this.type(adminFormControls.inputs.uidInput, uid);
    this.selectRadioButton(format(adminFormControls.radio.defaultAdminAccessLevel, access_level));
    cy.wait(500);
    if (access_level === 'division') {
      this.click(adminFormControls.dropdown.divisionDropdown);
      this.click(format(adminFormControls.checkBox.rolesOptions, divisionName));
      this.click(adminFormControls.dropdown.divisionDropdown);
      cy.wait(1000);
    } else if (access_level === 'location') {
      this.type(adminFormControls.dropdown.locationDropdown, location);
      cy.wait(1000);
      cy.realPress('Enter');
      this.click("//mat-dialog-container//h2");
      cy.wait(1000);
    }
    this.selectDropdown(adminFormControls.dropdown.assignRole, role);
    this.selectDropdown(adminFormControls.dropdown.selectLocationDropdown, location, true);
    if (costAccount) {
      this.getElement(adminFormControls.staticElements.defaultCostAccountLabel).scrollIntoView();
      this.click(adminFormControls.arrow.defaultCostAccountArrow);
      this.type(adminFormControls.inputs.defaultCostAccountInputInAddSSOUserMapping, costAccount + '{enter}');
    }
    this.click(adminFormControls.buttons.saveButton).wait(2000);
  }

  public addNonSSOUser(user, access_level, role, location) {
    this.click(adminFormControls.buttons.addUserBtn);
    this.type(adminFormControls.inputs.firstName, user.name);
    this.type(adminFormControls.inputs.lastName, user.lastName);
    this.type(adminFormControls.inputs.email, user.email);
    this.selectRadioButton(format(adminFormControls.radio.defaultAdminAccessLevel, access_level));
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    cy.wait(1000);
    this.click(format(adminFormControls.checkBox.rolesOptions, role));
    cy.wait(1000);
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    cy.wait(1000);
    this.selectDropdown(adminFormControls.dropdown.selectLocationDropdown, location, true);
    this.click(adminFormControls.buttons.saveButton);
  }

  public verifySSOUsersMappingsGrid(uid: string, role: string, location: string, access_level: string) {
    let formattedAccessLevel = this.formatAccessLevelName(access_level);
    this.type(adminFormControls.inputs.searchByEmailFieldInSSOUSerMappingTab, uid);
    this.click(adminFormControls.buttons.searchByEmailbtn, false, 1000);
    this.getElement(adminFormControls.ssoUsersMappingsGrid.uidColumn).should('include.text', uid);

    //this.ssoUsersMappingsTabRolesGrid().should('include.text', role); --we have an open bug for this issue
    //this.getElement(adminFormControls.ssoUsersMappingsGrid.roleColumn).should('include.text', role);

    this.getElement(adminFormControls.ssoUsersMappingsGrid.locationColumn).should('include.text', location);
    this.getElement(adminFormControls.ssoUsersMappingsGrid.accessLevelColumn).should('include.text', formattedAccessLevel);
    Helpers.log('Successfully verified user details in grid');
  }

  public verifyCostAccountsInUsersMappingsPage(userMapping, defaultCostAccount = null) {
    this.click(adminFormControls.buttons.ssoUsersMappingEditBtn);
    // this.getElement(adminFormControls.dropdown.defaultCostAccount).scrollIntoView();
    this.getElement(adminFormControls.staticElements.defaultCostAccountLabel).scrollIntoView();
    const costCentreToCheck = defaultCostAccount || userMapping.defaultCostCentre;
    this.checkConditionOnElement(adminFormControls.dropdown.defaultCostAccount, 'include.text', costCentreToCheck);
    //this.checkConditionOnElement("//ng-select[@id='cost-account-list']//div[@class='ng-value-container']", 'include.text', costCentreToCheck);
    Helpers.log('Default Cost Account is correct');
  }

  public verifySSOUsersGrid(email: string, role: string, location: string, access_level: string) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.searchSSOUserEmail(email);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', email);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', location);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_level);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public verifyNonSSOUsersGrid(user, access_level, role, location) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'Non-SSO Users');
    this.type(adminFormControls.inputs.searchUser, user.email);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_UID, "include.text", user.displayName);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssAdminUserEmail, "include.text", user.email);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role, "include.text", role);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location, "include.text", location);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel, "include.text", access_level);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public verifySSOUsersGridInClientConsole(email: string, role: string, location: string, access_level: string) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, email);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', email);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', location);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_level);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public verifyNonSSOUsersGridInClientConsole(user, access_level, role, location) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'Non-SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user.email);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', user.email);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', location);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_level);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public generateSSOUserImportFileWithExistingLocation(filePath: string, userMapping: any) {
    Helpers.log(JSON.stringify(userMapping, null, 2));
    Helpers.log(userMapping.uid);
    Helpers.log(userMapping.role);
    cy.writeFile(filePath, 'UID,Role,Division,BPN,Location,Company Name,Customer Address,City,State,Country,Zip,Phone\n');
    cy.writeFile(filePath, userMapping.uid + ',' + userMapping.role + ',' + userMapping.divisionName + ',' + userMapping.bpn + ',' + userMapping.locationName + ',' + userMapping.company + ',' + userMapping.address + ',' + userMapping.city + ',' + userMapping.state + ',' + userMapping.country + ',' + userMapping.zip + ',' + userMapping.phone, {
        flag: 'a+'
      });
  }

  public generateSSOUserImportFileWithoutExistingLocation(filePath: string, userMapping: any) {
    Helpers.log(JSON.stringify(userMapping, null, 2));
    Helpers.log(userMapping.uid);
    Helpers.log(userMapping.role);
    Helpers.log(userMapping.divisionName);
    cy.writeFile(filePath, 'UID,Role,Division,BPN,Location,Company Name,Customer Address,City,State,Country,Zip,Phone\n');
    cy.writeFile(filePath, userMapping.uid + ',' + userMapping.role + ',' + userMapping.divisionName + ',' + userMapping.bpn + ',' + userMapping.locationName + ',' + userMapping.company + ',' + userMapping.address + ',' + userMapping.city + ',' + userMapping.state + ',' + userMapping.country + ',' + userMapping.zip + ',' + userMapping.phone, {
      flag: 'a+'
    });
    cy.readFile(filePath).then(fileContent => {
      Helpers.log(fileContent);
      cy.wait(2000);
    });
  }

  public generateSSOUserImportFileWithCostAccount(filePath: string, userMapping: any) {
    Helpers.log(JSON.stringify(userMapping, null, 2));
    cy.writeFile(filePath, 'UID,Role,Division,BPN,Location,Company Name,Customer Address,City,State,Country,Zip,Phone,DefaultCostCentre\n');
    cy.writeFile(filePath, userMapping.uid + ',' + userMapping.role + ',' + userMapping.divisionName + ',' + userMapping.bpn + ',' + userMapping.locationName + ',' + userMapping.company + ',' + userMapping.address + ',' + userMapping.city + ',' + userMapping.state + ',' + userMapping.country + ',' + userMapping.zip + ',' + userMapping.phone + ',' +userMapping.defaultCostCentre, {
      flag: 'a+'
    });
    cy.readFile(filePath).then(fileContent => {
      Helpers.log(fileContent);
      cy.wait(2000);
    });
  }

  public importSSOUserMapping(filePath, access_level, userMapping?) {
    let formattedAccessLevel = this.formatAccessLevelName(access_level, false);
    this.click(adminFormControls.buttons.importSSOUserMappingBtn, false, 500);
    this.click(adminFormControls.buttons.manualImport);
    this.selectRadioButton(format(adminFormControls.radio.defaultAdminAccessLevel, formattedAccessLevel));
    cy.wait(500);
    if (access_level === 'Division') {
      this.click(adminFormControls.dropdown.divisionDropdown);
      this.click(format(adminFormControls.checkBox.rolesOptions, userMapping.divisionName));
      this.click(adminFormControls.dropdown.divisionDropdown);
      cy.wait(1000);
    } else if (access_level === 'Location') {
      this.type(adminFormControls.dropdown.locationDropdown, userMapping.locationName);
      this.click("//spa-dialog-import-manual/div/h2");
      cy.wait(1000);
    }
    this.getElement(adminFormControls.inputs.importFileInput).attachFile(filePath);
    cy.wait(1000);
    this.click(adminFormControls.buttons.continueBtnInImport, true, 10000);
    cy.get(adminFormControls.buttons.importProgressBar, { timeout: 90000 }).should('have.length', 0)
    this.click(adminFormControls.buttons.importBtn);
    cy.get(adminFormControls.buttons.importProgressBar, { timeout: 90000 }).should('have.length', 0)
    cy.xpath(adminFormControls.text.alertText).should('not.exist', { timeout: 20000});
    this.waitAndCloseToast();
  }

  public verifiedLocationAndDeleteIt(userMappingData) {
    this.click(adminFormControls.tabToSelect.divisionsLocationsTab);
    cy.wait(500);
    this.type(adminFormControls.inputs.searchLocation, userMappingData.locationName)
    cy.wait(1000);
    this.checkConditionOnElement(adminFormControls.locationGrid.divisionColumn, "include.text", userMappingData.divisionName);
    this.checkConditionOnElement(adminFormControls.locationGrid.locationNameColumn, "include.text", userMappingData.locationName);
    this.checkConditionOnElement(adminFormControls.locationGrid.accNumberColumn, "include.text", userMappingData.bpn);
    this.checkConditionOnElement(adminFormControls.locationGrid.addressColumn, "include.text", userMappingData.address);
    this.checkConditionOnElement(adminFormControls.locationGrid.addressColumn, "include.text", userMappingData.city);
    this.checkConditionOnElement(adminFormControls.locationGrid.addressColumn, "include.text", userMappingData.state);
    this.checkConditionOnElement(adminFormControls.locationGrid.addressColumn, "include.text", userMappingData.zip);
    Helpers.log('Successfully verified new location details');
    this.click(adminFormControls.miniIcons.deleteLocationIcon, false, 1000);
    this.click(adminFormControls.buttons.btnOK);
    this.waitAndCloseToast();
    Helpers.log('Location deleted');
  }

  public formatAccessLevelName(accessLevel, firstLetterShouldBeCapital = true) {
    const firstCharFunc = firstLetterShouldBeCapital ? 'toUpperCase' : 'toLowerCase';
    return accessLevel.charAt(0)[firstCharFunc]() + accessLevel.slice(1).toLowerCase();
  }

  public verifiedSSOUserWithNewLocation(userMappingData, email, accessLevel) {
    let formattedAccessLevel = this.formatAccessLevelName(accessLevel);
    this.searchSSOUserEmail(email);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssAdminUserEmail, 'include.text', email);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role, 'include.text', userMappingData.role);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location, 'include.text', userMappingData.locationName);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel, 'include.text', formattedAccessLevel);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public deleteUser() {
    this.click(adminFormControls.buttons.deleteUserLink, false, 1000);
    this.click(adminFormControls.buttons.btnOK);
    cy.wait(1000);
    this.checkConditionOnElement("//tbody", 'include.text', "User not found");
    Helpers.log('User is deleted');
  }

  public editAndVerifyNonSSOUserChanges(user, access_level, role, newRole, location) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'Non-SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user.email);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.selectRadioButton(format(adminFormControls.radio.defaultAdminAccessLevel, access_level));
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    this.click(format(adminFormControls.checkBox.rolesOptions, role));
    this.click(format(adminFormControls.checkBox.rolesOptions, newRole));
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    this.selectDropdown(adminFormControls.dropdown.selectLocationDropdown, location, true);
    this.click(adminFormControls.buttons.saveButton, true);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role, "include.text", newRole);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location, "include.text", location);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel, "include.text", access_level);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public editAndVerifySSOUserChanges(user, role, newRole, location) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.getElement(adminFormControls.dropdown.adminRolesDropdown).scrollIntoView();
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    this.click(format(adminFormControls.checkBox.rolesOptions, role));
    this.getElement(adminFormControls.dropdown.adminRolesDropdown).scrollIntoView();
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    this.click(format(adminFormControls.checkBox.rolesOptions, newRole));
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    cy.wait(5555);
    this.selectDropdown(adminFormControls.dropdown.selectLocationDropdown, location, true);
    this.click(adminFormControls.buttons.saveButton, true);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role, "include.text", newRole);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location, "include.text", location);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public verifyDefaultCostAccountInUsersTab(user, userMapping, access_Level) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.checkIfAnyPopUpWindowIsVisible();
    this.click(adminFormControls.buttons.usersTab);
    cy.wait(1000).get('body').then(($body) => {
      if ($body.find("div[role='dialog']").length) {
        this.click(adminFormControls.buttons.okBtnInUsersTab).wait(1000);
      } else {
        Helpers.log('No pop-up window is there');
      }
    });
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user + '{enter}');
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', user);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', userMapping.role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', userMapping.locationName);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_Level);
    Helpers.log('Successfully verified user details in the Users grid');
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.click(adminFormControls.buttons.ssoUsersMappingEditBtn);
    //this.getElement(adminFormControls.dropdown.defaultCostAccount).scrollIntoView();
    this.checkConditionOnElement(adminFormControls.dropdown.defaultCostAccount, 'include.text', userMapping.defaultCostCentre);
    this.click(adminFormControls.buttons.saveButton);
    this.waitForSpinnerIcon();
    Helpers.log('Default Cost Account is correct');
  }

  public verifyDefaultCostAccountInUsersTab_notImport(user, role, location, access_level, costAccount) {
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', user);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', location);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_level);
    Helpers.log('Successfully verified user details in the Users grid');
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.click(adminFormControls.buttons.ssoUsersMappingEditBtn);
    this.getElement(adminFormControls.staticElements.defaultCostAccountLabel).scrollIntoView();
    // this.checkConditionOnElement("//spa-cost-account-select[@id='cost-account-list']//div[@class='ng-value-container']", 'include.text', costAccount);
    this.checkConditionOnElement("//*[@id='cost-account-list']//div[@class='ng-value-container']", 'include.text', costAccount);
    this.click(adminFormControls.buttons.saveButton);
    this.waitForSpinnerIcon();
    Helpers.log('Default Cost Account is correct');
  }

  public verifyUserDetailsInUsersTab_clientConsole(user, role, location, access_level, costAccount) {
    this.click(adminFormControls.buttons.settingsMenuItems);
    this.click(adminFormControls.buttons.manageUsersLink);
    cy.wait(2000);
    this.ssoUsersFilter();
    this.type(adminFormControls.inputs.searchEmailInSSO, user);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.getElement(adminFormControls.adminUsersGrid.ssAdminUserEmail).should('include.text', user);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role).should('include.text', role);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location).should('include.text', location);
    this.getElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_AccessLevel).should('include.text', access_level);
    this.forceClick(adminFormControls.buttons.ssoUsersMappingEditBtn);
    this.getElement(adminFormControls.staticElements.defaultCostAccountLabel).scrollIntoView();
    this.checkConditionOnElement("//spa-cost-account-select[@id='cost-account-list']//div[@class='ng-value-container']", 'include.text', costAccount);
    this.click(adminFormControls.buttons.closeButton);
    Helpers.log('Successfully verified user details in the Users grid');
  }

  public verifyDefaultCostAccountInShippingLabelPage(userMapping, defaultCostAccount = null, enterprise) {
    const sso_enterprise = config[Cypress.env('appEnv')]['sso_enterprise'];
    const oidc_enterprise = config[Cypress.env('appEnv')]['oidc_enterprise'];
    const costCentreToCheck = defaultCostAccount || userMapping.defaultCostCentre;
    this.click(adminFormControls.buttons.createShippingLabelsBtn, false);
    cy.wait(8000);
    this.verifySenderAddress();
    // if (enterprise === oidc_enterprise) {
    //   //this.getValue(adminFormControls.inputs.oidcCostAccountInput).then(costAccount => {
    //   this.getText(adminFormControls.dropdown.ssoDefaultCostAccount).then(costAccount => {
    //     expect(costAccount).to.equals(costCentreToCheck);
    //     Helpers.log(`Cost Account in Shipping Label is set correctly: ${costAccount}`);
    //   });
    //   } else if (enterprise === sso_enterprise) {
    this.getText(adminFormControls.dropdown.ssoDefaultCostAccount).then(costAccount => {
        expect(costAccount).to.equals(costCentreToCheck);
        Helpers.log(`Cost Account in Shipping Label is set correctly: ${costAccount}`);
      });
    // }
  }

  public verifySenderAddress() {
    this.findElementInBody("h2[class]:contains('Verify')").then((found) => {
      if (found) {
        Helpers.log('The Verify Address modal has appeared');
        this.selectRadioButton(adminFormControls.radio.suggestedAddress);
        this.click(adminFormControls.buttons.suggestedAddressOK);
      }
    });
  }

  public verifyDefaultCostAccountInStamps(userMapping, defaultCostAccount = null, enterprise) {
    const costCentreToCheck = defaultCostAccount || userMapping.defaultCostCentre;
    const oidc_enterprise = config[Cypress.env('appEnv')]['oidc_enterprise'];
    const sso_enterprise = config[Cypress.env('appEnv')]['sso_enterprise'];
    this.click(adminFormControls.buttons.shippingAndMailingBtn);
    this.click(adminFormControls.tabToSelect.stampSheets);
    cy.wait(5000);
    // if (enterprise === oidc_enterprise) {
    //   //this.getValue(adminFormControls.inputs.oidcCostAccountInput).then(costAccount => {
    //   this.getText(adminFormControls.dropdown.ssoDefaultCostAccount).then(costAccount => {
    //     expect(costAccount).to.equals(costCentreToCheck);
    //     Helpers.log(`Cost Account in Shipping Label is set correctly: ${costAccount}`);
    //   });
    // } else if (enterprise === sso_enterprise) {
    this.getText(adminFormControls.dropdown.ssoDefaultCostAccount).then(costAccount => {
      expect(costAccount).to.equals(costCentreToCheck);
      Helpers.log(`Cost Account in Shipping Label is set correctly: ${costAccount}`);
      // });
    });
  }

  public checkCostAccount(costAccount) {
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    //this.getElement(adminFormControls.dropdown.defaultCostAccount).scrollIntoView();
    this.checkConditionOnElement(adminFormControls.dropdown.defaultCostAccount, 'include.text', costAccount);
    this.click(adminFormControls.buttons.saveButton);
    this.waitForSpinnerIcon();
    Helpers.log('Default Cost Account is correct');
  }

  public checkIfUserNotExist(user) {
    cy.wait(2000);
    this.click(adminFormControls.buttons.tabSSOUserMappings);
    this.click(adminFormControls.buttons.usersTab);
    this.click(adminFormControls.dropdown.ssoUsersFilter);
    this.selectDropdown(adminFormControls.dropdown.ssoUsersFilter, 'SSO Users');
    this.type(adminFormControls.inputs.searchEmailInSSO, user);
    cy.wait(500);
    this.click(adminFormControls.buttons.searchByEmailbtn).wait(1000);
    this.checkConditionOnElement("//table//div[@class='empty-state-head']", 'include.text', "Search for Active SSO User");
    Helpers.log(`User ${user} is not existing`);
  }

  public goToManageSignInSecurity(enterprise: string) {
    adminCommands.navigateToClientSetupTab();
    adminCommands.selectEnterPriseInClientSetupTab(enterprise);
    this.navigateToManageSignInSecurity();
  }

  public clearAttributeMapping() {
    this.clear(adminFormControls.inputs.locationAttributeInput);
    this.clear(adminFormControls.inputs.roleAttributeInput);
    this.clear(adminFormControls.inputs.costCenterAttributeInput);
    this.click(adminFormControls.buttons.updateAttributeMappingBtn);
    this.waitAndCloseToast();
  }

  public checkIfJITCheckboxIsEnabled() {
    this.findElementInBody(adminFormControls.checkBox.JITCheckboxEnabled).then(result => {
      if (result) {
        Helpers.log('"Allow user update through JIT" is already checked and enabled');
      } else {
        this.selectCheckboxCy(adminFormControls.checkBox.JITCheckbox);
      }
      }
    )
  }

  public verifyAttributeMapping(location, role, costCenter) {
    this.getValue(adminFormControls.inputs.locationAttributeInput).then(locationNameValue => {
      if (locationNameValue === location) {
        Helpers.log("Location is set correctly");
      } else {
        this.type(adminFormControls.inputs.locationAttributeInput, location);
      }
    });
    this.getValue(adminFormControls.inputs.roleAttributeInput).then(roleName => {
      if (roleName === role) {
        Helpers.log("Role is set correctly");
      } else {
        this.type(adminFormControls.inputs.roleAttributeInput, role);
      }
    });
    this.getValue(adminFormControls.inputs.costCenterAttributeInput).then(costCenterName => {
      if (costCenterName === costCenter) {
        Helpers.log("Cost Center is set correctly");
      } else {
        this.type(adminFormControls.inputs.costCenterAttributeInput, costCenter);
      }
    });
    this.click(adminFormControls.buttons.updateAttributeMappingBtn);
    this.waitAndCloseToast();
  }

  public addDetailsToExistingSSOUser(role, location, costCenter?) {
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.click(adminFormControls.dropdown.adminRolesDropdown);
    this.getElement(adminFormControls.dropdown.adminRolesDropdown).type(role);
    this.click(adminFormControls.checkBox.roleCheckbox);
    this.selectDropdown(adminFormControls.dropdown.selectLocationDropdown, location, true);
    if (costCenter) {
      this.getElement(adminFormControls.staticElements.defaultCostAccountLabel).scrollIntoView();
      this.click(adminFormControls.arrow.defaultCostAccountArrow);
      this.type(adminFormControls.inputs.defaultCostAccountInputInAddSSOUserMapping, costCenter + '{enter}');
    }
    this.click(adminFormControls.buttons.saveButton).wait(2000);
  }

  public verifyIfUsersCustomSetupIsCorrect(role, location) {
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Role, 'have.text', ` ${role} `);
    this.checkConditionOnElement(adminFormControls.adminUsersGrid.ssoAdminUserGrid_Location, 'have.text', ` ${location} `);
    this.click(adminFormControls.buttons.editUserInAdminUserSearchPage);
    this.checkConditionOnElement(adminFormControls.dropdown.assignRole, 'have.text', role);
    this.getElement(adminFormControls.dropdown.selectLocationDropdown).scrollIntoView();
    this.checkConditionOnElement(adminFormControls.text.locationNameInUsersDetails, 'have.text', location);
    this.click(adminFormControls.buttons.closeModalButtonCss_2);
  }

}
