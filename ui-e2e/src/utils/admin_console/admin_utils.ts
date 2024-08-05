///
import {Helpers} from "../../support/helpers";

/**
 * Delete the downloads folder to make sure the test has "clean"
 * slate before starting.
 */
export const deleteDownloadsFolder = () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('deleteFolder', downloadsFolder);
};

export const addReporterLog = (object?) => {
  Helpers.log(object);
  const addContext = require('mochawesome/addContext');
  Cypress.on('test:after:run', (test) => {
    addContext({ test }, object);
  });
};

// const path = require('path');
// const neatCSV = require('neat-csv');

// /**
//  * @param {string} csv
// */
// export const validateCsv = (csv) => {
//   cy.wrap(csv)
//   .then(neatCSV)
//   .then(validateCsvList)
// };

// export const validateCsvList = (list) => {
//   expect(list, 'number of records').to.have.length.greaterThan(1)
//   expect(list[0], 'first record').to.deep.equal({
//     City: 'Shelton'
//   })
// };
