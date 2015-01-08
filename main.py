# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing

# create the app
app = Flask(__name__)

@app.route('/')
def show_entries():
    return "Hello!"

if __name__ == "__main__":
    app.run()
