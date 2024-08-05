export function interceptsUserManagementApiCalls() {
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/*/userByEmail').as('addUser');
  cy.intercept('PUT', '**/api/subscription-management/v1/users/*').as('userCreated');
  cy.intercept('GET', '**/api/subscription-management/v1/subscriptions/*').as('getSubscription');
  cy.intercept('GET', '**/api/client-management/v1/subscriptions/*/users/*/divisions?*').as('getDivisions');
  cy.intercept('GET', '**/api/subscription-management/v1/userProperties').as('getUserProperties');
  cy.intercept('POST', '**/api/cost-accounts/v1/costAccounts/advanceSearch?*').as('getCostAccount');
  cy.intercept('GET', '**/api/subscription-management/v1/subscriptions/*/subscriptionRoles').as('getSubscriptionRoles');
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/advanceSearch?*').as('getUserByPermission');
  cy.intercept('GET', '**/api/subscription-management/v1/resendEmail/users/*').as('resendEmailLink');
  cy.intercept('GET', '**/api/subscription-management/v1/passwordReset/users/*').as('resetPassword');
  cy.intercept('DELETE', '**/api/subscription-management/v1/users/*').as('deleteUser');
  cy.intercept('GET', '**/api/subscription-management/v1/jobs/user?skip=0&limit=10&sortBy=insertTimestamp:desc').as('getUserJob');

  cy.intercept('GET', '**/api/subscription-management/v1/federationMapping?*').as('federationMappingSSO');
  cy.intercept('GET', '**/api/subscription-management/v1/usersByPermission?*').as('getUserByPermissionSSO');
  cy.intercept('GET', '**/api/subscription-management/v1/jobs/*/downloadUrl?fileType=output').as('downloadExportedFileInJobstatus');


}

export function interceptsCostAccountApiCalls() {
  cy.intercept('GET', '**/api/cost-accounts/v2/costAccounts?*').as('getCostAccounts');
  cy.intercept('GET', '**/api/cost-accounts/v1/subscriptions/*/users/*/costAccounts?*').as('getAllCostAccounts');
  cy.intercept('POST', '**/api/cost-accounts/v2/costAccounts').as('addCostAccount');
  cy.intercept('PUT', '**/api/cost-accounts/v2/costAccounts/*').as('updateCostAccount');
  cy.intercept('GET', '**/api/cost-accounts/v2/costAccounts?query=**').as('searchCostAccount');
  cy.intercept('GET', '**/api/cost-accounts/v3/costAccounts/jobs/*/status').as('importFileStatus');
  cy.intercept('GET', '**/api/cost-accounts/v2/costAccounts/jobs/*/status').as('exportFileStatusV2');
  cy.intercept('PUT', '**/api/cost-accounts/v2/costAccounts/*/archive').as('deleteCostAccount');
  cy.intercept('GET', '**/api/cost-accounts/v1/costAccounts/import/fieldsList?type=default').as('getCostAccInDownload');
  cy.intercept('GET', '**/api/cost-accounts/v3/costAccountsJobs?skip=0&limit=10&sortBy=insertTimestamp:desc').as('getCostAccJobs');
  cy.intercept('GET', '**/api/job-management/v1/jobs?skip=0&limit=10&sortBy=insertTimestamp:desc&source=COST_ACCOUNT_EXPORT&isScheduled=false').as('getExportHistory');
  cy.intercept('POST', '**/api/job-management/v1/jobs?submit=true').as('getExportJobId');

  //Schedule import
  //cy.intercept('POST', '**/api/job-management/v2/validateIntegrationType?*').as('validateSFTP');
  cy.intercept('POST', '**/api/job-management/v1/validateIntegrationType').as('validateSFTP');
  cy.intercept('POST', '**/api/job-management/v1/scheduledJobs').as('addScheduleJob');
  cy.intercept('DELETE', '**/api/job-management/v1/scheduledJobs/*/archive').as('delScheduleConfig');
  cy.intercept('DELETE', '**/api/job-management/v1/jobs/*/archive').as('deleteHistory');

  //ALM Schedule Import
  cy.intercept('POST', '**/api/submeta/v1/sftpfieldlist').as('validateSFTPInALMScheduleImport');
  cy.intercept('GET', '**/api/cost-accounts/v1/costAccounts/import/fieldsList?type=default').as('fieldList');
  cy.intercept('GET', '**/api/client-management/v1/subscriptions/*/users/*/divisions?skip=0&limit=50').as('getDivisionAPIInsideScheduleImportEdit');
  cy.intercept('GET', '**/api/client-management/v1/subscriptions/*/users/*/locations?skip=0&limit=50').as('getLocationAPIInsideScheduleImportEdit');
  cy.intercept('POST', '**/api/submeta/v1/sftpuserconfigs/*').as('getSftpUserConfigs');
  cy.intercept('DELETE', '**/api/submeta/v1/sftpuserconfigs/*').as('deleteSftpUserConfigs');
}

