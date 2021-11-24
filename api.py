'''
    api.py
    Chloe Morscheck and Jake Martens
    9 November 2021

    Flask API to support the web application.
'''
import sys
import flask
import json

from werkzeug.datastructures import CharsetAccept
import config
import psycopg2

api = flask.Blueprint('api', __name__, template_folder='templates')

def get_connection():
    ''' Returns a connection to the database described in the
        config module. May raise an exception as described in the
        documentation for psycopg2.connect. '''
    return psycopg2.connect(database=config.database,
                            user=config.user,
                            password=config.password)


@api.route('/help')
def get_help():
    return flask.render_template('help.html')

@api.route('/states')
def get_states():
    query = """SELECT * FROM states"""
    states = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            state = {'abbr': row[0].strip(),
                    'state': row[1].strip()}
            states.append(state)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(states)

@api.route('/strike_industries')
def get_strike_industries():
    query = """SELECT DISTINCT strikes.industry FROM strikes"""
    industries = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            industry = row[0]
            industry = industry.split(',')
            print(industry)
            for item in industry:
                item = item.strip()
                if item not in industries:
                    industries.append(item)
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
    industries.sort()
    return json.dumps(industries)

@api.route('/unions/') 
def get_unions():
    '''
    /unions/?[state_abbr=state_abbr][city=city][name_query=name_query]
    '''
    state_abbr = flask.request.args.get('state_abbr')
    name = flask.request.args.get('name_query')
    city = flask.request.args.get('city')
    members = flask.request.args.get('members')
    if not name:
        name = ''
    if not state_abbr:
        state_abbr = ''
    if not city:
        city = ''
    name = name.upper()
    query = """SELECT * FROM unions
            WHERE unions.region LIKE '%{}%'
            AND unions.city ILIKE '%{}%'
            AND unions.union_name LIKE '%{}%'""".format(state_abbr, city, name)
    if members == 'max':
        query = query + """ AND unions.members > 1000000"""
    elif members != 'default' and members is not None:
        query = query + """ AND unions.members < {}""".format(members)
    query = query + ';'
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
        if union_list == []:
            union_list = ["None"]
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(union_list)

@api.route('/strikes/') 
def get_strikes():
    '''
    /strikes/?[state=state][industry=industry][end=end][company=company]
    '''
    state = flask.request.args.get('state')
    industry = flask.request.args.get('industry')
    end = flask.request.args.get('end')
    company = flask.request.args.get('company')
    if not state:
        state = ''
    query = """SELECT * FROM strikes
            WHERE strikes.state LIKE '%{}%'""".format(state)
    if industry:
        query = query + "AND strikes.industry LIKE '%{}%'".format(industry)
    if end == "true":
        query = query + "AND strikes.end_date LIKE '%{}%'".format('None')
    if company:
        query = query + "AND strikes.employer ILIKE '%{}%'".format(company)
    query = query + ';'
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
   
            strike_list.append(strike)
        cursor.close()
        connection.close()
        if strike_list == []:
            strike_list = ["None"]
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(strike_list)


@api.route('/cases/') 
def get_cases():
    '''
    /cases/?[state_abbr=state_abbr][name_query=name_query][case_number=case_number][region=region]
    '''
    state_abbr = flask.request.args.get('state_abbr')
    name = flask.request.args.get('name_query')
    case_number = flask.request.args.get('case_number')
    region = flask.request.args.get('region')
    if not name:
        name = ''
    if not state_abbr:
        state_abbr =''
    name = name.upper()
    state_abbr = state_abbr.upper()
    query = """SELECT * FROM cases
            WHERE cases.territory LIKE '%{}%'
            AND cases.case_name ILIKE '%{}%'""".format(state_abbr, name)
    if case_number:
        query = query + """AND cases.case_number = '{}'""".format(case_number)
    if region:
        if region != 'default':
            query = query + """AND cases.region LIKE '%{}%'""".format(region)
    query = query + ';'
    
    case_list = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            case = {'id': row[0],
                    'case_name': row[1],
                    'case_number':row[2],
                    'city':row[3],
                    'territory':row[4],
                    'date_filed':row[5],
                    'date_closed':row[6],
                    'region':row[7],
                    'current_status':row[8],
                    'reason_closed':row[9],
                    'representative':row[10]}
            case_list.append(case)
        cursor.close()
        connection.close()
        if case_list == []:
            case_list = ["None"]
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(case_list)    

@api.route('/regions')
def get_regions():
    query = """SELECT DISTINCT region FROM cases"""
    regions = []
    try:
        connection = get_connection()
        cursor = connection.cursor()
        cursor.execute(query)
        for row in cursor:
            regions.append(row[0][11:])
        cursor.close()
        connection.close()
    except Exception as e:
        print(e, file=sys.stderr)
    return json.dumps(regions)