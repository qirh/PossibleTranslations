# -*- coding: utf-8 -*-

import os
from flask import Flask, render_template
app = Flask(__name__)
app.url_map.strict_slashes = False

@app.errorhandler(404)
def error_page(error1=None, error2=None, error3=None):
    return render_template('/404.html', title="404")


@app.route('/')
@app.route ('/index')
def index():
    return render_template('/index.html')
