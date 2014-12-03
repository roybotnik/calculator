# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template, request

app = Flask(__name__)
app.debug = True

# Renders the template containing the calculator UI.
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
