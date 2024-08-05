export class GmailCheckers {
  public checkEmailAndValidate(from, to, subject, afterDate, snippetText) {
    cy.task("gmail:get_messages", {
      from: from,
      to: to,
      subject: subject,
      text: snippetText,
      after: afterDate,
    }).then((email: any) => {
      if(email===null) return false
      expect(email.snippet).to.contain(snippetText)
    });
  }
}
