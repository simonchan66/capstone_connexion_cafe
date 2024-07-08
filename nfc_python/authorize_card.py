from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import NoCardException
import time

def authorize_card(reader):
    try:
        connection = reader.createConnection()
        connection.connect()
        
        # Read the UID of the card
        GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]
        data, sw1, sw2 = connection.transmit(GET_UID)
        uid = data[:4]  # Assuming the UID is 4 bytes long
        
        print("Card UID:", toHexString(uid))
        
        # Try different keys
        KEYS = [
            [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
            [0xA0, 0xA1, 0xA2, 0xA3, 0xA4, 0xA5],
            [0xD3, 0xF7, 0xD3, 0xF7, 0xD3, 0xF7]
        ]
        
        for key in KEYS:
            # MIFARE Classic - authenticate with Key A for block 4
            # Block 4 is usually the first block of the second sector (Sector 1)
            AUTHENTICATE = [0xFF, 0x86, 0x00, 0x00, 0x05, 0x01, 0x00, 4, 0x60, 0x00] + key + uid
            
            data, sw1, sw2 = connection.transmit(AUTHENTICATE)
            print("Authentication response: %02X %02X" % (sw1, sw2))
            
            if sw1 == 0x90 and sw2 == 0x00:
                print("Authentication successful with key:", toHexString(key))
                # Write data to the card after successful authentication
                WRITE_AUTH_DATA_APDU = [0xFF, 0xD0, 0x00, 4, 0x10] + [i for i in range(1, 17)]  # Example data
                data, sw1, sw2 = connection.transmit(WRITE_AUTH_DATA_APDU)
                print("Write response:", toHexString(data))
                print("Write status words: %02X %02X" % (sw1, sw2))
                
                if sw1 == 0x90 and sw2 == 0x00:
                    print("Data written successfully")
                else:
                    print("Failed to write data")
                break
            else:
                print("Authentication failed with key:", toHexString(key))
        else:
            print("Authentication failed with all keys")
    except NoCardException:
        print("No card found, please present a card")
    except Exception as e:
        print("Error:", str(e))
    finally:
        try:
            connection.disconnect()
        except:
            pass

def listen_for_cards():
    while True:
        r = readers()
        if not r:
            print("No readers available")
        else:
            reader = r[0]
            print(f"Using reader: {reader}")
            authorize_card(reader)
        time.sleep(1)  # Wait for 1 second before checking again

if __name__ == '__main__':
    listen_for_cards()