# PossibleTranslations

## Progress
**Important:**
1. ~~Replace local db with Remote~~
    * add JWT
2. ~~Implement front end (React)~~
3. Mobile responsive ?
4. Write Unit Tests
7. API documentation

**Not so important:**
1. Serve HTTPS Domain (let's encrypt)
2. Add support for another translator (bing?)

## Issues
**Backend:**
1. Need unit tests (API tests)
3. API should accept JSON payloads
4. Put
    * Should be able to edit without need to insert old language if there is only one entry
    * Currently put does not edit a row, but rather deletes it and inserts a new one
5. Post
    * Add ability to enter custom id

**Frontend:**
1. React icon shows up before custom icon
2. Need box to insert new word
3. Need option to delete word
4. Edit word?

## Notes
1. You need to export the Google API Key, look [here](https://stackoverflow.com/questions/35159967/setting-google-application-credentials-for-bigquery-python-cli) & [here](https://stackoverflow.com/questions/39843252/pycharm-set-environment-variable-for-google-service-account-key-json-credentia)

## API documentation
1. Will ignore all invalid keys


## Stack used
* hosting: DO droplet for flask, AWS s3 for react
* database: postgres (AWS RDS instance)
* vc: github
* backend: flask
* front end: react
* language detection: langdetect & textblob
* language translation: google translate (considering adding bing service if time permits)


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
