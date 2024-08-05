const gmail = require("./gmailClient.js");
const fs = require("fs");
const { google } = require("googleapis");
const util = require("util");

function _get_header(name, headers) {
  const found = headers.find((h) => h.name === name);
  return found && found.value;
}

function _init_query(options) {
  const { to, from, subject, before, after } = options;
  let query = "";
  if (to) {
    query += `to:"${to}" `;
  }
  if (from) {
    query += `from:"${from}" `;
  }
  if (subject) {
    query += `subject:(${subject}) `;
  }
  if (after) {
    const after_epoch = Math.round(new Date(after).getTime() / 1000);
    query += `after:${after_epoch} `;
  }
  if (before) {
    const before_epoch = Math.round(new Date(before).getTime() / 1000);
    query += `before:${before_epoch} `;
  }
  query = query.trim();
  return query;
}

async function _get_recent_email(credentials_json, token_path, options = {}) {
  console.log("_get_recent_email");

  const emails = [];

  const query = _init_query(options);
  // Load client secrets from a local file.
  const content = fs.readFileSync(credentials_json);
  const oAuth2Client = await gmail.authorize(JSON.parse(content), token_path);
  const gmail_client = google.gmail({ version: "v1", oAuth2Client });
  const gmail_emails = await gmail.get_recent_email(
    gmail_client,
    oAuth2Client,
    query
  );
  for (const gmail_email of gmail_emails) {
    const email = {
      from: _get_header("From", gmail_email.payload.headers),
      subject: _get_header("Subject", gmail_email.payload.headers),
      receiver: _get_header("Delivered-To", gmail_email.payload.headers),
      threadId: gmail_email.threadId,
      snippet: gmail_email.snippet,
      date: new Date(+gmail_email["internalDate"]),
    };
    if (options.include_body) {
      let email_body = {
        html: "",
        text: "",
      };
      const { body } = gmail_email.payload;
      if (body.size) {
        switch (gmail_email.payload.mimeType) {
          case "text/html":
            email_body.html = Buffer.from(body.data, "base64").toString("utf8");
            break;
          case "text/plain":
          default:
            email_body.text = Buffer.from(body.data, "base64").toString("utf8");
            break;
        }
      }
      email.body = email_body;
    }
    emails.push(email);
  }
  // console.log("Emails: " + emails);
  return emails;
}

async function get_all_emails(credentials_json, token_path, options = {}) {
  const query = _init_query(options);
  const content = fs.readFileSync(credentials_json);
  const oAuth2Client = await gmail.authorize(JSON.parse(content), token_path);
  const gmail_client = google.gmail({ version: "v1", oAuth2Client });
  const gmail_emails = await gmail.get_recent_email(
    gmail_client,
    oAuth2Client,
    query
  );
  return gmail_emails;
}

async function login(credentials_json, token_path, options = {}) {
  const query = _init_query(options);
  const content = fs.readFileSync(credentials_json);
  const oAuth2Client = await gmail.authorize(JSON.parse(content), token_path);
  const gmail_client = google.gmail({ version: "v1", oAuth2Client });
  return gmail_client;
}

async function check_inbox(
  credentials_json,
  token_path,
  subject,
  from,
  to,
  wait_time_sec = 10,
  max_wait_time_sec = 60 * 5,
  options = {}
) {
  try {
    console.log(
      `[gmail] Checking for message from '${from}', to: ${to}, contains '${subject}' in subject...`
    );
    // Load client secrets from a local file.
    let found_email = null;
    let done_waiting_time = 0;
    do {
      const emails = await _get_recent_email(
        credentials_json,
        token_path,
        options
      );
      for (let email of emails) {
        if (
          email.receiver === to &&
          email.subject.indexOf(subject) >= 0 &&
          email.from.indexOf(from) >= 0
        ) {
          console.log(`[gmail] Found!`);
          found_email = email;
          break;
        }
      }
      if (!found_email) {
        console.log(
          `[gmail] Message not found. Waiting ${wait_time_sec} seconds...`
        );
        done_waiting_time += wait_time_sec;
        if (done_waiting_time >= max_wait_time_sec) {
          console.log("[gmail] Maximum waiting time exceeded!");
          break;
        }
        await util.promisify(setTimeout)(wait_time_sec * 1000);
      }
    } while (!found_email);
    return found_email;
  } catch (err) {
    console.log("[gmail] Error:", err);
  }
}

async function checkGoogleEmailWithMessage(
  credentials_json,
  token_path,
  subject,
  message,
  from,
  to,
  after,
  wait_time_sec = 5,
  howManyReTries = 10,
  options
) {
  try {
    console.log(
      `[gmail] Checking for message from '${from}', to: ${to}, contains '${subject}' in subject...`
    );

    let found_email = null;
    let loop= 0;
    do {
      loop++;
      const emails = await _get_recent_email(
        credentials_json,
        token_path,
        options
      );
      for (let email of emails) {
        if (
          email.receiver === to &&
          email.subject.toLowerCase() === subject.toLowerCase() &&
          // email.from.indexOf(from) >= 0 &&
          email.snippet.toLowerCase().indexOf(message.toLowerCase()) >= 0 &&
          Math.round((email.date).getTime() / 1000) > Math.round(new Date(after).getTime() / 1000)
        ) {
          console.log("\x1b[32mEmail subject: " +  email.subject + "\x1b[0m");
          console.log("\x1b[32mEmail snippet: " +  email.snippet + "\x1b[0m");
          console.log("\x1b[32mEmail date: " + email.date.toUTCString() + " > Expected after date: " + new Date(after).toUTCString() + "\x1b[0m");
          console.log(`\x1b[32m[gmail] Loop[${loop}/${howManyReTries}] Message found!\x1b[0m`);
          found_email = email;
          break;
        } else { //TODO: We dont want to log for each wrong email in the Box
          // console.log("\x1b[31mEmail subject: " +  email.subject + "\x1b[0m");
          // console.log("\x1b[31mEmail snippet: " +  email.snippet + "\x1b[0m");
          // console.log("\x1b[31mEmail date: " + email.date.toUTCString() + " > Expected after date: " + new Date(after).toUTCString() + "\x1b[0m");
        }
      }
      if(!found_email) {
        if (howManyReTries === loop ) {
          console.log(`\x1b[31m[gmail] Loop[${loop}/${howManyReTries}] Mail not found! Maximum waiting time exceeded!\x1b[0m`);
        } else {
          console.log(`\x1b[31m[gmail] Loop[${loop}/${howManyReTries}] Message not found. Waiting ${wait_time_sec} seconds...\x1b[0m`);
          await util.promisify(setTimeout)(wait_time_sec * 1000);
        }
      }
    } while (!found_email && howManyReTries !== loop );
    return found_email;
  } catch (err) {
    console.log("[gmail] Error:", err);
  }
}

/**
 * Get an array of messages
 *
 * @param {string} credentials_json - Path to credentials json file.
 * @param {string} token_path - Path to token json file.
 * @param {Object} options
 * @param {boolean} options.include_body - Return message body string.
 */
async function get_messages(credentials_json, token_path, options) {
  console.log("get_messages");
  try {
    const emails = await _get_recent_email(
      credentials_json,
      token_path,
      options
    );
    console.log("Emails: ", emails);
    return emails;
  } catch (err) {
    console.log("[gmail] Error:", err);
  }
}

module.exports = {
  check_inbox,
  get_messages,
  get_all_emails,
  checkGoogleEmailWithMessage,
  login,
};
