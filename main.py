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

def body_has_content(content, required_content):
    # MAKE SURE BODY IS NOT MISSING REQUIRED CONTENT
    for attribute in required_content:
        if attribute not in content:
            return False
    return True

if __name__ == "__main__":
    # only for local running
    app.run(host="127.0.0.1", port=8001, debug=True)