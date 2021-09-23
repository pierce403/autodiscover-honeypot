from flask import render_template
from flask import request

import time
import flask
import logging
import sys
from flask import Flask
#from flask_sslify import SSLify

app = Flask(__name__,static_url_path='/static')
#sslify = SSLify(app)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

import os
import requests

from flask import send_from_directory
from flask import Response

import time
from werkzeug.exceptions import Unauthorized

@app.route('/autodiscover/autodiscover.xml', methods=['GET', 'POST'])
def autodiscover():
    print(request.headers)
    print(request.values)
#    return send_from_directory(os.path.join(app.root_path, 'static'),'autodiscover.xml')
    return Response('<UNAUTHORIZED>', 401, {'WWW-Authenticate':'Basic realm="Login Required"'})


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=("GET", "POST", "OPTIONS"))
def index():
  return render_template('index.html')


