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
        
        // Get or create folder for payment screenshots
        const folderName = 'Royal Circle Payment Screenshots';
        let folder;
        
        try {
          // Try to find existing folder
          const folders = DriveApp.getFoldersByName(folderName);
          if (folders.hasNext()) {
            folder = folders.next();
          } else {
            // Create new folder if it doesn't exist
            folder = DriveApp.createFolder(folderName);
          }
          
          // Upload file to Google Drive
          const file = folder.createFile(blob);
          
          // Set file permissions to "Anyone with the link can view"
          file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          // Get file URL
          paymentScreenshotUrl = file.getUrl();
        } catch(driveError) {
          // If Drive access fails, try saving to the root Drive folder
          try {
            const file = DriveApp.createFile(blob);
            file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            paymentScreenshotUrl = file.getUrl();
          } catch(rootError) {
            // If that also fails, store error message
            paymentScreenshotUrl = 'Drive access error - please authorize script with Drive permissions';
            console.error('Drive error:', rootError);
          }
        }
      } catch(fileError) {
        console.error('File upload error:', fileError);
        paymentScreenshotUrl = 'Error: ' + fileError.toString();
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

