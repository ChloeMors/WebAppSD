'''
    api.py
    Chloe Morscheck and Jake Martens
    9 November 2021

    Flask API to support the web application.
'''
import sys
import flask
import json
import config
import psycopg2

api = flask.Blueprint('api', __name__)

def get_connection():
    ''' Returns a connection to the database described in the
        config module. May raise an exception as described in the
        documentation for psycopg2.connect. '''
    return psycopg2.connect(database=config.database,
                            user=config.user,
                            password=config.password)


@api.route('/help')
def get_help():
    return json.dumps(["get help"])

# Do these routes need to match the app routes?
# this query currently supports state search only, not the industry or name search
@api.route('/unions/') 
def get_unions():
    '''
    /search_unions/?[state_abbr=state_abbr]
    '''

    state_abbr = flask.request.args.get('state_abbr')
    
    query = """SELECT * FROM unions
            WHERE unions.region = '{}';""".format(state_abbr)

    union_list = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            union = {'id': row[0],
                    'union_name': row[1],
                    'abbr':row[2],
                    'unit':row[3],
                    'est_date':row[4],
                    'members':row[5],
                    'first_name':row[6],
                    'last_name':row[7],
                    'build_num':row[8],
                    'street_adr':row[9],
                    'city':row[10],
                    'region':row[11],
                    'zip':row[12]}
            union_list.append(union)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(union_list)

@api.route('/strikes/') 
def get_unions():
    '''
    /search_strikes/?[state_abbr=state_abbr]
    '''
    
    state_abbr = flask.request.args.get('state_abbr')
    
    query = """SELECT * FROM strikes
            WHERE strikes.state = '{}';""".format(state_abbr)

    strike_list = [] 
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            strike = {"id":row[0], 
                    "employer":row[1],  
                    "org":row[2],
                    "local":row[3],
                    "industry":row[4],
                    "BUS":row[5],
                    "locales":row[6],
                    "address":row[7],
                    "city":row[8],
                    "state":row[9],
                    "zip":row[10],
                    "participants":row[11],
                    "start_date":row[12],
                    "end_date":row[13],
                    "demands":row[14]}
   
            strike_list.append(union)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(union_list)
