function handleTextBtnClick() {

  var cropStyle = CardService.newImageCropStyle()
    .setImageCropType(CardService.ImageCropType.SQUARE);

  var borderStyle = CardService.newBorderStyle()
    .setType(CardService.BorderType.STROKE)
    .setCornerRadius(8)
    .setStrokeColor("#00FF00FF");

  return CardService.newCardBuilder()
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText(
          'Okay, maybe this addon does not do much but, ' +
          'it is kind of cool to have, ehhhh?. ' +
          'Below is an image of a cat if you\'re not impressed. ' +
          '-Gabe C'))
      .addWidget(CardService.newGrid()
        .setTitle("A picture of a cat!")
        .addItem(CardService.newGridItem()
          .setIdentifier("item_001")
          .setImage(CardService.newImageComponent()
            .setImageUrl("https://cataas.com/cat?0.01")
            .setCropStyle(cropStyle)
            .setBorderStyle(borderStyle)))))

    .build()

}


function composeEmailCB(event) {

  /* Form input values */
  var lowerCaseSubjectLineValue = event.formInput.subject_line_input_value.toLowerCase();
  var lowerCaseEmailBodyValue = event.formInput.email_body_input_value.toLowerCase();

  var meganThread = GmailApp.getUserLabelByName("Megan")
  var firstThread = GmailApp.getInboxThreads(0, 1)[0]
  meganThread.addToThread(firstThread);

  // Log the subject lines of the threads labeled with MyLabel
  var label = GmailApp.getUserLabelByName("Megan");
  var threads = label.getThreads();
  for (var i = 0; i < threads.length; i++) {
    const meganThreadSubjectLine = threads[i].getFirstMessageSubject().toLowerCase();

    if (meganThreadSubjectLine == lowerCaseSubjectLineValue) {
      var draft = firstThread.createDraftReply(lowerCaseEmailBodyValue)
      return CardService.newComposeActionResponseBuilder()
        .setGmailDraft(draft)
        .build();

    } else {
      return CardService
        .newCardBuilder()
        .setHeader(
          CardService.newCardHeader()
            .setTitle('DOES NOT EXIST!'))
        .addSection(
          CardService.newCardSection()
            .setHeader('For Megan., cannot find that subject line.')  // optional
            .addWidget(CardService.newTextParagraph().setText(
              'If that subject line exist contact the developer. ' +
              'He will assist you. '))
            .addWidget(CardService.newTextParagraph().setText( 'This is what you have entered: ' + lowerCaseSubjectLineValue + ' ' +
              'Try searching for that email thread using the Gmail search bar.'))
            .addWidget(CardService.newImage().setImageUrl('https://cataas.com/cat/says/This%20subject%20line%20does%20not%20exist')))
        .addCardAction(CardService.newCardAction().setText('Gmail').setOpenLink(
          CardService.newOpenLink().setUrl('https://mail.google.com/mail')))
        .build();
    }
  }

}



/**
 * Returns the contextual add-on data that should be rendered for
 * the current e-mail thread. This function satisfies the requirements of
 * an 'onTriggerFunction' and is specified in the add-on's manifest.
 *
 * @param {Object} event Event containing the message ID and other context.
 * @returns {Card[]}
 */
function getContextualQuote(event) {

  var subjectLineInputText = CardService.newTextInput().setFieldName("subject_line_input_value").setTitle("Input the subject line " + "to the email you want " + "send an email to.").setValue("Work Thread");
var emailBodyInputText = CardService.newTextInput().setFieldName("email_body_input_value").setTitle("Email Body")

  var card = CardService.newCardBuilder();
  card.setHeader(CardService.newCardHeader()
    .setTitle("For Megan.")
    .setSubtitle("You are kind and loving soul <3.")
    .setImageUrl("https://img.icons8.com/fluency/48/null/happy-cloud.png")
    .setImageStyle(CardService.ImageStyle.CIRCLE)
    .setImageAltText("A Happy Blue Cloud")
  ).addSection(
    CardService.newCardSection()
      .setHeader('Easy Breezy Life') // optional
      .addWidget(CardService.newDivider())
      .addWidget(CardService.newDivider())
      .addWidget(CardService.newTextParagraph()
        .setText("What is Cats as a Service (CATAAS)?"))
      .addWidget(CardService.newTextButton()
        .setText("To CATAAS")
        .setAltText("Click to see hidden message")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor("#A5CFB6").setOnClickAction(
          CardService.newAction()
            .setFunctionName("handleTextBtnClick")
        ))
      .addWidget(CardService.newDivider())
      .addWidget(CardService.newDivider())
      .addWidget(subjectLineInputText)
      .addWidget(CardService.newTextParagraph().setText("Input your message."))
      .addWidget(emailBodyInputText)
      .addWidget(CardService.newTextButton()
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor("#93C572")
        .setText("Compose Email")
        .setComposeAction(CardService.newAction().setFunctionName('composeEmailCB'), CardService.ComposedEmailType.REPLY_AS_DRAFT))
  )

  return [card.build()];
}



/**
 * Returns the contextual add-on data that should be rendered for
 * the current e-mail thread. This function satisfies the requirements of
 * an 'homepageTrigger' and is specified in the add-on's manifest.
 *
 * @param {Object} event Event containing the message ID and other context.
 * @returns {CardService}
 */
function runHomepageTrigger(event) {

  var response = UrlFetchApp.fetch("https://zenquotes.io/api/today")
  // Make request to API and get response before this point.
  var json = response.getContentText();
  var data = JSON.parse(json);

  return CardService
    .newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle("For Megan.")
      .setSubtitle("You are kind and loving soul <3.")
      .setImageUrl("https://img.icons8.com/fluency/48/null/happy-cloud.png")
      .setImageStyle(CardService.ImageStyle.CIRCLE)
      .setImageAltText("A Happy Blue Cloud"))
    .addSection(CardService.newCardSection()
      .setHeader("Here is a quote by: " + data[0].a)
      .addWidget(CardService.newTextParagraph().setText(data[0].q))
      .addWidget(CardService.newDivider())
      .addWidget(CardService.newDivider())
      .addWidget(CardService.newTextParagraph().setText(
        'Open up an email for more features.'))
    )
    .addCardAction(CardService.newCardAction().setText('Gmail').setOpenLink(
      CardService.newOpenLink().setUrl('https://mail.google.com/mail')))
    .build();

}
