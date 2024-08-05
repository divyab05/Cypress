export function supportInterceptApiCalls() {
  cy.intercept('POST', '**api/sending/v1/stamps/*/users/*/spoilage').as('spoilageApi');
  cy.intercept('GET', '**api/sending/v1/subscriptions/*/users/*/stamps?*').as('getStampTransaction');
  cy.intercept('GET', '**api/sending/v2/subscriptions/*/users/*/shipments?*').as('getLabelTransaction');
  cy.intercept('POST', '**api/err/v2/ErrTrackingNum/Barcode?*').as('errLabelApi');
  cy.intercept('POST', '**/api/subscription-management/v1/users').as('addSupportUser');
}

export function fraudAlertsApiCalls() {
  cy.intercept('PUT', '**api/fraud/v1/subscriptions/*/users/*/trust').as('editTrustScore');
}