import { endpoint } from '../../fixtures/adminPortal/adminApi.json';
import { format } from 'util';
import { Helpers } from '../helpers';
import { AdminTmp } from './adminTmp';
import { adminFormControls } from "../../fixtures/adminPortal/adminFormControls.json";
import { AdminCommands } from "../../support/adminPortal/adminCommands";
import * as url from "url";

const adminCommands = new AdminCommands();
export class AdminApi {
  private user;
  private sessionToken;
  private oktaToken;
  private clientId;
  private secret;
  private stampSheetNo;

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
        url: endpoint.env[Cypress.env('appEnv')]['sessionToken'],
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
          'origin': 'https://pitneybowes.oktapreview.com',
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
    cy.wrap(finalOktaToken).as('adminToken');
  }

  public getAllEnterprises() {
    Helpers.log(`getAllEnterprises`);
    Helpers.log(`url ======== ${endpoint.env[Cypress.env('appEnv')].apiPrefix}`)
    return this.getAdminBearerToken().then(_ => {
      return cy.request({
        method: 'GET',
        url: `${endpoint.env[Cypress.env('appEnv')].apiPrefix}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        }
      }).then(async ({ body, status }) => {
        Helpers.log(`getAllEnterprises -> ${status}`);
        await this.printError(body, status);
        if (status === 200) {
          return AdminTmp.enterprises = body;
        }
      });
    });
  }

  private findEnterpriseIDByName(enterpriseName: string) {
    Helpers.log(`findEnterpriseIDByName: ${enterpriseName}`);
    let enterpriseData;
    return this.getAllEnterprises().then(_ => {
      enterpriseData = AdminTmp.enterprises.find(enterprise => enterprise.name === enterpriseName);
      if (enterpriseData !== undefined) {
        AdminTmp.enterpriseId = enterpriseData.enterpriseID;
      }
    });
  }

  public deleteEnterprise(enterpriseId: string) {
    Helpers.log(`deleteEnterprise: ${enterpriseId}`);
    return cy.request({
      method: 'DELETE',
      url: `${endpoint.env[Cypress.env('appEnv')].deleteSSOPrefix}${format(endpoint.enterpriseId, enterpriseId)}`,
      failOnStatusCode: false,
      retryOnNetworkFailure: true,
      headers: {
        Authorization: `Bearer ${this.oktaToken}`
      }
    }).then(async ({ body, status }) => {
      Helpers.log(`deleteEnterprise -> ${status}`);
      await this.printError(body, status);
      return body;
    });
  }

  public findAndDeleteEnterprise(enterpriseName: string) {
    Helpers.log(`findAndDeleteEnterprise: ${enterpriseName}`);
    this.findEnterpriseIDByName(enterpriseName)
      .then(_ => {
        this.deleteEnterprise(AdminTmp.enterpriseId);
      });
  }

  public createEnterprise(enterpriseName: string, enterpriseId: string) {
    Helpers.log(`createEnterprise: ${enterpriseName}`);
    return this.getAdminBearerToken().then(_ => {
      return cy.request({
        method: 'POST',
        url: `${endpoint.env[Cypress.env('appEnv')].apiPrefix}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body: {
          enterpriseID: enterpriseId,
          name: enterpriseName
        }
      }).then(async ({ body, status }) => {
        Helpers.log(`createEnterprise -> ${status}`);
        await this.printError(body, status);
        return body;
      });
    });
  }

  public deleteDivisionViaAPI(divisionID: string) {
    Helpers.log(`deleteDivision`);
    const url = `${endpoint.env[Cypress.env('appEnv')].clientManagement}${format(endpoint.deleteDivision, divisionID)}`;
    Helpers.log(`url ======== ${url} ========`);
    this.getAdminBearerToken();
    return cy.get('@adminToken').then(token => {
      cy.getCookie(
        "XSRF-TOKEN"
      ).then((xsrdToken) => {
        return cy.request({
          method: 'DELETE',
          url: url,
          failOnStatusCode: false,
          retryOnNetworkFailure: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "X-XSRF-TOKEN":xsrdToken.value
          }
        }).then(async ({ body, status }) => {
          Helpers.log(`deleteDivision -> ${status}`);
          expect(status).to.eq(200);
          await this.printError(body, status);
        });
      });
    });
  }

  public locationsExport(enterpriseName: string) {
    this.getAdminBearerToken();
    adminCommands.getSubscriptionId(enterpriseName).then(() => {
      cy.get('@subscriptionId').then(subscriptionId => {
        const url = `${endpoint.env[Cypress.env('appEnv')].clientManagement}${format(endpoint.subscriptions, subscriptionId)}/location/export?locale=en-US`;
        cy.window().document().then(function (doc) {
          doc.addEventListener('click', () => {
            setTimeout(function () {
              doc.location.reload()
            }, 5000)
          })
          cy.get(adminFormControls.buttons.locationExportBtn).should('be.visible').click();
          return cy.get('@adminToken').then(token => {
            cy.getCookie(
              "XSRF-TOKEN"
            ).then((xsrdToken) => {
              cy.wait('@fieldList').then((response) => {
                return cy.request({
                  method: 'POST',
                  url: url,
                  body: response,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "X-XSRF-TOKEN": xsrdToken.value
                  }
                }).then((responsee) => {
                  cy.wrap(responsee.body.jobId).as('jobId');
                });
              });
            })
          });
        });
      });
    });
    cy.wait(3000);
  }



  public deleteAdminUser(userId: string) {
    Helpers.log("Deleting the created Admin user via api")
    cy.request('DELETE', 'api/subscription-management/v1/subscriptions/users/' + userId).then(async (response) => {
      expect(response.status).to.eq(200);
    });

  }

  public deactivateAdminUser(groupId: string, userId: string, enterpriseId: string, name: string, lastName: string, email: string) {
    Helpers.log(`deactivateAdminUser: ${userId}`);
    return this.getAdminBearerToken().then(_ => {
      return cy.request({
        method: 'PUT',
        url: `${endpoint.env[Cypress.env('appEnv')].addrBookApiPrefix}${format(endpoint.usersPbAdmin, userId)}`,
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
          Authorization: `Bearer ${this.oktaToken}`
        },
        body: {
          active: false,
          adminLevelAt: "E",
          adminLevelEntity: [enterpriseId],
          analyticsRollupBy: "E",
          groupsIds: [groupId],
          id: userId,
          profile: {
            displayName: `${name} ${lastName}`,
            email: email,
            firstName: name,
            lastName: lastName
          }
        }
      }).then(async ({ body, status }) => {
        Helpers.log(`deleteAdminUser -> ${status}`);
        await this.printError(body, status);
        return body;
      });
    });
  }

  public callDeleteApiForEnterprise(enterpriseName: string) {
    this.getEnterpriseID(enterpriseName).then((enterprisedate) => {
      cy.get('@enterpriseId').then(enterpriseId => {
        Helpers.log(`*******************Enterprise id is==>${enterpriseId.toString}`);
        const url = `${endpoint.env[Cypress.env('appEnv')].apiPrefix}${format(endpoint.enterpriseId, enterpriseId)}`;
        this.getAdminBearerToken();
        return cy.get('@adminToken').then(token => {
          cy.getCookie(
            "XSRF-TOKEN"
          ).then((xsrdToken) => {
            return cy.request({
              method: 'DELETE',
              url: url,
              failOnStatusCode: false,
              retryOnNetworkFailure: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "X-XSRF-TOKEN": xsrdToken.value
              }
            }).then(async ({ body, status }) => {
              Helpers.log(`delete Enterprise -> ${status}`);
              expect(status).to.eq(200);
              await this.printError(body, status);
            });
            })
          });
        });
      });
  }

  public verifyDeleteUser_ClientSetup(userID, enterpriseName: string) {
      Helpers.log(`User id is ${userID}`);
      this.callDeleteApi_ClientUser(userID.toString(), enterpriseName);
    };




  public callDeleteApi_ClientUser(userId: string, enterpriseName: string) {
    return adminCommands.getSubscriptionId(enterpriseName).then((enterprisedate) => {
      cy.get('@subscriptionId').then(subscriptionId => {
        Helpers.log(`SubscriptionID: ${subscriptionId}`);
        Helpers.log(`UserID: ${userId}`);
        //const url = `${endpoint.env[Cypress.env('appEnv')].addrBookApiPrefix}${format(endpoint.subscriptions, subscriptionId)}/users/${userId}`;
        const url = `${endpoint.env[Cypress.env('appEnv')].addrBookApiPrefix}${format(endpoint.subscriptionsUserId, subscriptionId)}/users/${userId}`;
        this.getAdminBearerToken();
        return cy.get('@adminToken').then(token => {
          cy.getCookie(
            "XSRF-TOKEN"
          ).then((xsrdToken) => {
            return cy.request({
              method: 'DELETE',
              url: url,
              failOnStatusCode: false,
              retryOnNetworkFailure: true,
              headers: {
                Authorization: `Bearer ${token}`,
                "X-XSRF-TOKEN": xsrdToken.value
              }
            }).then(async ({body, status}) => {
              expect(status).to.eq(200);
            });
          });
        });
      });
     });
    }

  public getEnterpriseID(enterpriseName: string) {
    let enterpriseData;
    return cy.request('GET', '/api/client-management/v1/enterprises').then(async (response) => {
      enterpriseData = response.body.find(enterprise => enterprise.name === enterpriseName);
      if (enterpriseData !== undefined) {
        AdminTmp.enterpriseId = enterpriseData.enterpriseID;
        cy.wrap(enterpriseData.enterpriseID).as('enterpriseId');
        Helpers.log(`*******************Enterprise id is==>${AdminTmp.enterpriseId}`)
      }
      expect(response.status).to.eq(200);
    });
  }

  public getInvitedSSOUserID() {
    let ssoUserData;
    return cy.request('GET', '/api/subscription-management/v1/adminusermappings?skip=0&limit=100').then(async (response) => {
      Helpers.log(`*******************Get response of SSO User is==>${JSON.stringify(response.body)}`);
      const res = JSON.parse(JSON.stringify(response.body));
      ssoUserData = res.find(result => result.status === 'INVITED');
      if (ssoUserData !== undefined) {
        AdminTmp.SSOInvitedUserId = ssoUserData.userID;
        Helpers.log(`*******************SSO User Id is==>${AdminTmp.SSOInvitedUserId}`)
      }
    });
  }

  public callDeleteApi_SSOInvitedUser(ssoEmailId?: string) {
    this.getAdminBearerToken().then(_ => {
      cy.getCookie("XSRF-TOKEN").then((xsrfToken) => {
        this.getInvitedSSOUserID().then((SSOInvitedUserId) => {
          cy.request({
            method: 'DELETE',
            url: `${endpoint.env[Cypress.env('appEnv')].deleteSSOPrefix}${format(endpoint.ssoUserId, "pb.com_" + ssoEmailId)}`,
            //url: `${endpoint.env[Cypress.env('appEnv')].deleteSSOPrefix}${format(endpoint.ssoUserId, AdminTmp.SSOInvitedUserId)}`,
            failOnStatusCode: false,
            retryOnNetworkFailure: true,
            headers: {
              Authorization: `Bearer ${this.oktaToken}`,
              'Content-type': 'application/json',
              "X-XSRF-TOKEN": xsrfToken.value
            }
          }).then(async ({ body, status }) => {
            Helpers.log(`Status is -> ${status}`);
            return body;
          });
        });
      });
    });
  }

}
