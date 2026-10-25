from datetime import datetime
from google.cloud import datastore
from flask import Flask, render_template
from flask import Flask, render_template, request

# references for API requests: https://canvas.oregonstate.edu/courses/2061616/pages/exploration-crud-operations-in-datastore?module_item_id=27019561

app = Flask(__name__)

client = datastore.Client()

# constants to help with debugging in case I misspell, it doesn't give me a route error
APPOINTMENTS = 'appointments'
RESERVATIONS = 'reservations'
USERS = 'users'
REQUEST_MISSING_ATTRIBUTE = {"Error": "The request body is missing at least one of the required attributes"}
APPOINTMENT_NOT_FOUND = {"Error": "No appointment with this appointment_id exists"}
USER_NOT_FOUND = {"Error": "No user with this user_id exists"}
RESERVATION_NOT_FOUND = {"Error": "No reservation with this reservation_id exists"}
CLINICS = 'clinics'

@app.route("/")
def index():
    return "Please navigate to /appointments to use this API"

############################## APPOINTMENTS ################################################
# CREATE AN APPOINTMENT
@app.route('/' + APPOINTMENTS, methods=["POST"])
def post_appointment():
    content = request.get_json()
    required_content=['clinic_id', 'date']
    # make sure body has all the content before attempting to add
    if body_has_content(content, required_content) is False:
        return REQUEST_MISSING_ATTRIBUTE, 400
    # make new key for database
    new_key = client.key(APPOINTMENTS)
    new_appointment = datastore.Entity(key=new_key)
    new_appointment.update({
        'clinic_id': int(content['clinic_id']),
        'date': content['date']
    })
    client.put(new_appointment)
    new_appointment['id'] = new_appointment.key.id
    return (new_appointment, 201)

# GET AN APPOINTMENT
@app.route('/' + APPOINTMENTS + '/<int:id>', methods=["GET"])
def get_appointment(id):
    appointment_key = client.key(APPOINTMENTS, id)
    appointment = client.get(appointment_key)
    if appointment is None:
        return APPOINTMENT_NOT_FOUND, 404
    appointment['id'] = appointment.key.id
    return appointment, 200

# GET ALL APPOINTMENTS
@app.route('/' + APPOINTMENTS, methods=['GET'])
def get_all_appointments():
    # POINTLESS, WILL NEVER USE???
    pass

# EDIT AN APPOINTMENT
@app.route('/' + APPOINTMENTS + '/<int:id>', methods=['PUT'])
def edit_appointment(id):    
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
        'date': content['date']
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
    return (new_user, 201)

# GET A USER
@app.route('/' + USERS + '/<int:id>', methods=["GET"])
def get_user(id):
    user_key = client.key(USERS, id)
    users = client.get(user_key)
    if users is None:
        return USER_NOT_FOUND, 404
    users['id'] = users.key.id
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
def edit_user(id):
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

# left off here ^
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