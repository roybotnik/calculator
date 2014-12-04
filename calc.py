# -*- coding: utf-8 -*-
import os
from nsp import NumericStringParser
from flask import Flask, render_template, request, jsonify, abort

app = Flask(__name__)
app.debug = True

# Renders the template containing the calculator UI.
@app.route('/')
def index():
  return render_template('index.html')

@app.route('/api/v1/calculation/result', methods=['GET'])
def calculate():
  expression = request.args.get('expression')

  if expression is None:
    abort(404)

  nsp = NumericStringParser()
  result = nsp.eval(expression)
  return jsonify({'result': result})

if __name__ == '__main__':
  app.run()
