interface AppUser {
  username: string;
  password: string;
  clientId: string;
  secret: string;
}

interface AppUsers {
  standardUser: AppUser;
  lockersStandardUser: AppUser;
  sstoUser: AppUser;
  postageUser: AppUser;
  analyticsuser: AppUser;
  clientAdminUser: AppUser;
  enterpriseAdminUser: AppUser;
  clientAdminUser1: AppUser;
  divisionAdminUser: AppUser;
  enterpriseAdminUser_UserPersona: AppUser;
  divisionAdminUser_UserPersona: AppUser;
  locationAdminUser: AppUser;
  locationAdminUse_UserPersona: AppUser;
  divisionNotificationUser: AppUser;
  noTrackingPlanUser: AppUser;
  canadaUser: AppUser;
  locationNotificationUser: AppUser;
  ssoClientUser: AppUser;
  pitneyshipEnterpriseUser: AppUser;
  allPlanUser: AppUser;
  almCAUser: AppUser;
  ssoClientUser01: AppUser;
  ssoClientUser02: AppUser;
}

declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    navigateToHomePage(): void;
    login(username: string, password: string): void;
    getUsers(): Chainable<AppUsers>;
    getSSTOUsers(): any;
    getByInputPlaceHolder(selector: string): Chainable<string>;
    forceClick(): any;
    getElements(query: String, options?: any): any;
    waitForSpinners(): any;
    findChildElement(query: String): any;
    isElementPresent(query: String): any;
    isElementVisible(query: String): any;
    isElementHidden(query: String): any;
    isElementDisabled(query: String): any;
    isElementEnabled(query: String): any;
    addAddress(address): void;
    addAddressInt(address1): void;
    addSenderAddress(address): void;
    addPackaging(data): void;
    addPostage(amt: number): void;
    costAccount(data): void;
    customForm(data): void;
    selectMailService(data): void;
    selectExtraServices(extras, svcSelector): void;
    verifyShipmentSummary(data): void;
    printLabel(): void;
    printShipRequest(data): void;
    printStamps(): void;
    printSampleStamps(): void;
    logout(): void;
    navigateToManageShipRequests(): void;
    searchShipRequest(): void;
    verifyShipRequest(data): void;
    addContact(contact: any): Chainable<string>;
    searchContact(contact: any): void;
    updateContact(contact: any): void;
    deleteContact(contact: any): void;
    navigateToAddressBook(): void;
    importAddressBook(filePath: string, replace?: boolean): void;
    verifyAddressBookImport(): void;
    exportAddressBook(): void;
    verifyAddressBookExport(): void;
    getUsers(): any;
    addCostAccount(costAccount: any): void;
    searchCostAccount(costAccount: any): void;
    updateCostAccount(costAccount: any): void;
    deleteCostAccount(costAccount: any): void;
    navigateToCertifiedMailPage(): void;
    addPackagingEcertifiedFCM(data): void;
    addPackagingEcertifiedPM(data): void;
    verifyShipmentDetailsonHistoryPage_Int(data, address1: any): void;
    verifyShipmentDetailsonHistoryPage(data, address: any): void;
    navigateToStampRollsPage(): void;
    navigateToERRPage(): void;
    addPackagingERRFCM(data): void;
    printLabelERR_FCM(): void;
    printLabelCertifiedPage(): void;
    searchHistory_POD(): void;
    reprintERRLabel_AfterPrintflow(data): void;
    navigateToPODPage(): void;
    verifyShipmentDetails_ERR(data): void;
    afterPrintFlow_printLabel(data): void;
    validateSettings(data): void;
    allowedPurchaseSupplies(): void;
    allowedDownloadDeviceHub(): void;
    /**
     *
     * This function is used to Navigate to Settings >> Admin Options
     */
    navigateToAdminOptionsSettings(data): void;
    createShippingLabel(address): void;
    navigateToLabelOptionsSettings(data): void;
    verifyMaximumTransactionLimit(address): void;
  }
}
