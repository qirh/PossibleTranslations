# PossibleTranslations [![MIT license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/qirh/pt/master/LICENSE)

**update may 2020:** website has been taken down

Repo for PossibleTranslations, a full stack website that takes user input, detects the language it's in and translates it.

**Website: [PossibleTranslations.com](https://PossibleTranslations.com)**

**API Endpoint: [PossibleTranslationsAPI.com](https://possibletranslationsapi.com)**

**API Documentation: [Postman Docs](https://documenter.getpostman.com/view/4826790/RWMLL6on)**

### Tech Stack
* Hosting: **Flask:** [DO droplet](https://possibletranslationsapi.com), **Frontend:** [AWS S3](http://possibletranslations.com.s3-website-us-east-1.amazonaws.com), **CDN:** [CloudFront](https://possibletranslations.com). **Domain names & routing:** Hover & Route 53
* Database: PostgreSQL deployed on AWS RDS.
* Backend: [Flask](http://flask.pocoo.org).
* Frontend: [React](https://reactjs.org/) --> [React Table](https://react-table.js.org) & [React Spinners](https://www.npmjs.com/package/react-spinners) & [React CSV](https://www.npmjs.com/package/react-csv) & [React Toastify](https://github.com/fkhadra/react-toastify).
* Language Detection: [langdetect](https://pypi.org/project/langdetect) & [textblob](https://textblob.readthedocs.io/en/dev).
* Language Translation: [Google Translate API](https://cloud.google.com/translate/docs).
