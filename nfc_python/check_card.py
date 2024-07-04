from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import CardConnectionException

def identify_card_type(connection):
    # Try MIFARE Classic Authentication (using default key)
    MIFARE_AUTH = [0xFF, 0x88, 0x00, 0x04, 0x60, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]
    DESFIRE_GET_VERSION = [0x90, 0x60, 0x00, 0x00, 0x00]

    try:
        # Test for MIFARE Classic
        connection.transmit(MIFARE_AUTH)
        print("MIFARE Classic or compatible")
    except CardConnectionException:
        try:
            # Test for DESFire
            connection.transmit(DESFIRE_GET_VERSION)
            print("MIFARE DESFire or compatible")
        except CardConnectionException:
            print("Card type not identified or not supported")

def main():
    r = readers()
    if not r:
        print("No readers found")
        return

    reader = r[0]
    print(f"Using reader: {reader}")

    try:
        connection = reader.createConnection()
        connection.connect()
        identify_card_type(connection)
    except Exception as e:
        print("Error reading card:", str(e))

if __name__ == '__main__':
    main()