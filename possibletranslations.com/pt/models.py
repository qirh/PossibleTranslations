from flask import Flask
from __init__ import db


class Word(db.Model):
    word_id = db.Column(db.Integer, primary_key=True)
    word = db.Column(db.String(5000), index=True, unique=True)
    lang_1 = db.Column(db.String(2))
    lang_2 = db.Column(db.String(2))
    lang_3 = db.Column(db.String(2))
    translation_1 = db.Column(db.String(5000))
    translation_2 = db.Column(db.String(5000))
    translation_2 = db.Column(db.String(5000))


    def __init__(self, word_id, word, lang_1, translation_1, lang_2=None, lang_3=None, translation_2=None, translation_3=None):
        self.word_id = word_id
        self.word = word
        self.lang_1 = lang_1
        self.lang_2 = lang_2
        self.lang_3 = lang_3
        self.translation_1 = translation_1
        self.translation_2 = translation_2
        self.translation_3 = translation_3

    def __repr__(self):
        return '<Word {}>'.format(self.word)
