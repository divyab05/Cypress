import { endpoint } from '../../fixtures/adminSupportPortal/adminSupportApi.json';
import { format } from 'util';
import { Helpers } from '../helpers';

export class SupportConsoleApi {
  private user;
  private sessionToken;
  private oktaToken;
  private clientId;
  private secret;
  private transactionID;
  private subCarrierID;

  constructor(user) {
    this.user = user;
    this.clientId = user.clientId;
    this.secret = user.secret;
  }

  private async printError(body, status) {
    if (status !== 200 && body.errors !== undefined) {
      await Helpers.log(body.errors[0].errorDescription);
    } else {
      await Helpers.log(status);
    }
  }

  public getBearerToken() {
    const requestData = `${this.clientId}:${this.secret}`;
    const buff = new Buffer(requestData);
    const decodedData = buff.toString('base64');
    return cy
      .request({
        method: 'POST',
        url: endpoint.env[Cypress.env('appEnv')].bearer,
        form: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${decodedData}`
        },
        body: {
          grant_type: 'client_credentials',
          scope: 'spa'
        }
      })
      .then((data) => {
        return data.body.access_token.toString();
      });
  }

  public getAdminBearerToken() {
    return this.getAdminSessionToken().then(_ => {
      this.getAdminOktaToken().then(_ => {
        this.findOktaToken();
      });
    });
  }

  public getAdminSessionToken() {
    const body = {
      username: this.user.userEmail,
      password: this.user.password
    };
    Helpers.log('getUserNAme -' + this.user.userEmail);
    return cy
      .request({
        method: 'POST',
        url: endpoint.env[Cypress.env('appEnv')]['origin'] + '/api/v1/authn',
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(async (data) => {
        await Helpers.log(`getAdminSessionToken ->${data.status}`);
        Helpers.log(`getAdminSessionToken ->${data.body.sessionToken}`);
        await this.printError(data.body, status);
        if (data.status === 200) {
          return this.sessionToken = data.body.sessionToken;
        }
      });
  }

  public getAdminOktaToken() {
    return cy
      .request({
        method: 'GET',
        url: format(endpoint.env[Cypress.env('appEnv')]['okta'], this.sessionToken),
        form: true,
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en',
          'content-type': 'application/json',
          'origin': endpoint.env[Cypress.env('appEnv')]['origin'],
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
          'x-okta-user-agent-extended': 'okta-signin-widget-5.0.2'
        },
      })
      .then(async (data) => {
        await Helpers.log(`getAdminOktaToken ->${data.status}`);
        await this.printError(data.body, status);
        if (data.status === 200) {
          return this.oktaToken = data.body;
        }
      });
  }

  private findOktaToken() {
    let finalOktaToken =
      this.oktaToken.substr(this.oktaToken.indexOf('ame="access_token" value="'), this.oktaToken.indexOf('value="Bearer"/>'));
    finalOktaToken = finalOktaToken.substr(26, finalOktaToken.indexOf('input'));
    finalOktaToken = finalOktaToken.substr(0, finalOktaToken.lastIndexOf(`"/>`));
    this.oktaToken = finalOktaToken;
  }

  public generateStampSheetNumber() {
    const chars = 'BCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 3; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    const num = Math.floor(Math.random() * (999 - 111 + 1) + 111);
    Helpers.log('Stamp sheet number - ' + result + num);
    return result + num;
  }

  public addStampSheet(stampSheetNo: any) {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.addStampSheet, stampSheetNo)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`,
          'Content-type': 'application/json'
        },

      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body.sheetNumber;
      });
    });
  }

  public deleteStampSheet(stampSheetNo: any) {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'DELETE',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.deleteStampSheet, stampSheetNo)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`,
          'Content-type': 'application/json'
        },

      }).then((data) => {
        expect(data.status).to.eq(204);
        return data.body.sheetNumber;
      });
    });
  }

  public createStamp(stampSheetNo: any) {
    return this.addStampSheet(stampSheetNo).then(stampSheetNo => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.createStamp)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`,
          'Content-type': 'application/json'
        },
        body:
          { "sheetNumber": stampSheetNo, "subCarrierId": this.subCarrierID, "type": "StampSheet", "stamps": [{ "fromAddress": { "postalCode": "75601", "countryCode": "US" }, "toAddress": { "postalCode": "75601", "countryCode": "US" }, "rate": { "carrier": "USPS", "subCarrierId": this.subCarrierID, "parcelType": "LTR", "rateTypeId": "METERED_RATE", "serviceId": "FCM", "totalCarrierCharge": 1.05, "baseCharge": 1.05, "deliveryCommitment": { "additionalDetails": "By end of Day", "estimatedDeliveryDateTime": "2022-08-04", "guarantee": "NONE", "maxEstimatedNumberOfDays": "2", "minEstimatedNumberOfDays": "2" }, "serviceName": "First-Class Mail®", "dimensionalWeight": { "unitOfMeasurement": "OZ" } }, "parcelWeight": { "unitOfMeasurement": "OZ", "weight": 2.5 }, "documents": [{ "type": "STAMP", "fileFormat": "GIF", "contentType": "URL" }], "stampOptions": [{ "name": "POSTAGE_CORRECTION", "value": "false" }, { "name": "GENERATE_SERIAL_NUMBER", "value": "false" }] }], "memo": "TestingStamp", "mailingDate": null, "printDate": false, "deviceHubData": { "peripheralId": "Use browser printer" } }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public createMultipleStamp(stampSheetNo: any) {
    return this.addStampSheet(stampSheetNo).then(stampSheetNo => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.createStamp)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`,
          'Content-type': 'application/json'
        },
        body:
          { "sheetNumber": stampSheetNo, "subCarrierId": this.subCarrierID, "type": "StampSheet", "stamps": [{ "fromAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "toAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "rate": { "carrier": "usps", "parcelType": "LTR", "parcelName": "Letter", "serviceId": "FCM", "serviceName": "First-Class Mail®", "totalCarrierCharge": 0.57, "baseCharge": 0.57 }, "parcelWeight": { "unitOfMeasurement": "OZ", "weight": 1 }, "documents": [{ "type": "STAMP", "fileFormat": "GIF", "contentType": "URL" }], "stampOptions": [{ "name": "POSTAGE_CORRECTION", "value": "false" }, { "name": "GENERATE_SERIAL_NUMBER", "value": "false" }] }, { "fromAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "toAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "rate": { "carrier": "usps", "parcelType": "LTR", "parcelName": "Letter", "serviceId": "FCM", "serviceName": "First-Class Mail®", "totalCarrierCharge": 0.57, "baseCharge": 0.57 }, "parcelWeight": { "unitOfMeasurement": "OZ", "weight": 1 }, "documents": [{ "type": "STAMP", "fileFormat": "GIF", "contentType": "URL" }], "stampOptions": [{ "name": "POSTAGE_CORRECTION", "value": "false" }, { "name": "GENERATE_SERIAL_NUMBER", "value": "false" }] }, { "fromAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "toAddress": { "postalCode": "95363-8348", "countryCode": "US" }, "rate": { "carrier": "usps", "parcelType": "LTR", "parcelName": "Letter", "serviceId": "FCM", "serviceName": "First-Class Mail®", "totalCarrierCharge": 0.57, "baseCharge": 0.57 }, "parcelWeight": { "unitOfMeasurement": "OZ", "weight": 1 }, "documents": [{ "type": "STAMP", "fileFormat": "GIF", "contentType": "URL" }], "stampOptions": [{ "name": "POSTAGE_CORRECTION", "value": "false" }, { "name": "GENERATE_SERIAL_NUMBER", "value": "false" }] }], "memo": null, "mailingDate": null, "printDate": false, "deviceHubData": { "peripheralId": "Use browser printer" } }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public stampStatus(stampSheetNo: any, stampType: any) {
    if (stampType.includes('single')) {
      this.createStamp(stampSheetNo).then((stampSheetResponse) => {
        Helpers.log(`stampSheetResponse: ${stampSheetResponse}`);
        return cy.request({
          method: 'GET',
          url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.stampStatus, stampSheetResponse)}`,
          failOnStatusCode: false,
          retryOnNetworkFailure: true,
          headers: {
            Authorization: `Bearer ${this.oktaToken}`
          }
        }).then(async ({ body, status }) => {
          expect(status).to.eq(200);
          await this.printError(body, status);
          return body;
        });
      });
    }
    else {
      this.createMultipleStamp(stampSheetNo).then((stampSheetRes) => {
        Helpers.log(`stampSheetResponse: ${stampSheetRes}`);
        return cy.request({
          method: 'GET',
          url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.stampStatus, stampSheetRes)}`,
          failOnStatusCode: false,
          retryOnNetworkFailure: true,
          headers: {
            Authorization: `Bearer ${this.oktaToken}`
          }
        }).then(async ({ body, status }) => {
          expect(status).to.eq(200);
          await this.printError(body, status);
          return body;
        });
      });
    }

  }

  public addPostageAPI(postageAmount: any) {
    // Helpers.log(`PostageValue: ${this.postageAmount}`);
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.addPostage)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
          { "purchaseAmount": { "amount": postageAmount, "currency": "USD" }, "ledgerID": "DAW60UWezRMTPswX" }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public createDomUSPSLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.labelUSPS)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
        {
          "dateOfShipment": "2022-06-23T00:00:00.000Z",
          "addToScanForm": true,
          "costAccountID": "6179",
          "costAccountName": "1234test",
          "mailClass": "PM",
          "mailClassName": "Priority Mail®",
          "totalPackageCharge": 9.68,
          "destinationPostalCodeOnlyShipping": false,
          "output": {
            "contentType": "URL",
            "labelSize": "DOC_8X11",
            "fileFormat": "PDF",
            "hidePostageAmount": false,
            "printReceipt": false
          },
          "packageDetails": {
            "packageDimension": {
              "height": 1,
              "length": 1,
              "uom": "IN",
              "width": 1,
              "irregularParcelGirth": 0
            },
            "packageType": "PKG",
            "packageWeight": {
              "uom": "OZ",
              "value": 1
            },
            "packageName": "My Box",
            "packageId": "PKG",
            "thickOrRigid": false
          },
          "recipientAddress": {
            "addressLine1": "41 Location Rd",
            "addressLine2": "",
            "city": "Parsons",
            "countryCode": "US",
            "company": "Company name PB",
            "postalCode": "26287-8905",
            "state": "WV",
            "phone": "2032408089",
            "residential": false,
            "isLab": false
          },
          "reference1": null,
          "reference2": null,
          "reference3": null,
          "reference4": null,
          "senderAddress": {
            "addressLine1": "320 Newbridge St",
            "addressLine2": "",
            "city": "Menlo Park",
            "countryCode": "US",
            "name": "customs",
            "company": "PB",
            "postalCode": "94025-1349",
            "state": "CA",
            "phone": "2032408089",
            "email": "abc@gmail.com",
            "residential": false,
            "contactId": "60beff7014e6de3d09d028ad"
          },
          "shipperReference": null,
          "shippingNotes": null,
          "subCarrierID": this.subCarrierID,
          "transportationReference": null,
          "isCheapestRateSelected": false,
          "printNotificationEmails": [
            "abc@gmail.com"
          ],
          "deliveryNotificationEmails": [
            "abc@gmail.com"
          ]
        }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return this.transactionID = data.body.id;
      });
    });
  }

  public createDomUPSLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.labelUPS)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
        {
          "addToScanForm": true,
          "dateOfShipment": "2022-06-29T00:00:00.000Z",
          "deliveryNotificationEmails": [
            "abc@gmail.com"
          ],
          "destinationPostalCodeOnlyShipping": null,
          "isCheapestRateSelected": false,
          "mailClass": "2DA",
          "mailClassName": "UPS 2nd Day Air®",
          "output": {
            "contentType": "URL",
            "fileFormat": "PDF",
            "hidePostageAmount": false,
            "labelSize": "DOC_8X11",
            "printReceipt": false
          },
          "packageDetails": {
            "packageDimension": {
              "height": 12,
              "irregularParcelGirth": 0,
              "length": 7,
              "uom": "IN",
              "width": 9
            },
            "packageId": "PKG",
            "packageName": "My Box",
            "packageType": "PKG",
            "packageWeight": {
              "uom": "OZ",
              "value": 18
            },
            "thickOrRigid": false
          },
          "printNotificationEmails": [
            "abc@gmail.com"
          ],
          "recipientAddress": {
            "addressLine1": "44 Nostalgia Ave",
            "addressLine2": "",
            "city": "Patterson",
            "company": null,
            "countryCode": "US",
            "email": "usermailing03@mailinator.com",
            "isLab": false,
            "name": "Ankita Gupta",
            "phone": null,
            "postalCode": "95363-8348",
            "residential": true,
            "state": "CA",
            "verificationStatus": "VALID"
          },
          "reference1": null,
          "reference2": null,
          "reference3": null,
          "reference4": null,
          "senderAddress": {
            "addressLine1": "37 Executive Dr",
            "addressLine2": "",
            "city": "Danbury",
            "company": "Pitney Bowes",
            "contactId": "62b3d07b52d46e21e5b2f296",
            "countryCode": "US",
            "email": "abc@gmail.com",
            "lastVerifiedDate": "2022-06-26T09:15:40.779Z",
            "name": "Shelton",
            "phone": "8770814452",
            "postalCode": "06810-4147",
            "residential": false,
            "state": "CT"
          },
          "shipperReference": null,
          "shippingNotes": "Shipping Memo",
          "subCarrierID": this.subCarrierID,
          "totalPackageCharge": 91.87,
          "transportationReference": null
        }

      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public createDomFedExLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.labelFedEx)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
          { "dateOfShipment": "2022-07-28T00:00:00.000Z", "addToScanForm": true, "mailClass": "2DA", "mailClassName": "FedEx 2Day®", "totalPackageCharge": 74.09, "destinationPostalCodeOnlyShipping": false, "output": { "contentType": "URL", "labelSize": "DOC_8X11", "fileFormat": "PDF", "hidePostageAmount": false, "printReceipt": false }, "packageDetails": { "packageDimension": { "height": 6, "length": 8, "uom": "IN", "width": 9, "irregularParcelGirth": 0 }, "packageType": "PKG", "packageWeight": { "uom": "OZ", "value": 50 }, "packageName": "My Box", "packageId": "PKG", "thickOrRigid": false }, "recipientAddress": { "addressLine1": "7219 Beach St", "addressLine2": "", "city": "Los Angeles", "countryCode": "US", "name": "Nikunja Kale", "company": "Pitney Bowes", "postalCode": "90001-2615", "state": "CA", "phone": "2032408089", "email": "user123@test.com", "residential": true, "verificationStatus": "VALID", "isLab": false, "isExam": false }, "reference1": null, "reference2": null, "reference3": null, "reference4": null, "senderAddress": { "addressLine1": "3411 Dead Timber Rd", "addressLine2": "", "city": "California", "countryCode": "US", "name": "Shelton", "company": "Pitney Bowes", "postalCode": "41007-9268", "state": "KY", "phone": "8770814452", "email": "abc@gmail.com", "residential": true, "contactId": "62be7b6252d46e21e5b2f8b4", "lastVerifiedDate": "2022-07-28T10:43:05.947Z" }, "shipperReference": null, "shippingNotes": null, "subCarrierID": this.subCarrierID, "transportationReference": null, "specialServices": [{ "name": "DIRECT_SIG", "fee": 5.9 }], "isCheapestRateSelected": false, "printNotificationEmails": ["abc@gmail.com", "user123@test.com"], "deliveryNotificationEmails": ["abc@gmail.com", "user123@test.com"] }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public refundUSPSLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'DELETE',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.labelUSPSRefund, this.transactionID)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return data.body;
      });
    });
  }

  public nonTrackableUSPSLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].sendingApiPrefix}${format(endpoint.labelUSPS)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
          { "dateOfShipment": "2022-08-01T00:00:00.000Z", "addToScanForm": true, "mailClass": "FCM", "mailClassName": "First-Class Mail®", "totalPackageCharge": 1.2, "destinationPostalCodeOnlyShipping": false, "output": { "contentType": "URL", "labelSize": "DOC_8X11", "fileFormat": "PDF", "hidePostageAmount": false, "printReceipt": false }, "packageDetails": { "packageType": "LGENV", "packageWeight": { "uom": "OZ", "value": 1 }, "packageName": "My Envelope", "packageId": "LGENV", "thickOrRigid": false }, "recipientAddress": { "addressLine1": "27 Waterview Dr", "addressLine2": "", "city": "Shelton", "countryCode": "US", "name": "Domestic 1", "company": "Pitney Bowes", "postalCode": "06484-4361", "state": "CT", "phone": "20320320333", "email": "sohail.admin1@yopmail.com", "residential": false, "isLab": false, "isExam": false, "lastVerifiedDate": "2022-08-01T09:54:43.548Z", "contactId": "62e755093db6de592332fcee" }, "reference1": null, "reference2": null, "reference3": null, "reference4": null, "senderAddress": { "addressLine1": "264 35th St, Fl 7", "addressLine2": "", "city": "New York", "countryCode": "US", "name": "William George", "company": "Pitney Bowes", "postalCode": "10001", "state": "NY", "phone": "8770814452", "email": "abc@gmail.com", "residential": true, "contactId": "62be7b6252d46e21e5b2f8b4", "lastVerifiedDate": "2022-07-28T10:54:24.552Z" }, "shipperReference": null, "shippingNotes": null, "subCarrierID": this.subCarrierID, "transportationReference": null, "isCheapestRateSelected": true, "printNotificationEmails": ["abc@gmail.com", "sohail.admin1@yopmail.com"], "deliveryNotificationEmails": ["abc@gmail.com", "sohail.admin1@yopmail.com"] }
      }).then((data) => {
        expect(data.status).to.eq(200);
        return this.transactionID = data.body.id;
      });
    });
  }

  public createERRLableAPI() {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].errApiPrefix}${format(endpoint.labelerr)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body:
          { "mailerID": "901762825", "errTrackingNumber": null, "transaction": { "carrierCode": "usps", "subCarrierID": "aznd72lX42b", "baseCharge": 0.57, "senderAddress": { "name": "Nikunja kale", "addressLine1": "33 Eastbrook Rd", "addressLine2": "", "city": "Ronks", "state": "PA", "postalCode": "17572-9769", "countryCode": "US", "phone": "2032408089", "email": "test111@gmail.com", "company": "SUPER DESIGN AND PRINTING" }, "recipientAddress": { "name": "William John", "addressLine1": "42 Fairhaven Commons Way", "addressLine2": "", "city": "Fairhaven", "state": "MA", "postalCode": "02719-4627", "countryCode": "US", "phone": "2032408089", "email": "abc@gmail.com", "company": "PB" }, "packageDetails": { "packageType": "LTR", "packageDimension": { "length": null, "width": null, "height": null, "irregularParcelGirth": 0 }, "packageWeight": { "uom": "OZ", "value": 1 } }, "specialServices": [{ "name": "ERR", "fee": 2 }, { "name": "Cert", "fee": 4 }], "totalPackageCharge": 6.57, "mailClass": "FCM", "reference1": null, "reference2": null, "reference3": null, "reference4": null, "shipperReference": null, "shippingNotes": null, "transportationReference": null, "mailClassName": "First-Class Mail®" }, "printNotificationEmails": ["test111@gmail.com", "Recipient:abc@gmail.com"], "size": "10", "showPostage": "Y" }
      }).then((data) => {
        expect(data.status).to.eq(201);
        return data.body;
      });
    });
  }

  public getSubCarrierId(carrierName: string) {
    return this.getAdminBearerToken().then(_ => {
      cy.request({
        method: 'GET',
        url: `${endpoint.env[Cypress.env('appEnv')].subcarrieractmgmt}${format(endpoint.subCarrier)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        let subCarriersArrayLength = (response.body.subCarriers).length;
        Helpers.log(`*******Length of SubCarriers Array==>${subCarriersArrayLength}`)

        for (let i = 0; i < subCarriersArrayLength; i++) {
          let subCarrierData: string = response.body.subCarriers[i].carrierID;
          let actualCarrierName = subCarrierData.toLowerCase();
          let expectedCarrierName = carrierName.toLowerCase();
          if (subCarrierData !== undefined && (actualCarrierName === expectedCarrierName)) {
            let subCarrierId = response.body.subCarriers[i].subCarrierID;
            this.subCarrierID = subCarrierId;
            Helpers.log(`*********subCarrierId of ${carrierName} is==>${subCarrierId}`)
            break;
          } else {
            Helpers.log(`*********No Carrier gets matched***********`)
          }
        }
      });
    });
  }





}
