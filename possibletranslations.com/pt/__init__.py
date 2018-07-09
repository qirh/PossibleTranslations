#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from textblob import TextBlob
from langdetect import detect_langs, DetectorFactory
from google.cloud import translate


app = Flask(__name__)
app.url_map.strict_slashes = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///words.db'
app.config['SQLALCHEMY_MIGRATE_REPO'] = 'db_repository'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)
TARGET = 'en'


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
        return list()

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


def get_translations(langs, word):

    """
    returns a list of the 3 string pairs [lang: translation]
    """
    translations = []
    translate_client = translate.Client()

    for i in range(len(langs)):
        if langs[i] == None:
            translations.append(None)
        elif langs[i] == 'en':
            translations.append(word)
        else:
            translations.append(translate_client.translate(word, source_language=langs[i], target_language=TARGET)['translatedText'])

    return dict(zip(langs, translations))


@app.errorhandler(404)
def error_page(error1=None, error2=None, error3=None):
    return render_template('/404.html', title="404")


@app.route("/", methods=["GET", "POST"])
def index():
    DetectorFactory.seed = 0
    if request.form:
        langs = get_langs(request.form["word"])
        translations = get_translations(langs, request.form["word"])

        w = Word(request.form["word"], langs[0], translations[langs[0]], langs[1], translations[langs[1]], langs[2], translations[langs[2]])
        print(translations)
        print(w.word_id)
        print(w)
        db.session.add(w)
        db.session.commit()
    print("------------------")
    words = Word.query.all()
    print(words)
    print("------------------")
    return render_template('/index.html')

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)



class Word(db.Model):
    __tablename__ = 'words'

    word_id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5000), index=True, unique=True, nullable=False)
    lang_1 = db.Column(db.String(2), nullable=False)
    lang_2 = db.Column(db.String(2))
    lang_3 = db.Column(db.String(2))
    translation_1 = db.Column(db.String(5000), nullable=False)
    translation_2 = db.Column(db.String(5000))
    translation_2 = db.Column(db.String(5000))


    def __init__(self, word, lang_1, translation_1, lang_2=None, translation_2=None, lang_3=None, translation_3=None):
        self.word = word
        self.lang_1 = lang_1
        self.lang_2 = lang_2
        self.lang_3 = lang_3
        self.translation_1 = translation_1
        self.translation_2 = translation_2
        self.translation_3 = translation_3

    def __repr__(self):
        return '<Word: {}. lang_1: {}. translation_1: {}>'.format(self.word, self.lang_1, self.translation_1)
