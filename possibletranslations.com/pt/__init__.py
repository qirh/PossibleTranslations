#!/usr/bin/env python
# -*- coding: utf-8 -*-

from textblob import TextBlob
from langdetect import detect, detect_langs, DetectorFactory
from flask import Flask, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.url_map.strict_slashes = False

app.config.from_object('config.Development')
db = SQLAlchemy(app)

def get_langs(word):

    """
    returns a list of the 3 most probable languages. the last two elemnts might be None
    TextBlob return 1 language. langdetect return a list of languages.

    if TextBlob == langdetect[0]
        languages = langdetect[0:3]
    else:
        languages = TextBlob + langdetect[0:2]
    """

    first_lang = TextBlob(word).detect_language()
    print("first_lang:")

    langs = detect_langs(word)
    langs = [w.lang.__str__() for w in langs]

    if(first_lang.__str__() != langs[0]):
        print("1")
        langs.insert(0, first_lang.__str__())

    # pad list if there are less than 3 elems
    while (len(langs) < 4):
        langs.append(None)
    # remove last elements there are more than 3 elems
    while (len(langs) > 3):
        langs = langs[:-1]

    return langs

@app.errorhandler(404)
def error_page(error1=None, error2=None, error3=None):
    return render_template('/404.html', title="404")


@app.route("/", methods=["GET", "POST"])
def index():
    DetectorFactory.seed = 0
    if request.form:
        print(get_langs(request.form["word"]))

    return render_template('/index.html')

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

