from flask import Flask, jsonify, render_template
from call_functions import mongo_fns
import json


# Create an instance of Flask
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('Hindex.html')

@app.route('/api/v1.0/<position>')
def x(position):
    data = mongo_fns.call_by_pos(str(position))
#    output = json.dumps(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
