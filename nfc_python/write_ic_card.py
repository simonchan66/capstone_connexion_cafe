from smartcard.System import readers
from smartcard.util import toHexString
from smartcard.Exceptions import NoCardException

def write_to_card(reader, block_number, data_bytes):
    try:
        connection = reader.createConnection()
        connection.connect()
        
        # Example APDU command for writing to a memory card
        # CLA, INS, P1, P2, Lc, Data
        WRITE_COMMAND = [0x00, 0xD6, 0x00, block_number, len(data_bytes)] + data_bytes
        data, sw1, sw2 = connection.transmit(WRITE_COMMAND)
        
        if sw1 == 0x90 and sw2 == 0x00:
            print("Write successful")
        else:
            print("Write failed with status:", sw1, sw2)

    except NoCardException:
        print("No card found, please present a card")
    except Exception as e:
        print("Error:", str(e))
    finally:
        try:
            connection.disconnect()
        except:
            pass

def main():
    r = readers()
    if not r:
        print("No readers available")
        return
    
    reader = r[0]
    print(f"Using reader: {reader}")
    
    # Example: Write bytes to block 1
    write_to_card(reader, 1, [0x12, 0x34, 0x56, 0x78])

if __name__ == '__main__':
    main()