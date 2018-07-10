# PossibleTranslations

## Old readme
**Important:**
1. Replace local db with Remote --> add JWT
2. Implement front end (React) --> Flask API + JWT + flask cdn
3. Make sure it's mobile responsive
4. Write Unit Tests

**Not so important:**
1. Serve HTTPS Domain (let's encrypt)
2. Add support for another translator (bing?)
3. Dash instead of None in Table

## Alex requirement
The goal of this project is to create a tool that will accept text input (e.g. a sentence), determine the language entered, and translate the text to English. Then you should deploy this tool to the Web so I can see it.

The UI consists of 2 screens. 1) A screen to enter text, and 2) A list of the entered text, alongside the language of the text and a translation.

The UI screen should have 2 elements. A text entry form and a button to submit the text.

The list screen should have 3 columns, the original text, the language and the translation.

There should be a way to switch between screens.
On the backend, all entered data, as well as derived data should be stored in a database. Most of the backend should consist of APIs to enter the text and to retrieve the list.

Here is what the an example stack would be. You are free to pick and choose which of these elements you decide to use:

* hosting: ec2 (AWS)
* database: Postgres
* version control: github
* web framework: Django
* front end framework: angular
* language detection: python library
* language translation: google translate
