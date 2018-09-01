# PossibleTranslations [![MIT license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/qirh/pt/master/LICENSE)

Repo for PossibleTranslations, a full stack website that takes user input, detects the language it's in and translates it.

**Website: [PossibleTranslations.com](PossibleTranslations.com)**

**API Endpoint: [PossibleTranslationsAPI.com](https://possibletranslationsapi.com)**

**API Documentation: [Postman Docs](https://documenter.getpostman.com/view/4826790/RWMLL6on)**

### Tech Stack
* Hosting: **Flask:** [DO droplet](https://possibletranslationsapi.com), **Frontend:** [AWS S3](http://possibletranslations.com.s3-website-us-east-1.amazonaws.com), **CDN:** [CloudFront](https://possibletranslations.com). **Domain names & routing:** Hover & Route 53
* Database: PostgreSQL deployed on AWS RDS.
* Backend: [Flask](http://flask.pocoo.org).
* Frontend: [React](https://reactjs.org/) --> [React Table](https://react-table.js.org) & [React Spinners](https://www.npmjs.com/package/react-spinners) & [React CSV](https://www.npmjs.com/package/react-csv) & [React Toastify](https://github.com/fkhadra/react-toastify).
* Language Detection: [langdetect](https://pypi.org/project/langdetect) & [textblob](https://textblob.readthedocs.io/en/dev).
* Language Translation: [Google Translate API](https://cloud.google.com/translate/docs).


### Issues (Importance based on order)
**Flask:**
1. Push notification to the front end in case an update happens to the DB.
2. Need unit tests (API tests).
3. Add support for another translator (bing?).

**API:**
1. Be able to accept JSON payloads.
2. Needs better documentation.
3. Needs auth (JWT).
4. Method Specific:
  * Put
    * Should be able to edit without need to insert old language if there is only one entry.
    * Currently put does not edit a row, but rather deletes it and inserts a new one.
    * Add ability to edit word without changing the language.
  * Post
    * Add ability to enter custom id.

**Frontend:**
1. Apostrophe does not display correctly.
2. Add option to delete/edit word from table.
3. Cell should be able to display long text.
3. Make it [PWA](https://developers.google.com/web/progressive-web-apps).
4. Search should case insensitive.
5. Auto deploy to S3 using [Travis CI](https://docs.travis-ci.com/user/deployment/s3/).
6. Add about page. [Routing](https://medium.com/@krithix/multi-page-website-with-react-in-2017-f6f2af326526).
