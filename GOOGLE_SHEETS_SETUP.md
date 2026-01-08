# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it "Royal Circle Community Responses"
4. In the first row, add these column headers:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Contact`
   - D1: `Locality`
   - E1: `From Jaipur`
   - F1: `Heritage Connection`
   - G1: `Projects`
   - H1: `Areas of Expertise`
   - I1: `Address`
   - J1: `Location`
   - K1: `Latitude`
   - L1: `Longitude`
   - M1: `Profession`
   - N1: `Instagram Handle`
   - O1: `Payment Screenshot URL`

## Step 2: Update Existing Sheet (If You Already Have One)

**Skip this step if you're creating a new sheet.**

If you already have a Google Sheet set up with the old columns, you need to update the columns:

1. Open your existing Google Sheet
2. Update column headers in row 1 to match the original order:
   - A1: `Timestamp`
   - B1: `Name`
   - C1: `Contact`
   - D1: `Locality`
   - E1: `From Jaipur`
   - F1: `Heritage Connection`
   - G1: `Projects`
   - H1: `Areas of Expertise`
   - I1: `Address`
   - J1: `Location`
   - K1: `Latitude`
   - L1: `Longitude`
   - M1: `Profession`
   - N1: `Instagram Handle`
   - O1: `Payment Screenshot URL` (NEW - add this column)
3. Continue to Step 3 to update your Google Apps Script code

## Step 3: Create/Update Google Apps Script

1. In your Google Sheet, click **Tools** → **Script Editor**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Handle file upload if payment screenshot is provided
    let paymentScreenshotUrl = '';
    if (data.paymentScreenshot && data.paymentScreenshotName) {
      try {
        // Convert base64 to blob
        const base64Data = data.paymentScreenshot.split(',')[1] || data.paymentScreenshot;
        const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), data.paymentScreenshotType || 'image/png', data.paymentScreenshotName);
        
        // Create folder for payment screenshots if it doesn't exist
        const folderName = 'Royal Circle Payment Screenshots';
        let folder;
        const folders = DriveApp.getFoldersByName(folderName);
        if (folders.hasNext()) {
          folder = folders.next();
        } else {
          folder = DriveApp.createFolder(folderName);
        }
        
        // Upload file to Google Drive
        const file = folder.createFile(blob);
        
        // Set file permissions to "Anyone with the link can view"
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        // Get file URL
        paymentScreenshotUrl = file.getUrl();
      } catch(fileError) {
        console.error('File upload error:', fileError);
        paymentScreenshotUrl = 'Error uploading file: ' + fileError.toString();
      }
    }
    
    // Add data to the sheet (original column order)
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.contact || '',
      data.locality || '',
      data.fromJaipur || '',
      data.royalCircle,
      data.projects,
      data.interests,
      data.address || '',
      data.location || '',
      data.latitude || '',
      data.longitude || '',
      data.profession || '',
      data.instagram || '',
      paymentScreenshotUrl
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', error: e.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 4.5: Authorize Drive Permissions (IMPORTANT!)

**⚠️ CRITICAL:** Before deploying, you must authorize the script to access Google Drive for file uploads.

1. In the Script Editor, click **Run** → **Run function** → Select `doPost` (or just click the Run button)
2. You'll see an **Authorization Required** dialog
3. Click **Review Permissions**
4. Select your Google account
5. You'll see a warning - click **Advanced**
6. Click **Go to [Your Project Name] (unsafe)**
7. Click **Allow** to grant Drive permissions

**Required Permissions:**
- ✅ Google Sheets (to write data)
- ✅ Google Drive (to upload payment screenshots)

**Note:** If you skip this step, you'll get a "permission denied" error when users upload payment screenshots.

## Step 5: Deploy as Web App

**⚠️ CRITICAL: You MUST redeploy after updating the script code, otherwise changes won't take effect!**

1. Click **Deploy** → **Manage Deployments** (if you have an existing deployment)
2. Click the **pencil icon** (Edit) next to your deployment
3. Click **New version** (this creates a new version with your updated code)
4. Click **Deploy**
5. Copy the deployment URL

**OR** if creating a new deployment:

1. Click **Deploy** → **New Deployment**
2. Select type: **Web app**
3. Execute as: (Your email)
4. Who has access: **Anyone** (this is required!)
5. Click **Deploy**
6. Copy the deployment URL (looks like: `https://script.google.com/macros/s/SCRIPT_ID/exec`)

**Important Notes:**
- If updating an existing deployment, you MUST create a "New version" - just clicking Deploy won't update it
- The deployment must be set to "Anyone" for the form to work
- After redeploying, wait 1-2 minutes for changes to propagate

## Step 6: Update Your Form

1. Open your `index.html` or `community-form.html`
2. Find this line in the JavaScript:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercopy';
   ```
3. Replace `YOUR_SCRIPT_ID` with your actual Script ID from Step 4

## Step 7: Test the Form

1. Open your form in a browser
2. Fill out all fields
3. Click "Join the Circle"
4. Check your Google Sheet - the data should appear!

## Viewing Responses

Every form submission will automatically add a row to your Google Sheet. You can:
- View all responses in real-time
- Sort and filter data
- Create charts and graphs
- Export data as CSV/Excel

## Troubleshooting

**Data not appearing?**
- Make sure you deployed the script as "Anyone"
- Check browser console for errors (F12)
- Verify the Script URL is correct

**Script not working?**
- Make sure sheet column headers match exactly
- Check the Apps Script error logs

---

**Need help?** Contact your form administrator.
