export function adminInterceptApiCalls() {
  cy.intercept('POST', '**api/sending/v1/stamps/*/users/*/spoilage').as('spoilageApi');
  cy.intercept('GET', '**api/sending/v1/subscriptions/*/users/*/stamps?*').as('getStampTransaction');
  cy.intercept('GET', '**api/sending/v2/subscriptions/*/users/*/shipments?*').as('getLabelTransaction');
}

export function interceptsAddAdminApiCalls() {
  cy.intercept('POST', '**/api/subscription-management/v1/users').as('subscriptionmanagement');
  cy.intercept('POST', '**/api/subscription-management/v1/adminusermappings').as('addSSOAdminUserMapping');
  cy.intercept('GET', '**/api/subscription-management/v1/adminusermappings?*').as('getSSOAdminUserMapping');
  cy.intercept('PUT', '**/api/subscription-management/v1/adminusermappings/*').as('editSSOAdminUserMapping');
}

export function interceptsAddRoleTemplate() {
  cy.intercept('POST', '**/api/product-metadata/v1/roleTemplates').as('addRoletemplate');
  cy.intercept('DELETE', '**/api/product-metadata/v1/roleTemplates/*').as('deleteCreatedRoleTemplate');
}

export function interceptsAddPlanDefinition() {
  cy.intercept('POST', '**/api/product-metadata/v1/plans').as('addPlanDefinition');
  cy.intercept('DELETE', '**/api/product-metadata/v1/plans/*').as('deleteCreatedPlan');
}

export function interceptsSelectEnterprise() {
  cy.intercept('GET', '**/api/client-management/v1/enterprises/*').as('selectEnterprise');
  cy.intercept('GET', '**/api/subscription-management/v1/enterprises/*/subscriptions').as('subscription');
  cy.intercept('GET', '**/api/subscription-management/v1/users/*').as('userSubscriptionManagement');
}

export function interceptsAddDivisionLocation() {
  cy.intercept('POST', '**/api/client-management/v1/divisions').as('addDivision');
  cy.intercept('POST', '**/api/client-management/v1/enterprises/*/divisions').as('enterpriseDivision');
  cy.intercept('GET', '**/pi/client-management/v1/enterprises/*/divisions').as('getDivision');
  cy.intercept('POST', '**/api/client-management/v1/enterprises/*/locations/import').as('importLocation');
  cy.intercept('POST', '**/api/client-management/v1/locations').as('addLocation');
  cy.intercept('POST', '**/api/client-management/v1/divisions/*/locations').as('enterpriseLocation');
  cy.intercept('DELETE', '**/api/client-management/v2/subscriptions/*/locations/*').as('deleteLocation');
  cy.intercept('POST', '**/api/job-management/v1/importUrl?*').as('importLocation1');
  cy.intercept('GET', '**/api/job-management/v1/jobs/*/fieldMapping?*').as('importLocation2');
  cy.intercept('POST', '**/api/job-management/v1/jobs/*/process?*').as('importLocation3');
  cy.intercept('GET', '**/api/client-management/v1/locations/fieldList').as('fieldList');
}

export function interceptsAddCostAccount() {
  cy.intercept('POST', '**/api/cost-accounts/v2/costAccounts').as('addCostAccount_ClientSetup');
  cy.intercept('PUT', '**/api/cost-accounts/v2/subscriptions/*/costAccounts/*').as('editCostAccount_ClientSetup');
  cy.intercept('PUT', '**/api/cost-accounts/v2/subscriptions/*/costAccounts/*/archive').as('deleteCostAccount_ClientSetup');
  cy.intercept('GET', '**/api/cost-accounts/v3/subscriptions/*/costAccounts/jobs/*/status').as('importFileStatus');
  cy.intercept('POST', '**/api/cost-accounts/v1/costAccounts/advanceSearch?*').as('advancedSearchAPI');
}

