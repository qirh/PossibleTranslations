#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, make_response
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin

from sqlalchemy import exc
from textblob import TextBlob
from langdetect import detect_langs, DetectorFactory
from google.cloud import translate

import os, sys; sys.path.append(os.path.dirname(os.path.realpath(__file__)))
from models import db, WordTranslations


app = Flask(__name__)
app.config.from_pyfile('config.cfg')    # default config
app.config.from_pyfile('config-db.cfg')    # secret config with db link, not included in VC
#app.config.from_pyfile('config-dev.cfg')    # dev config


CORS(app)
app.url_map.strict_slashes = False

db.app = app
db.init_app(app)
migrate = Migrate(app, db)
TARGET_LANGUAGE = 'en'
AVALIABLE_LANGUAGES = []

def drop():
    db.reflect()
    db.drop_all()
#drop()
db.create_all()
db.session.commit()


##############################################
################# CONTROLLER #################
##############################################
def get_langs(word):
    """
    returns a list of the 3 most probable languages. the last two elemnts might be None
    TextBlob return 1 language. langdetect return a list of languages.

    if TextBlob == langdetect[0]
        languages = langdetect[0:3]
    else:
        languages = TextBlob + langdetect[0:2]
    """
    if(len(word) < 3):
        return [None for i in range(3)]

    first_lang = TextBlob(word).detect_language().__str__()
    langs = [w.lang.__str__() for w in detect_langs(word)]

    if(first_lang != langs[0]):
        langs.insert(0, first_lang.__str__())

    # pad list if there are less than 3 elems
    while (len(langs) < 4):
        langs.append(None)
    # remove last elements there are more than 3 elems
    while (len(langs) > 3):
        langs = langs[:-1]

    return langs


def get_translations(langs, word, target_lang):
    """
    returns a list of the 3 string pairs [lang: translation]
    """
    translations = []
    translate_client = translate.Client()

    for i in range(len(langs)):
        if langs[i] == None:
            translations.append(None)
        elif langs[i] == target_lang:
            translations.append(word)
        else:
            translations.append(translate_client.translate(word, source_language=langs[i], target_language=target_lang)['translatedText'])

    return dict(zip(langs, translations))


# Used for GET, return a list of all entries matching filter
def find_all_words(filters):
    search_dict = {}
    if (filters.get('target_lang') is not None):
        search_dict['target_lang'] = filters.pop('target_lang')
    if (filters.get('word_id') is not None):
        search_dict['word_id'] = filters.pop('word_id')
    if (filters.get('word') is not None):
        search_dict['word'] = filters.pop('word')

    try:
        words = WordTranslations.query.filter_by(**search_dict).all()
    except Exception:
        raise CustomException(404, 'Illegal search query')

    if (len(words) < 1):
        if(not search_dict):
            raise CustomException(404, 'DB is empty')
        raise CustomException(404, 'Word Not Found')
    return words


# Used for DELETE & PUT, will raise an exception if combination of (word + target_lang) either does not exist in the DB or if there are multiple entries
def word_is_unique(filters):
    search_dict = {}
    if (filters.get('target_lang') is not None):
        search_dict['target_lang'] = filters.pop('target_lang')
    if (filters.get('word_id') is not None):
        search_dict['word_id'] = filters.pop('word_id')
    if (filters.get('word') is not None):
        search_dict['word'] = filters.pop('word')
    try:
        words = WordTranslations.query.filter_by(**search_dict).all()
    except Exception:
        raise CustomException(404, 'Illegal search query')

    if (len(words) < 1):
        if(not search_dict):
            raise CustomException(404, 'DB is empty')
        raise CustomException(404, 'Word Not Found')
    elif(len(words) > 1):
        raise CustomException(404, 'Too many options, please narrow down with more questions')
    return words[0]


# Used for POST, will raise an exception if combination of (word + target_lang) has an entry in the DB
def find_word(filters):
    search_dict = {}
    if (filters.get('target_lang') is not None):
        search_dict['target_lang'] = filters.pop('target_lang')
    else:
        raise CustomException(404, 'Missing target_lang field')
    if (filters.get('word_id') is not None):
        search_dict['word_id'] = filters.pop('word_id')
    if (filters.get('word') is not None):
        search_dict['word'] = filters.pop('word')
    else:
        raise CustomException(404, 'Missing word field')
    try:
        words = WordTranslations.query.filter_by(**search_dict).all()
    except Exception:
        raise CustomException(404, 'Illegal search query')

    if (len(words) > 1):
        raise CustomException(404, 'Word already exists')
    return words


def update_languages():
    try:
        global AVALIABLE_LANGUAGES
        AVALIABLE_LANGUAGES = translate.Client().get_languages()  # What if this fails?
    except Exception as e:
        AVALIABLE_LANGUAGES = [{'language': 'en', 'name': 'English'}]