export function interceptsDivisionLocationApiCalls() {
  cy.intercept('GET', '**/api/client-management/v1/enterprises/*/divisions').as('getEntDivisions');
  cy.intercept('POST', '**/api/client-management/v1/divisions').as('createDivision');
  cy.intercept('POST', '**/api/client-management/v1/enterprises/*/divisions').as('createEntDivision');
  cy.intercept('POST', '**/api/client-management/v1/locations').as('createLocation');
  cy.intercept('POST', '**/api/client-management/v1/location/export').as('exportLocation');
  cy.intercept('GET', '**/api/client-management/v1/location/*/status').as('exportStatusLocation');
  cy.intercept('POST', '**/api/client-management/v1/enterprises/*/locations/import').as('importLocation');
  cy.intercept('GET', '**/api/client-management/v1/subscriptions/*/users/*/locations?*').as('getLocations');
  cy.intercept('DELETE', '**/api/client-management/v2/subscriptions/*/locations/*').as('deleteLocation');
  cy.intercept('POST', '**/api/job-management/v1/importUrl?*').as('importLocation1');
  cy.intercept('GET', '**/api/job-management/v1/jobs/*/fieldMapping?*').as('importLocation2');
  cy.intercept('POST', '**/api/job-management/v1/jobs/*/process?*').as('importLocation3');
  cy.intercept('DELETE', '**/api/client-management/v1/divisions/*').as('deleteDivision');
  cy.intercept('GET', '**/api/client-management/v1/locations/fieldList').as('fieldList');

}

export function interceptsSubscrionRolesApiCalls() {
  cy.intercept('GET', '**/api/product-metadata/v1/roleTemplates?countryCode=US').as('getRolesTemplate');
  cy.intercept('POST', '**/api/subscription-management/v1/subscriptions/*/subscriptionRoles').as('createRole');
  cy.intercept('DELETE', '**/api/subscription-management/v1/subscriptions/*/subscriptionRoles/*').as('deleteRole');
}

export function interceptsCarrierAccountApiCalls() {
  cy.intercept('GET', '**/api/subscription-management/v1/subscriptions/*/carriers').as('getCarriers');
  cy.intercept('GET', '**/api/carrier-management/v1/subscriptions/*/users/*/subCarriers?*').as('getSubCarriers');
  cy.intercept('POST', '**/api/carrier-management/v1/subCarriers').as('addSubCarrier');
}

export function interceptsBusinessRuleset() {
  cy.intercept('POST', '**/api/submeta/v1/ruleSets').as('addBusinessruleSet');
  cy.intercept('DELETE', '**/api/submeta/v1/ruleSets').as('deleteRuleset');
}

export function interceptsCustomFields() {
  cy.intercept('POST', '**/api/submeta/v1/customfields').as('addCustomField');
  cy.intercept('DELETE', '**/api/submeta/v1/customfields/*').as('deleteCustomField');
}

export function interceptsNotifications() {
  cy.intercept('POST', '**/api/notificationsvc/v2/customNotificationConfigurations').as('addNotification');
  cy.intercept('DELETE', '**/api/notificationsvc/v1/*/*').as('deleteNotification');
  cy.intercept('GET', '**/api/notificationsvc/v2/manageCustomNotificationConfigurations?skip=0&limit=10&*').as('getNotifications');
  cy.intercept('PUT', '**/api/notificationsvc/v1/customNotificationConfigurations/inactivateHierarchy/*').as('inactiveNotifications');
  cy.intercept('GET', '**/api/submeta/v2/manageCustomfields?*').as('EditSystemNotifications');
}
