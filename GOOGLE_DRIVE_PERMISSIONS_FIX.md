# Fix Google Drive Permissions Error

If you're getting the error: "You do not have permission to call DriveApp.getFoldersByName", follow these steps:

## Step 1: Authorize the Script with Drive Permissions

1. Open your Google Sheet
2. Click **Tools** → **Script Editor**
3. In the Script Editor, click **Run** → **Run function** → Select any function (or just click the Run button)
4. You'll see an **Authorization Required** dialog
5. Click **Review Permissions**
6. Select your Google account
7. You'll see a warning that the app isn't verified - click **Advanced**
8. Click **Go to [Your Project Name] (unsafe)**
9. Click **Allow** to grant permissions

## Step 2: Grant Required Permissions

The script needs these permissions:
- ✅ **Google Sheets** (to write data)
- ✅ **Google Drive** (to upload payment screenshots)

## Step 3: Update the Script Manifest (if needed)

If authorization doesn't work, you may need to update the manifest:

1. In Script Editor, click the **View** menu → **Show manifest file**
2. A file called `appsscript.json` will appear
3. Make sure it includes the Drive scope:

```json
{
  "timeZone": "America/New_York",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file"
  ]
}
```

4. Save the file

## Step 4: Redeploy the Script

After authorizing:

1. Click **Deploy** → **Manage Deployments**
2. Click the **pencil icon** (Edit) next to your deployment
3. Click **New version**
4. Click **Deploy**

## Step 5: Test the Form

1. Submit a test form with a payment screenshot
2. Check your Google Sheet - the payment screenshot URL should appear in column O
3. Check your Google Drive - you should see a folder called "Royal Circle Payment Screenshots"

## Alternative Solution: Use Root Drive Folder

If you continue to have issues, the script will automatically try to save files to the root Drive folder instead of a subfolder. This requires fewer permissions.

## Troubleshooting

**Still getting permission errors?**
- Make sure you're logged into the correct Google account
- Try running the script manually once to trigger authorization
- Check that the script is deployed as "Execute as: Me (your email)"
- Verify "Who has access" is set to "Anyone"

**Files not appearing in Drive?**
- Check the "Royal Circle Payment Screenshots" folder in your Google Drive
- Or check the root of your Google Drive
- The file URL in the sheet should be clickable

---

**Need more help?** Check the Google Apps Script execution logs:
- Script Editor → View → Execution log

