# PossibleTranslations [![MIT license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/qirh/pt/master/LICENSE)

Repo for [Possible Translations](possibletranslations.com), a full stack website that takes user input, detects the language it's in and translates it. [API Documentation](https://documenter.getpostman.com/view/4826790/RWMCt9fH). [API Endpoint](https://possibletranslationsapi.com).


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
1. Show message when backend sends 404.
2. Missing option to delete word from table.
3. Missing option to edit word  from table.
4. Is it mobile responsive ?
5. Is it [PWA](https://developers.google.com/web/progressive-web-apps/) ?
6. Search should case insensitive.
7. Auto deploy to S3 using [Travis CI](https://docs.travis-ci.com/user/deployment/s3/)

### Tech Stack
* Hosting: **Flask:** [DO droplet](https://possibletranslationsapi.com), **Frontend:** [AWS S3](http://possibletranslations.com.s3-website-us-east-1.amazonaws.com), **CDN:** [CloudFront](https://possibletranslations.com). **Domain names & routing:** Hover & Route 53
* Database: PostgreSQL deployed on AWS RDS.
* Backend: [Flask](http://flask.pocoo.org).
* Frontend: [React](https://reactjs.org/) --> [React Table](https://react-table.js.org) & [React Spinners](https://www.npmjs.com/package/react-spinners) & [React CSV](https://www.npmjs.com/package/react-csv) & [React Toastify](https://github.com/fkhadra/react-toastify).
* Language Detection: [langdetect](https://pypi.org/project/langdetect) & [textblob](https://textblob.readthedocs.io/en/dev).
* Language Translation: [Google Translate API](https://cloud.google.com/translate/docs).
