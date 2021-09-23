from flask import render_template
from flask import request

import time
import flask
from flask import Flask
from flask_sslify import SSLify

app = Flask(__name__,static_url_path='/static')
sslify = SSLify(app)

import os
import requests

from flask import send_from_directory

import time

@app.route('/autodiscover/autodiscover.xml')
def autodiscover():
    return send_from_directory(os.path.join(app.root_path, 'static'),'autodiscover.xml')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=("GET", "POST", "OPTIONS"))
def index():
  return render_template('index.html')

