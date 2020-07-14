from flask import Flask, jsonify, render_template
from call_functions import mongo_fns
import json


# Create an instance of Flask
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('test.html')

@app.route('/test2')
def test2():
    return render_template('test2.html')

@app.route('/test3')
def test3():
    return render_template('test3.html')

@app.route('/Players2020')
def players2020():
    return render_template('Players2020.html')

@app.route('/test4')
def test4():
    return render_template('test4.html')

@app.route('/Homepage')
def homepage():
    return render_template('Homepage.html')

@app.route('/Aboutus')
def aboutus():
    return render_template('Aboutus.html')

@app.route('/Players')
def players():
    return render_template('Players.html')

@app.route('/api/v1.0/<position>')
def x(position):
    data = mongo_fns.call_by_pos(str(position))
    # output = json.dumps(data)
    return jsonify(data)

@app.route('/api/v1.0/nhl2020')
def nhl2020():
    data = mongo_fns.call_2020()
    return jsonify(data)

@app.route('/api/v1.0/age/<position>')
def age(position):
    data = mongo_fns.call_age(str(position))
    return jsonify(data)

@app.route('/api/v1.0/ageseason/<position>')
def age_season(position):
    data = mongo_fns.call_age_season(str(position))
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