export function interceptsAddContact() {
  cy.intercept('POST', '**/api/addressbook/v1/contact?admin=true&sId=*').as('addContact_ClientSetup');
  cy.intercept('PATCH', '**/api/addressbook/v1/contacts/delete?ssto=true&admin=true&sId=*').as('deleteContact_ClientSetup');
  cy.intercept('POST', '**/api/addressbook/v1/contacts/subscriptions/*/addressbooks/upload?*').as('importContact_ClientSetup1');
  cy.intercept('POST', '**/api/addressbook/v1/contacts/subscriptions/*/addressbooks/jobs/*/process?*').as('importContact_ClientSetup2');
  cy.intercept('**/api/address/v1/addresses/rules/*').as('getAddressRules');
  cy.intercept('POST', '**/api/addressbook/v1/contact').as('addContact');
  cy.intercept('PUT', '**/api/addressbook/v1/contact/*').as('updateContact');
  cy.intercept('PATCH', '**/api/addressbook/v1/contacts/delete').as('deleteContact');
  // The DELETE api is not working
  // cy.intercept('DELETE', '**/api/address-book/v1/contact/*').as('deleteContact');
  cy.intercept('GET', /\/api\/addressbook\/v1\/contacts\?(?:(?!search=fullName).)*$/).as('getContacts');
  cy.intercept('GET', '/api/addressbook/v1/contacts/RECIPIENT*').as('getRecipientContacts');
  //cy.intercept('GET', '/api/address-book/v1/contacts/RECIPIENT?fields=name,company,addresses.addressLine1,addresses.city,addresses.state,addresses.postalCode,emails.email,phones.phone&sort=name,asc&skip=0&limit=10&searchBy=addresses.countryCode:US').as('getRecipientContacts');
  cy.intercept('GET', /\/api\/addressbook\/v1\/contacts\?.*search=fullName/).as('searchContact');
  cy.intercept('POST', '**/api/addressbook/v1/contacts/addressbooks/upload').as('uploadImportedAddresses');
  cy.intercept('GET', '**api/addressbook/v1/contacts/subscriptions/*/addressbooks/jobs/*/status?*').as('getImportedAddresses');
  cy.intercept('POST', '**/api/addressbook/v1/contacts/addressbooks/jobs/*/process').as('processAddressbookImport');
  cy.intercept('PUT', '/api/addressbook/v1/recipientlist/*').as('updatedRecipientList');
  cy.intercept('GET', '/api/rates/v1/supportedcountries').as('getSupportedCountries');
  cy.intercept('GET', '/api/addressbook/v2/contacts/export/jobs/*/status').as('exportAddressbook');
}

export function interceptsUserManagementApiCalls() {
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/*/userByEmail').as('addUser_ClientSetup');
  cy.intercept('GET', '**/api/subscription-management/v1/passwordReset/users/*').as('resetPassword');
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/advanceSearch*').as('searchUser_ClientSetup');
}

export function interceptsExportLocationApiCalls() {
  cy.intercept('POST', '**/api/client-management/v1/subscriptions/*/location/export').as('exportLocation');
}

export function interceptsEditAdminUser() {
  cy.intercept('GET', '**/api/product-metadata/v1/adminRoles').as('editUser');
}

export function interceptsCustomFields() {
  cy.intercept('POST', '**/api/submeta/v1/subscriptions/*/customfields').as('addCustomField');
  cy.intercept('DELETE', '**/api/submeta/v1/subscriptions/*/customfields/*').as('deleteCustomField');
}

export function interceptsNotification() {
  cy.intercept('POST', '**/api/notificationsvc/v2/subscription/*/customNotificationConfigurations').as('addNotification');
  cy.intercept('DELETE', '**/api/notificationsvc/v1/subscription/*/customNotificationConfigurations/*').as('deleteNotification');
  cy.intercept('PUT', '**/api/notificationsvc/v2/subscription/*/customNotificationConfigurations/*?customNotification=true').as('inactiveNotification');
  cy.intercept('GET', '**/api/notificationsvc/v2/subscription/*/manageCustomNotificationConfigurations?*').as('editSystemNotifications');
}

export function interceptsBusinessRuleset() {
  cy.intercept('POST', '**/api/submeta/v1/subscriptions/*/ruleSets').as('addBusinessruleSet');
  cy.intercept('DELETE', '**/api/submeta/v1/subscriptions/*/ruleSets/*').as('deleteRuleset');
}

export function interceptsProducts() {
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/*/deviceByDetail').as('addDeviceByDetails');
  cy.intercept('POST', '**/api/device-hub/v1/devicehub').as('addDeviceHub');
  cy.intercept('DELETE', '**/api/device-hub/v1/devicehub/*/*/*').as('deleteDeviceHub');
  cy.intercept('DELETE', '**/api/subscription-management/v1/subscriptions/*/devices/*/deviceType/DVH').as('deleteDeviceHubSubs');
}
