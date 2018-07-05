# PossibleTranslations

## Old readme
**Important:**
1. ~~Register Domain~~ [possibletranslations.com](possibletranslations.com)
2. Set up flask (sql-alchemy + flask api)
3. Create HTML

**Not so important:**
1. Serve HTTPS Domain (let's encrypt)
2. Make pretty HTML
3. Angular/React?

## Old readme
API that queries a bunch of language translators and return multiple results, will be helpful to translate words that might have multiple meanings.
Return the translation of a word and all it's synonyms Arabic &lt;-> English.

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
