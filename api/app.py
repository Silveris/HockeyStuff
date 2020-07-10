from flask import Flask, jsonify
from call_functions import mongo_fns
import json


# Create an instance of Flask
app = Flask(__name__)


@app.route('/')
def home():
    return'home'


@app.route('/api/v1.0/<position>')
def x(position):
    data = mongo_fns.call_by_pos(position)
    output = json.dumps(data, default=str)
    return jsonify(output)


if __name__ == '__main__':
    app.run(debug=True)
