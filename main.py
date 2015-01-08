# all the imports
import sqlite3
import datetime
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
    results = mongo.db.todos.find().sort('position')
    return dumps(results)

@app.route('/todo', methods=["POST"])
def create_todo():
    doc = request.get_json()
    doc['created_at'] = datetime.datetime.utcnow()
    todo_id = mongo.db.todos.insert(doc)
    return str(todo_id)

if __name__ == "__main__":
    app.run()
