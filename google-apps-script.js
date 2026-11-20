/**
 * ====================================================================
 * WEDDING RSVP GOOGLE APPS SCRIPT WEBHOOK
 * Dilsha & Chathuka Wedding Celebration
 * ====================================================================
 * 
 * INSTRUCTIONS TO DEPLOY:
 * 1. Open Google Sheets (https://sheets.new) and name it "Dilsha & Chathuka Wedding RSVPs".
 * 2. In the top menu, click: Extensions > Apps Script.
 * 3. Delete any code in Code.gs and replace it with this entire script.
 * 4. (Optional) Set NOTIFY_EMAIL to your email below if you want instant email alerts.
 * 5. Click the blue "Deploy" button at the top right > "New deployment".
 * 6. Click the gear icon (Select type) > Choose "Web app".
 * 7. Set:
 *    - Description: "RSVP Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"   <--- VERY IMPORTANT!
 * 8. Click "Deploy". Authorize permissions when prompted by Google.
 * 9. Copy the generated "Web app URL" (ends with /exec).
 * 10. Paste this URL into `src/config.js` in your project:
 *     GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycb.../exec"
 * ====================================================================
 */

// Set to your email address (or leave empty to notify the Google account owner)
var NOTIFY_EMAIL = ""; // e.g. "yourname@gmail.com"

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent writes
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Parse incoming JSON data
    var rawData = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(rawData);

    // Initialize Header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Submitted At (SL Time)",
        "Guest Name",
        "Attendance",
        "Number of Guests",
        "Phone Number",
        "Email Address",
        "Dietary Preference",
        "Alcohol Preference",
        "Message for the Couple"
      ];
      sheet.appendRow(headers);
      
      // Style Header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#37432B"); // Dark Olive Green theme
      headerRange.setFontColor("#FFFFFF");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Format local time in Sri Lanka
    var nowFormatted = Utilities.formatDate(
      new Date(),
      "Asia/Colombo",
      "yyyy-MM-dd HH:mm:ss"
    );

    var attendanceText = (data.attendance === "yes") ? "✨ Joyfully Attending" : "💌 Regretfully Declining";
    var guestCount = (data.attendance === "yes") ? (Number(data.guests) || 1) : 0;

    // Append new RSVP row
    sheet.appendRow([
      nowFormatted,
      data.name || "",
      attendanceText,
      guestCount,
      data.phone || "",
      data.email || "",
      data.dietary || "",
      (data.alcohol === "yes") ? "Yes" : "No",
      data.message || ""
    ]);

    // Send instant email notification to the couple
    var recipient = NOTIFY_EMAIL || Session.getActiveUser().getEmail();
    if (recipient) {
      sendEmailAlert(recipient, data, attendanceText, guestCount, ss.getUrl());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "RSVP recorded successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function sendEmailAlert(email, data, attendanceText, guestCount, sheetUrl) {
  var subject = (data.attendance === "yes" ? "💍 New RSVP: " : "💌 RSVP Decline: ") + data.name + " (" + attendanceText + ")";
  
  var body = 
    "You have received a new RSVP on your wedding website!\n\n" +
    "--------------------------------------------------\n" +
    "Guest Name: " + (data.name || "N/A") + "\n" +
    "Status: " + attendanceText + "\n" +
    "Number of Guests: " + guestCount + "\n" +
    "Contact Phone: " + (data.phone || "N/A") + "\n" +
    "Email Address: " + (data.email || "N/A") + "\n" +
    "Dietary Preference: " + (data.dietary || "Standard") + "\n" +
    "Alcohol Preference: " + ((data.alcohol === "yes") ? "Yes" : "No") + "\n" +
    "--------------------------------------------------\n" +
    "Message for Dilsha & Chathuka:\n" +
    (data.message ? '"' + data.message + '"' : "No message provided") + "\n\n" +
    "--------------------------------------------------\n" +
    "View full guest list spreadsheet:\n" + sheetUrl;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body
    });
  } catch (e) {
    Logger.log("Email notification error: " + e.toString());
  }
}

// Browser test endpoint
function doGet(e) {
  return ContentService
    .createTextOutput("Dilsha & Chathuka Wedding RSVP Webhook is Active!")
    .setMimeType(ContentService.MimeType.TEXT);
}
