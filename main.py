from datetime import datetime
from google.cloud import datastore
from google.cloud.datastore.query import PropertyFilter
from flask import Flask, render_template
from flask import Flask, render_template, request
from flask import Flask
from flask_cors import CORS
from flask import jsonify, session
from authlib.integrations.flask_client import OAuth
from flask import url_for, redirect
import os # for using env stuff
from dotenv import load_dotenv # enviornment stuff
from flask import session
from flask import g
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request

# constants to help with debugging in case misspell, it doesn't give route error
APPOINTMENTS = 'appointments'
RESERVATIONS = 'reservations'
USERS = 'users'
REQUEST_MISSING_ATTRIBUTE = {"Error": "The request body is missing at least one of the required attributes"}
APPOINTMENT_NOT_FOUND = {"Error": "No appointment with this appointment_id exists"}
USER_NOT_FOUND = {"Error": "No user with this user_id exists"}
RESERVATION_NOT_FOUND = {"Error": "No reservation with this reservation_id exists"}
CLINICS = 'clinics'


app = Flask(__name__)
# load the key and ID from the enviornment
load_dotenv()
client_id = os.getenv("CLIENT_ID")
secret_key = os.getenv("CLIENT_SECRET")
app.secret_key = os.getenv("APP_SECRET_KEY") # ?? just random?
BACKEND_URL = os.getenv("BACKEND_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")

CORS(app, 
     origins=[FRONTEND_URL],
     supports_credentials=True)

client = datastore.Client(project='smart-spay-neuter-dispatcher')


# credit https://docs.authlib.org/en/stable/oauth2/client/web/flask.html
oauth = OAuth(app)
oauth.register(
    'google',
    client_id = client_id,
    client_secret = secret_key,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'}
)

@app.route("/")
def index():
    return "Please navigate to /login to use this API"

# credit: https://www.itflashcards.com/cheatsheets/flask/
@app.before_request
def load_user():
    user_id = session.get("user")
    g.user = user_id

# credit: https://www.itflashcards.com/cheatsheets/flask/
app.config.update(
    SESSION_COOKIE_SECURE=False, # TODO change back to true when not local
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_NAME="myapp_session",
)

