function logTheSubject(label) {
  var subjects = []
  var threads = label.getThreads(0, 30)
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages()

    for (var i = 0; i < messages.length; i++) {
      subjects.push(messages[i])
    }
  }
  return subjects
}


function processEmails() {

  // Create a selection input to choose a sheet
  var selectionInput = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle('Select a sheet')
    .setFieldName('selectedSheet')
    .setOnChangeAction(CardService.newAction()
      .setFunctionName('updateSheet'))
    .addItem('Map It', 'Map It'); // Add "Map It" as a default sheet

  // Log the subject lines of the threads labeled with MyLabel
  var label = GmailApp.getUserLabelByName("To GMap");

  var mapItMessage = logTheSubject(label)
  for (var i = 0; i < mapItMessage.length; i++) {

    // Returns first object of thread that is labeled with To GMap
    var newGMessage = mapItMessage[0]

    if (newGMessage.getSubject() === "Map It") { // Replace with your desired subject line
      // Extract email details
      var body = newGMessage.getPlainBody();

      // Extract location from email body
      var location = extractLocationFromBody(body);
      if (location) {
        // Process location and add it to the Google Map list
        var locationId = processLocation(location);


        // Send yourself a notification using Gmail or other notification methods

   //     GmailApp.sendEmail("gcornejo441@gmail.com", "Location ID", locationId)

        

        // Mark the email as read

        /// message.markRead();
      }
      // Perform actions with the email details
      // Add your code here to process the location and add it to the Google Map list
      // Send yourself a notification using Gmail or other notification methods

    } else {

      Logger.log("Label not found. Make sure the label exists and check the label ID.");
    }
  }

return  CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Add to sheet")).addSection(CardService.newCardSection().addWidget(selectionInput)).build()
}

function extractLocationFromBody(body) {
  var locationRegex = /location: (.+)/i; // Adjust the regex pattern based on your email body format

  var matches = body.match(locationRegex);

  if (matches && matches.length > 1) {
    return matches[1].trim();
  }

  return null;
}

function processLocation(location) {
  var response = Maps.newGeocoder().geocode(location)

  if (response.status === 'OK' && response.results.length > 0) {
    var result = response.results[0];
    var locationId = result.place_id;

    // Add your code here to perform actions with the location ID
    // For example, add it to a Google Maps list or perform further operations

    return locationId;
  } else {
    Logger.log('Geocoding failed. Status: ' + response.status);
    return null;
  }
}