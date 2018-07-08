#!/usr/bin/env python
# -*- coding: utf-8 -*-


from langdetect import detect
from flask import Flask, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.url_map.strict_slashes = False

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///words.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)


@app.errorhandler(404)
def error_page(error1=None, error2=None, error3=None):
    return render_template('/404.html', title="404")


@app.route("/", methods=["GET", "POST"])
def index():
    if request.form:
        print((request.form["word"]).decode('utf-8'))
        print(detect(request.form["word"].decode('utf-8')))
    return render_template('/index.html')

@app.route('/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

