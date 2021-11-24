'''
    app.py
    Chloe Morscheck and Jake Martens
    9 November 2021

    A Flask application that provides a website with an accompanying API to 
    support that website. This code brings together each of the disparate
    pieces of our code.

    This website helps users find information about local labor unions,
    ongoing strikes nationwide, and ongoing cases against violating
    employers.
'''
import flask
import argparse
import api

app = flask.Flask(__name__, static_folder='static', template_folder='templates')
app.register_blueprint(api.api, url_prefix='/api')


@app.route('/') 
def home():
    '''Renders the homepage for the site.'''
    return flask.render_template('index.html')

@app.route('/search_unions', strict_slashes=False)
def search_unions():
    '''Renders the Search Unions page'''
    return flask.render_template('search_unions.html')

@app.route('/search_cases') 
def search_cases():
    '''Renders the Search Cases page.'''
    return flask.render_template('search_cases.html')

@app.route('/search_strikes') 
def search_strikes():
    '''Renders the Search Strikes page.'''
    return flask.render_template('search_strikes.html')


# Again, is the following appropriate, or is there a better way to do it?
if __name__ == '__main__':
    parser = argparse.ArgumentParser('A unions application, including API & DB')
    parser.add_argument('host', help='the host to run on')
    parser.add_argument('port', type=int, help='the port to listen on')
    arguments = parser.parse_args()
    app.run(host=arguments.host, port=arguments.port, debug=True)