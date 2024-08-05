///<reference types="cypress" />

describe.skip('Test Suite - Encrypt/Decrypt the Test Data', () => {

    //Make sure No changes should make in this Spec file and pushed into our repository.
    //If you want to encrypt the text, you can put the data and Run in local.Make sure those changes are not pushed.
    it('Encrypt the given text', () => {
        const text = "abc@gmail.com"; //put the text that you wanted to Encrypt
        cy.encrypt(text).then((cipherText) => {
            cy.log("Text Provided : " + text);
            cy.log("Text after encryption : " + cipherText)
            cy.decrypt(cipherText).then((originalText) => {
                cy.log("Encrypted Text : " + cipherText)
                cy.log("Original Text is " + originalText);
                expect(originalText).to.equal(text);
            });
        })
    })

    it('Decrypt the given Text', () => {
        const cipherText = "qwerty"; //put the encrypted data here to decrypt the data
        cy.decrypt(cipherText).then((originalText) => {
            cy.log("Encrypted Text : " + cipherText)
            cy.log("Original Text is " + originalText);
        });
    })
});
