from flask import Flask
from __init__ import db


class Word(db.Model):
    word_id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(64), index=True, unique=True)
    lang_1 = db.Column(db.String(2))
    lang_2 = db.Column(db.String(2))
    lang_3 = db.Column(db.String(2))


    def __init__(self, word_id, word, lang_1, lang_2=None, lang_3=None):
        self.word_id = word_id
        self.word = word
        self.lang_1 = lang_1
        self.lang_2 = lang_2
        self.lang_3 = lang_3

    def __repr__(self):
        return '<Word {}>'.format(self.word)
