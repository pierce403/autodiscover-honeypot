#!/bin/bash

export LC_ALL="C.UTF-8"
export LANG="C.UTF-8"
export FLASK_APP=./app.py

if [ ! -d venv ]
then
  echo "[+] Creating new python3 virtualenv named venv"
  virtualenv -p /usr/bin/python3 venv
fi


source venv/bin/activate
pip3 install -r requirements.txt

flask run --with-threads --host=0.0.0.0 --port=5000