####################################### OAUTH #####################################################
# credit: https://docs.authlib.org/en/stable/oauth2/client/web/flask.html
@app.route('/login')
def login():
    redirect_uri = url_for('authorize', _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

# credit: https://testdriven.io/blog/flask-spa-auth/ 
@app.route("/api/data", methods=["GET"])
#@login_required
def user_data():
    user_id = session.get('user_id')
    if user_id:
        return jsonify(
            {"first_name": session.get('first_name'),
            "last_name": session.get('last_name'),
            'email': session.get('email'),
            'user_id': user_id
            })
    else:
        return redirect(FRONTEND_URL + '/login') # no user, log in instead?

# credit: https://testdriven.io/blog/flask-spa-auth/ 
@app.route("/api/getsession")
def check_session():
    if session.get('user_id'):
        return jsonify({"login": True})
    return jsonify({"login": False})

# get current user https://testdriven.io/blog/flask-spa-auth/ 
# def get_user(user_id: int):
#    for user in users:
#        if int(user["id"]) == int(user_id):
#            return user
#    return None

# credit: https://docs.authlib.org/en/stable/oauth2/client/web/flask.html
@app.route('/authorize')
def authorize():
    token = oauth.google.authorize_access_token()
    userinfo = token['userinfo']
    session['user_id'] = userinfo['sub'] # sub = userid?
    # do something with the token and profile
    # see if user id is already registered?
    saved_user_id_key = client.key(USERS, session['user_id'])
    saved_user_id = client.get(saved_user_id_key)
    if saved_user_id is None: # no user saved, store it in database
        new_key = client.key(USERS, userinfo['sub'])
        new_profile = datastore.Entity(key=new_key)
        new_profile['user_email'] = userinfo['email']
        new_profile['first_name'] = userinfo.get('given_name')
        new_profile['last_name'] = userinfo.get('family_name')
        client.put(new_profile)
    print(client.project)
    print(client.get(client.key(USERS, '105634907246656913667')))
    # now whether or not user exists or not, gather their info from database?
    session['user_email'] = userinfo['email']
    session['first_name'] = userinfo.get('given_name')
    session['last_name'] = userinfo.get('family_name')
    return redirect(FRONTEND_URL + '/profile') # redirect to the profile page


# credit: https://docs.authlib.org/en/stable/oauth2/client/web/flask.html
@app.route('/logout')
#@login_required
def logout():
    # Retrieve the ID token you stored during login
    #id_token = session.pop('id_token', None)
    #session.pop("user_id", None)
    session.clear()
    # credit: https://www.itflashcards.com/cheatsheets/flask/ 
    session.permanent = True                       # respects PERMANENT_SESSION_LIFETIME
    #app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)
    return redirect(
        FRONTEND_URL + '/login'
    )

# credit https://docs.authlib.org/en/stable/oauth2/client/web/flask.html
@app.route('/logged-out')
def logged_out():
    state_data = oauth.google.validate_logout_response()
    return 'You have been logged out.'


# references for following API requests: https://canvas.oregonstate.edu/courses/2061616/pages/exploration-crud-operations-in-datastore?module_item_id=27019561
############################## APPOINTMENTS ################################################

# Note- each day has x many appointments all with the same check-in time.
# id should be the clinicID + date, and only info that is needed is the check-in time and the appointment slot count

# CREATE AN APPOINTMENT
@app.route('/' + APPOINTMENTS, methods=["POST"])
def post_appointment():
    content = request.get_json()
    required_content=['clinic_id', 'date', 'time', 'total_slots', 'slots_available']
    # make sure body has all the content before attempting to add
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    # make new key for database
    my_new_key = str(content['clinic_id']) + '+' + content['date'] # that way only one appointment cluster can exist per day?
    new_key = client.key(APPOINTMENTS, my_new_key)
    new_appointment = datastore.Entity(key=new_key)
    new_appointment.update({
        'clinic_id': str(content['clinic_id']),
        'date': content['date'],
        'time': content['time'],
        'total_slots': content['total_slots'],
        'slots_available': content['slots_available']
    })
    client.put(new_appointment)
    new_appointment['id'] = new_appointment.key.name # TODO: NEED TO DO THIS TO USER_ID AS WELL??? MANUALLY MAKE THE KEY BY NAME?
    return (new_appointment, 201)

# GET AN APPOINTMENT
@app.route('/' + 'appointment' + '/<string:id>', methods=["GET"])
def get_appointment(id):
    appointment_key = client.key(APPOINTMENTS, id)
    appointment = client.get(appointment_key)
    if appointment is None:
        return APPOINTMENT_NOT_FOUND, 404
    appointment['id'] = appointment.key.id
    return appointment, 200

# GET ALL APPOINTMENTS FOR A USER ID (works for either user or clinic currently cuz same id database)
@app.route('/' + APPOINTMENTS + '/<string:id>', methods=['GET'])
def get_all_appointments(id):
    query = client.query(kind=APPOINTMENTS)
    query.add_filter(filter=PropertyFilter("clinic_id", "=", id))
    results = list(query.fetch())
    events = [] # format for the calendar library in frontend to use
    for r in results:
        r['id'] = r.key.id
        events.append({
            "title": f"{r.get('slots_available', 0)}/{r.get('total_slots', 0)} slots available", # display like x/y slots available
            "date": r['date']
        })
    return events, 200


# EDIT AN APPOINTMENT
@app.route('/' + APPOINTMENTS + '/<int:id>', methods=['PUT'])
def put_appointment(id):    
    content = request.get_json()
    appointment_key = client.key(APPOINTMENTS, id)
    appointment = client.get(appointment_key)
    # make sure appointment id even exists
    if appointment is None:
        return APPOINTMENT_NOT_FOUND, 404
    # make sure the body has all the required content in it before editing
    required_content = ['clinic_id', 'date']
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    # it exists and has required content to edit
    appointment.update({
        'clinic_id': int(content['clinic_id']),
        'date': content['date'],
        'time': content['time'],
        'total_slots': content['total_slots'],
        'slots_available': content['slots_available']
    })
    client.put(appointment)
    appointment['id'] = appointment.key.id
    return appointment, 200

# DELETE AN APPOINTMENT
@app.route('/' + APPOINTMENTS + '/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    appointment_key = client.key(APPOINTMENTS, id)
    appointment = client.get(appointment_key)
    # make sure appointment even exists
    if not appointment:
        return APPOINTMENT_NOT_FOUND, 404
    client.delete(appointment_key)
    return appointment, 204

############################### USERS ################################################
# CREATE A USER
@app.route('/' + USERS, methods=["POST"])
def create_user():
    content = request.get_json()
    required_content = ['first_name', 'last_name', 'email', 'phone', 'address']
    # make sure body has all the content before attempting to add
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    # make new key for database
    new_key = client.key(USERS)
    new_user = datastore.Entity(key=new_key)
    new_user.update({
        'first_name': content['first_name'],
        'last_name': content['last_name'],
        'email': content['email'],
        'phone': content['phone'],
        'address': content['address']
    })
    client.put(new_user)
    new_user['id'] = new_user.key.id
    print(f"INSIDE CREATE A USER FUNCTION!!!!!!!!!!!!!!!!!!!!! id: {new_user['id']}\n")
    return (new_user, 201)

# GET A USER
@app.route('/' + USERS + '/<int:id>', methods=["GET"])
def get_user(id):
    user_key = client.key(USERS, id)
    users = client.get(user_key)
    if users is None:
        return USER_NOT_FOUND, 404
    users['id'] = users.key.id
    print(f"USER ID !!!!!!!!!!!!!!: {users.key.id}")
    return users, 200

# GET ALL USERS
@app.route('/' + USERS, methods=["GET"])
def get_users():
    query = client.query(kind=USERS)
    results = list(query.fetch())
    for r in results:
        r['id'] = r.key.id
    return results, 200

# EDIT A USER
@app.route('/' + USERS + '/<int:id>', methods = ['PUT'])
def put_user(id):
    content = request.get_json()
    required_content = ['first_name', 'last_name', 'email', 'phone', 'address']
    # make sure body has all the content before attempting to add
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    # get the user key
    user_key = client.key(USERS, id)
    user = client.get(user_key)
    if user is None:
        return USER_NOT_FOUND, 404
    user.update({
        'first_name': content['first_name'],
        'last_name': content['last_name'],
        'email': content['email'],
        'phone': content['phone'],
        'address': content['address']
    })
    client.put(user)
    user['id'] = user.key.id
    return (user, 200)

# DELETE A USER
@app.route('/' + USERS + '/<int:id>', methods = ['DELETE'])
def delete_user(id):
    user_key = client.key(USERS, id)
    user = client.get(user_key)
    # make sure it exists first
    if user is None:
        return USER_NOT_FOUND, 404
    client.delete(user_key)
    return user, 204
    
############################### RESERVATIONS ########################################
# Create Reservation
@app.route('/' + RESERVATIONS, methods = ["POST"])
def create_reservation():
    content = request.get_json()
    required_content = ['user_id', 'clinic_id', 'appointment_id', 'patient_details', 'date', 'time']
    # make sure body has content before adding
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    new_key = client.key(RESERVATIONS)
    new_reservation = datastore.Entity(key=new_key)
    new_reservation.update({
        'user_id': int(content['user_id']),
        'clinic_id': int(content['clinic_id']),
        'appointment_id': int(content['appointment_id']),
        'patient_details': content['patient_details'],
        'date': content['date'],
        'time': content['time']
    })
    client.put(new_reservation)
    new_reservation['id'] = new_reservation.key.id
    return (new_reservation, 201)

# GET A RESERVATION
@app.route('/' + RESERVATIONS + '/<int:id>', methods=['GET'])
def get_reservation(id):
    reservation_key = client.key(RESERVATIONS, id)
    reservation = client.get(reservation_key)
    if reservation is None:
        return RESERVATION_NOT_FOUND, 404
    reservation['id'] = reservation.key.id
    return reservation, 200

# EDIT A RESERVATION
@app.route('/' + RESERVATIONS, methods = ["PUT"])
def put_reservation():
    content = request.get_json()
    required_content = ['user_id', 'clinic_id', 'appointment_id', 'patient_details', 'date', 'time']
    # make sure body has content before adding
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    reservation_key = client.key(RESERVATIONS)
    reservation = datastore.Entity(key=reservation_key)
    # make sure reservation exists before editing
    if reservation is None:
        return RESERVATION_NOT_FOUND, 404
    reservation.update({
        'user_id': int(content['user_id']),
        'clinic_id': int(content['clinic_id']),
        'appointment_id': int(content['appointment_id']),
        'patient_details': content['patient_details'],
        'date': content['date'],
        'time': content['time']
    })
    client.put(reservation)
    reservation['id'] = reservation.key.id
    return (reservation, 200)

# LIST A USER'S RESERVATIONS
@app.route('/' + USERS + '/<int:user_id>/reservations', methods=['GET'])
def list_users_reservations(user_id):
    query = client.query(kind=RESERVATIONS)
    query.add_filter('user_id', '=', user_id)
    results = list(query.fetch())
    for r in results:
        r['id'] = r.key.id
    return results, 200

# LIST A CLINIC'S RESERVATIONS
@app.route('/' + CLINICS + '/<int:clinic_id>/reservations', methods=['GET'])
def list_clinics_reservations(clinic_id):
    query = client.query(kind=RESERVATIONS)
    query.add_filter('clinic_id', '=', clinic_id)
    results = list(query.fetch())
    for r in results:
        r['id'] = r.key.id
    return results, 200

# DELETE A RESERVATION
@app.route('/' + RESERVATIONS + '<int:id>', methods=["DELETE"])
def delete_reservation(id):
    reservation_key = client.key(RESERVATIONS, id)
    reservation = datastore.Entity(key=reservation_key)
    # make sure reservation exists before deleting
    if reservation is None:
        return (RESERVATION_NOT_FOUND, 404)
    client.delete(reservation_key)
    return reservation, 204

############################### HELPER FUNCTIONS #####################################

def body_has_content(content, required_content):
    # MAKE SURE BODY IS NOT MISSING REQUIRED CONTENT
    for attribute in required_content:
        if attribute not in content:
            return False
    return True

if __name__ == "__main__":
    # only for local running
    app.run(host="127.0.0.1", port=8001, debug=True)