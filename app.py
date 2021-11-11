'''
    app.py
    Chloe Morscheck and Jake Martens
    9 November 2021

    A small Flask application that provides a barelywebsite with an accompanying
    API (which is also tiny) to support that website.
'''
import flask
import argparse
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')

@app.route('/') 
def home():
    return flask.render_template('index.html')

@app.route('/search_unions')
def search_unions():
    return flask.render_template('search_unions.html')

@app.route('/search_cases') 
def search_cases():
    return flask.render_template('search_cases.html')

@app.route('/search_strikes') 
def search_strikes():
    return flask.render_template('search_strikes.html')

@app.route('/state') 
def state():
    return flask.render_template('state.html')







if __name__ == '__main__':
    parser = argparse.ArgumentParser('A books-and-authors application, including API & DB')
    parser.add_argument('host', help='the host to run on')
    parser.add_argument('port', type=int, help='the port to listen on')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)