# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from flask.ext.pymongo import PyMongo
from bson.json_util import dumps
from contextlib import closing

# create the app
app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'todo_app'
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/todos')
def get_all_todos():
    results = mongo.db.todos.find()
    return dumps(results)

if __name__ == "__main__":
    app.run()
