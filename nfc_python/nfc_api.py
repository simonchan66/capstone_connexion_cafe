import time
from flask import Flask, jsonify
from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import NoCardException
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def connect_to_reader(reader):
    """ Continuously attempt to connect to the reader until a card is present. """
    connection = reader.createConnection()
    while True:
        try:
            connection.connect()
            print("Card connected.")
            return connection
        except NoCardException:
            print("Waiting for card...")
            time.sleep(0.3)  # Wait a second and try again

def send_apdu(connection, apdu):
    """ Send APDU command to the card and print the response. """
    data, sw1, sw2 = connection.transmit(apdu)
    print("Response:", toHexString(data))
    print("Status words: %02X %02X" % (sw1, sw2))
    return data, sw1, sw2

@app.route('/api/nfc_login', methods=['GET'])
def nfc_login():
    r = readers()
    if not r:
        return jsonify({'error': 'No readers available'}), 500

    reader = r[0]
    connection = connect_to_reader(reader)

    # Example APDU command to get UID
    GET_UID_APDU = [0xFF, 0xCA, 0x00, 0x00, 0x00]
    data, sw1, sw2 = send_apdu(connection, GET_UID_APDU)

    connection.disconnect()

    if sw1 == 0x90 and sw2 == 0x00:
        uid = toHexString(data)
        return jsonify({'uid': uid}), 200
    else:
        return jsonify({'error': 'Failed to get UID'}), 500

if __name__ == '__main__':
    app.run()