class CustomException(Exception):
    def __init__(self, number, message):
        self.number = number
        self.message = message
        super().__init__(message)


def add_word(form):
    DetectorFactory.seed = 0
    target_lang = TARGET_LANGUAGE

    word = form.get("word").strip()
    if (len(word) < 1):
        raise CustomException(404, "Word can't be less that 1 character")

    if (form.get("target_lang") != None):
        target_lang = form["target_lang"]

    langs = get_langs(word)
    translations = get_translations(langs, word, target_lang)

    w = WordTranslations(word, target_lang, langs[0], translations[langs[0]], langs[1], translations[langs[1]],
                         langs[2], translations[langs[2]])

    for attr, value in w.__dict__.items():
        if value is None:
            w.__dict__[attr] = "-"
    try:
        db.session.add(w)
        db.session.commit()
        return w
    except exc.IntegrityError as e:
        print("add_word exc.IntegrityError: " + str(e))
        db.session().rollback()
        raise exc.IntegrityError



#########################################
################# VIEWS #################
#########################################
@app.errorhandler(404)
@cross_origin()
def error_page(custom=None):
    print("error_page: \n'" + str(custom) + "'")
    return make_response(jsonify({'Error': 'Illegal URI'}), 404)


@app.route("/", methods=["GET"])
@cross_origin()
def index():
    return make_response(render_template('/index.html', title="PT API"), 200)


#########################################
################# API ###################
#########################################
# Body data --> request.form
# Query string data --> request.args
# Both kinds of data --> request.values

# Edits one entry at a time (needs word + target_lang + new_target_lang)
@app.route ('/api/v1', methods=['PUT'])
@app.route ('/api/v1/q', methods=['PUT'])
@cross_origin()
def api_put():

    word = ""
    try:
        word = word_is_unique(request.values.to_dict())
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print("api_put ERROR: " + e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)
    try:
        db.session.delete(word)
        args_dict = request.values.to_dict()
        args_dict['target_lang'] = args_dict.pop('new_target_lang')
        word = add_word(args_dict)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except exc.IntegrityError as e:
        print("api_put exc.IntegrityError: " + str(e))
        db.session().rollback()
        return make_response(jsonify({'Error': 'DB Integrity Error'}), 404)

    response = jsonify(word.serialize())
    return make_response(response, 200)


# Posts one entry at a time (needs word + target_lang)
@app.route ('/api/v1', methods=['POST'])
@app.route ('/api/v1/q', methods=['POST'])
@cross_origin()
def api_post():
    try:
        find_word(request.values.to_dict())
        word = add_word(request.values.to_dict())
        response = jsonify(word.serialize())
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print("api_post Exception: " + e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Deletes one entry at a time (requires word or target_lang or id). Will only delete only if one entry exists
@app.route ('/api/v1/q', methods=['DELETE'])
@cross_origin()
def api_delete():
    try:
        word = word_is_unique(request.values.to_dict())
        try:
            db.session.delete(word)
            db.session.commit()
        except exc.IntegrityError as e:
            print("api_delete exc.IntegrityError: " + str(e))
            db.session().rollback()
            return make_response(jsonify({'Error': 'DB Integrity Error'}), 404)

        response = jsonify(word.serialize())
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print("api_delete Exception: " + e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Gets specific entries or all entries
@app.route ('/api/v1', methods=['GET'])
@app.route ('/api/v1/q', methods=['GET'])
@cross_origin()
def api_get():
    try:
        if(request.values.to_dict()):
            words = find_all_words(request.values.to_dict())
        else:
            words = WordTranslations.query.all()
        response = jsonify([w.serialize() for w in words])
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print("api_get Exception" + e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Gets supported languages
@app.route ('/api/v1/languages', methods=['GET'])
@cross_origin()
def api_get_languages():
    try:
        update_languages()
        response = jsonify(AVALIABLE_LANGUAGES)
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        return make_response(jsonify({'Error': 'unknown error'}), 404)

@app.route('/api/v1/options', methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
@cross_origin()
def api_options():
    return make_response(jsonify({'Allow': 'GET, POST, PATCH, PUT, DELETE'}), 200)

@app.route('/api/v1/echo', methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
@cross_origin()
def api_echo():
    if request.method == 'GET':
        return make_response(jsonify({'ECHO': 'GET'}), 200)
    elif request.method == 'POST':
        return make_response(jsonify({'ECHO': 'POST'}), 200)
    elif request.method == 'PATCH':
        return make_response(jsonify({'ECHO': 'PATCH'}), 200)
    elif request.method == 'PUT':
        return make_response(jsonify({'ECHO': 'PUT'}), 200)
    elif request.method == 'DELETE':
        return make_response(jsonify({'ECHO': 'DELETE'}), 200)
    else:
        return make_response(jsonify({'Error': 'unsupported method'}, {'methods supported': {'GET', 'POST', 'PATCH', 'PUT', 'DELETE'}}), 404)
