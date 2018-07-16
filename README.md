# PossibleTranslations

## Issues (Importance based on order)
**Backend:**
1. Need unit tests (API tests).
2. Push notification to the front end in case an update happens to the DB.
3. Add support for another translator (bing?).
4. Serve HTTPS Domain [let's encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-16-04).
5. API
  * Accept ~~Form Parameters~~ & JSON payloads.
  * Needs better documentation.
  * Needs auth (JWT).
  * Method Specific:
    * Put
      * Should be able to edit without need to insert old language if there is only one entry.
      * Currently put does not edit a row, but rather deletes it and inserts a new one.
      * Add ability to edit word without changing the language.
    * Post
      * Add ability to enter custom id.

**Frontend:**
1. Alex wants 2 screens!
2. Missing option to delete word from table.
3. Missing option to edit word  from table.
4. Is it mobile responsive ?
5. Is it [PWA](https://developers.google.com/web/progressive-web-apps/) ?
6. Search should case insensitive.
7. Spinner should be overlay.

## Stack used
* hosting: DO droplet for flask, AWS S3 for react
* database: postgres (AWS RDS instance)
* vc: github
* backend (API): flask
* front end: react
* language detection: langdetect & textblob
* language translation: google translate (considering adding bing service if time permits)


## Email from Alex
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
