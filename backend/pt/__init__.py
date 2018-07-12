#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import exc
from textblob import TextBlob
from langdetect import detect_langs, DetectorFactory
from google.cloud import translate

app = Flask(__name__)
app.url_map.strict_slashes = False

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://saleh:400700we@wordsaws.clzvkffnzrmz.us-east-1.rds.amazonaws.com:5432/words_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sal7:400700we@localhost:5432/words_db'
app.config['SQLALCHEMY_MIGRATE_REPO'] = 'db_repository'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
TARGET = 'en'


#########################################
################# MODEL #################
#########################################
class WordTranslations(db.Model):
    __tablename__ = 'words'
    __table_args__ = (db.UniqueConstraint('word', 'target_lang'),)

    word_id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5000), nullable=False)
    target_lang = db.Column(db.String(20), nullable=False)
    lang_1 = db.Column(db.String(20), nullable=False)
    lang_2 = db.Column(db.String(20), nullable=False)
    lang_3 = db.Column(db.String(20), nullable=False)
    translation_1 = db.Column(db.String(5000), nullable=False)
    translation_2 = db.Column(db.String(5000), nullable=False)
    translation_3 = db.Column(db.String(5000), nullable=False)


    def __init__(self, word, target_lang, lang_1, translation_1, lang_2=None, translation_2=None, lang_3=None, translation_3=None):
        self.word = word
        self.target_lang = target_lang
        self.lang_1 = lang_1
        self.lang_2 = lang_2
        self.lang_3 = lang_3
        self.translation_1 = translation_1
        self.translation_2 = translation_2
        self.translation_3 = translation_3

    def __repr__(self):
        return '<Word: {}. target_lang: {}. lang_1: {}. translation_1: {}>'.format(self.word, self.target_lang, self.lang_1, self.translation_1)

    def serialize(self):
        return {
            'word_id': self.word_id,
            'word': self.word,
            'target_lang': self.target_lang,
            'lang_1': self.lang_1,
            'lang_2': self.lang_2,
            'lang_3': self.lang_3,
            'translation_1': self.translation_1,
            'translation_2': self.translation_2,
            'translation_3': self.translation_3,
        }


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
    if (filters.get('id') is not None):
        search_dict['word_id'] = filters.pop('id')
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
    if (filters.get('id') is not None):
        search_dict['word_id'] = filters.pop('id')
    if (filters.get('word') is not None):
        search_dict['word'] = filters.pop('word')
    print(search_dict)
    try:
        words = WordTranslations.query.filter_by(**search_dict).all()
    except Exception:
        raise CustomException(404, 'Illegal search query')
    print(words)
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
    if (filters.get('id') is not None):
        search_dict['word_id'] = filters.pop('id')
    if (filters.get('word') is not None):
        search_dict['word'] = filters.pop('word')

    print(search_dict)
    try:
        words = WordTranslations.query.filter_by(**search_dict).all()
    except Exception:
        raise CustomException(404, 'Illegal search query')

    print(words)
    if (len(words) > 1):
        raise CustomException(404, 'Word already exists')
    return words


class CustomException(Exception):
    def __init__(self, number, message):
        self.number = number
        self.message = message
        super().__init__(message)


def add_word(form):
    DetectorFactory.seed = 0
    target_lang = TARGET
    word = form.get("word")
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
        print("exc.IntegrityError: " + str(e))
        db.session().rollback()
        raise exc.IntegrityError



#########################################
################# VIEWS #################
#########################################
@app.errorhandler(404)
def error_page(custom=None):
    print("error_page(custom= " + str(custom))
    return render_template('/404.html', title="404", custom=custom)


@app.route("/", methods=["GET", "POST"])
@app.route("/index", methods=["GET", "POST"])
def index():
    client = translate.Client().get_languages() # What if this fails?
    try:
        words = WordTranslations.query.all()
    except:
        return make_response(render_template('/index.html', title="Possible Translations", words=[], langs=client), 422)
    try:
        if request.form:
            words.append(add_word(request.form))

        return make_response(
            render_template('/index.html', title="Possible Translations", words=words, langs=client), 200)
    except:
        return make_response(render_template('/index.html', title="Possible Translations", words=words, langs=client), 422)


# Edits one entry at a time (needs word + target_lang + new_target_lang)
@app.route ('/api/1.0/q', methods=['PUT'])
def api_put():
    try:
        dict = request.args.to_dict()
        word = word_is_unique(dict)
        try:
            print(dict)
            db.session.delete(word)

            print(dict)
            dict['target_lang'] = dict['new_target_lang']
            word = add_word(request.args.to_dict())

            response = jsonify(word.serialize())
            response.headers.add('Access-Control-Allow-Origin', '*')
            return make_response(response, 200)
        except CustomException as e:
            return make_response(jsonify({'Error': e.message}), e.number)
        except Exception as e:
            print(e)
            return make_response(jsonify({'Error': 'unknown error'}), 404)
            db.session.commit()
        except exc.IntegrityError as e:
            print("exc.IntegrityError: " + str(e))
            db.session().rollback()
            return make_response(jsonify({'Error': 'DB Integrity Error'}), 404)

        response = jsonify(word.serialize())
        response.headers.add('Access-Control-Allow-Origin', '*')
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print(e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Posts one entry at a time (needs word + target_lang)
@app.route ('/api/1.0/q', methods=['POST'])
def api_post():
    try:
        find_word(request.args.to_dict())
        word = add_word(request.args.to_dict())
        response = jsonify(word.serialize())
        response.headers.add('Access-Control-Allow-Origin', '*')
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print(e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Deletes one entry at a time (requires word or target_lang or id). Will only delete only if one entry exists
@app.route ('/api/1.0/q', methods=['DELETE'])
def api_delete():
    try:
        word = word_is_unique(request.args.to_dict())
        try:
            db.session.delete(word)
            db.session.commit()
        except exc.IntegrityError as e:
            print("exc.IntegrityError: " + str(e))
            db.session().rollback()
            return make_response(jsonify({'Error': 'DB Integrity Error'}), 404)

        response = jsonify(word.serialize())
        response.headers.add('Access-Control-Allow-Origin', '*')
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        print(e)
        return make_response(jsonify({'Error': 'unknown error'}), 404)


# Gets all applicable words
@app.route ('/api/1.0', methods=['GET'])
@app.route ('/api/1.0/q', methods=['GET'])
def api_get():
    try:
        if(request.args.to_dict()):
            words = find_all_words(request.args.to_dict())
        else:
            words = WordTranslations.query.all()
        response = jsonify([w.serialize() for w in words])
        response.headers.add('Access-Control-Allow-Origin', '*')
        return make_response(response, 200)
    except CustomException as e:
        return make_response(jsonify({'Error': e.message}), e.number)
    except Exception as e:
        return make_response(jsonify({'Error': 'unknown error'}), 404)


@app.route('/api/1.0/echo', methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
def api_echo():
    if request.method == 'GET':
        return make_response(jsonify({'ECHO': 'GET'}))
    elif request.method == 'POST':
        return make_response(jsonify({'ECHO': 'POST'}))
    elif request.method == 'PATCH':
        return make_response(jsonify({'ECHO': 'PATCH'}))
    elif request.method == 'PUT':
        return make_response(jsonify({'ECHO': 'PUT'}))
    elif request.method == 'DELETE':
        return make_response(jsonify({'ECHO': 'DELETE'}))
    else:
        return make_response(jsonify({'Error': 'unsupported method'}, {'methods supported': {'GET', 'POST', 'PATCH', 'PUT', 'DELETE'}}), 404)