import time
from flask import Flask, jsonify, request
from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import NoCardException
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('nfc_cards.db')
    c = conn.cursor()
    
    # Check if the table exists
    c.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cards'")
    if c.fetchone() is None:
        # Create the table if it doesn't exist
        c.execute('''CREATE TABLE cards
                     (uid TEXT PRIMARY KEY, username TEXT, role TEXT)''')
    else:
        # Check if the username column exists
        c.execute("PRAGMA table_info(cards)")
        columns = [column[1] for column in c.fetchall()]
        if 'username' not in columns:
            # Add the username column if it doesn't exist
            c.execute("ALTER TABLE cards ADD COLUMN username TEXT")
    
    conn.commit()
    conn.close()

# Call init_db() at the start of your application
init_db()

def connect_to_reader(reader):
    connection = reader.createConnection()
    while True:
        try:
            connection.connect()
            print("Card connected.")
            return connection
        except NoCardException:
            print("Waiting for card...")
            time.sleep(0.3)

def send_apdu(connection, apdu):
    data, sw1, sw2 = connection.transmit(apdu)
    print("Response:", toHexString(data))
    print("Status words: %02X %02X" % (sw1, sw2))
    return data, sw1, sw2

def get_card_uid():
    r = readers()
    if not r:
        return None, "No readers available"

    reader = r[0]
    max_attempts = 120 # Wait for up to 30 seconds
    for _ in range(max_attempts):
        try:
            connection = reader.createConnection()
            connection.connect()
            GET_UID_APDU = [0xFF, 0xCA, 0x00, 0x00, 0x00]
            data, sw1, sw2 = connection.transmit(GET_UID_APDU)
            connection.disconnect()
            
            if sw1 == 0x90 and sw2 == 0x00:
                return toHexString(data), None
        except NoCardException:
            time.sleep(0.3)  # Wait for 0.3 second before trying again
    
    return None, "Timeout: No card detected"

@app.route('/api/update_db', methods=['GET'])
def update_db():
    init_db()
    return jsonify({'message': 'Database updated successfully'}), 200

@app.route('/api/nfc_login', methods=['GET'])
def nfc_login():
    uid, error = get_card_uid()
    if error:
        return jsonify({'error': error}), 500

    conn = sqlite3.connect('nfc_cards.db')
    c = conn.cursor()
    c.execute("SELECT username, role FROM cards WHERE uid = ?", (uid,))
    result = c.fetchone()
    conn.close()

    if result:
        username, role = result
        return jsonify({'uid': uid, 'username': username, 'role': role}), 200
    else:
        return jsonify({'error': 'Card not registered'}), 403
@app.route('/api/register_card', methods=['POST'])
def register_card():
    data = request.json
    print("Received registration data:", data)
    username = data.get('username')
    role = data.get('role')
    
    if not username or not role:
        return jsonify({'error': 'Missing username or role'}), 400

    uid, error = get_card_uid()
    if error:
        return jsonify({'error': error}), 400

    if not uid:
        return jsonify({'error': 'Failed to read card UID'}), 400

    conn = sqlite3.connect('nfc_cards.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO cards (uid, username, role) VALUES (?, ?, ?)", (uid, username, role))
        conn.commit()
        print(f"Card registered: UID={uid}, Username={username}, Role={role}")
        return jsonify({'message': 'Card registered successfully', 'uid': uid}), 200
    except sqlite3.IntegrityError:
        print(f"Failed to register card: UID={uid} already exists")
        return jsonify({'error': 'Card already registered'}), 409
    finally:
        conn.close()

@app.route('/api/delete_card', methods=['POST'])
def delete_card():
    data = request.json
    uid = data.get('uid')
    
    if not uid:
        return jsonify({'error': 'Missing UID'}), 400

    conn = sqlite3.connect('nfc_cards.db')
    c = conn.cursor()
    c.execute("DELETE FROM cards WHERE uid = ?", (uid,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Card deleted successfully'}), 200

@app.route('/api/get_all_cards', methods=['GET'])
def get_all_cards():
    conn = sqlite3.connect('nfc_cards.db')
    c = conn.cursor()
    c.execute("PRAGMA table_info(cards)")
    columns = [column[1] for column in c.fetchall()]
    
    if 'username' in columns:
        c.execute("SELECT uid, username, role FROM cards")
        cards = [{'uid': row[0], 'username': row[1], 'role': row[2]} for row in c.fetchall()]
    else:
        c.execute("SELECT uid, role FROM cards")
        cards = [{'uid': row[0], 'username': 'Unknown', 'role': row[1]} for row in c.fetchall()]
    
    conn.close()
    return jsonify(cards), 200

if __name__ == '__main__':
    app.run(debug=True)