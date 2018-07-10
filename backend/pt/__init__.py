#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, render_template, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy import exc, and_
from textblob import TextBlob
from langdetect import detect_langs, DetectorFactory
from google.cloud import translate

app = Flask(__name__)
app.url_map.strict_slashes = False

POSTGRES = {
    'user': 'sal7',
    'pw': '400700we@',
    'db': 'words_db',
    'host': 'localhost',
    'port': '5432',
}

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://saleh:400700we@wordsaws.clzvkffnzrmz.us-east-1.rds.amazonaws.com:5432/words_db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://sal7:400700we@localhost:5432/words_db'
app.config['SQLALCHEMY_MIGRATE_REPO'] = 'db_repository'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
TARGET = 'en'

# models
class WordTranslations(db.Model):
    __tablename__ = 'words'
    __table_args__ = (db.UniqueConstraint('word', 'target_lang'),)

    word_id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5000), nullable=False)
    target_lang = db.Column(db.String(20), nullable=False)
    lang_1 = db.Column(db.String(20), nullable=False)
    lang_2 = db.Column(db.String(20))
    lang_3 = db.Column(db.String(20))
    translation_1 = db.Column(db.String(5000), nullable=False)
    translation_2 = db.Column(db.String(5000))
    translation_3 = db.Column(db.String(5000))


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

db.create_all()
db.session.commit()

# controller
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



# Views
@app.errorhandler(404)
def error_page(custom=None):
    print(custom)
    return render_template('/404.html', title="404", custom=custom)

@app.route("/", methods=["GET", "POST"])
@app.route("/index", methods=["GET", "POST"])
def index():

    client = translate.Client()
    client = client.get_languages()

    DetectorFactory.seed = 0
    if request.form:
        target_lang = TARGET
        word = request.form.get("word")

        if(request.form.get("target") != None):
            target_lang = request.form["target"]

        langs = get_langs(word)
        translations = get_translations(langs, word, target_lang)

        w = WordTranslations(word, target_lang, langs[0], translations[langs[0]], langs[1], translations[langs[1]], langs[2], translations[langs[2]])

        try:
            db.session.add(w)
            db.session.commit()
        except exc.IntegrityError as e:
            print("exc.IntegrityError: " + str(e))
            db.session().rollback()
    words = WordTranslations.query.all()
    return render_template('/index.html', title="Possible Translations", words=words, langs=client)



@app.route ('/api', methods=['GET'])
def get_all():

    try:
        filters = request.args.to_dict()
        if (filters.get('lang') is not None):
            filters['target_lang'] = filters.pop('lang')
        if (filters.get('id') is not None):
            filters['word_id'] = filters.pop('id')

        try:
            words = WordTranslations.query.filter_by(**filters).all()
        except Exception as e:
            print(e)
            return make_response(jsonify({'error': 'illegal search query'}), 404)

        print(words)

        if (len(words) < 1):
            raise Exception("len(words) = 0")
        return jsonify({'words':[w.serialize() for w in words]})
    except Exception as e:
        print(str(e))
        return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/api/echo', methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'])
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
        return make_response(jsonify({'error': 'unsupported method'}, {'methods supported': {'GET', 'POST', 'PATCH', 'PUT', 'DELETE'}}), 404)