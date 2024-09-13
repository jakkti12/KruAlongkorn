import sys
import cv2
import face_recognition
import mysql.connector
import hashlib

# Get the username, email, and password from the command-line arguments
username = sys.argv[1]
email = sys.argv[2]
password = sys.argv[3]
user_type = 'user'

# Hash the password using MD5
hashed_password = hashlib.md5(password.encode()).hexdigest()

staffId = 32  # Assuming this is a constant value

conn = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="root",
    database="face_db"
)

video_capture = cv2.VideoCapture(0)
register = False
face_data = None

while True:
    ok, frame = video_capture.read()
    small_frame = cv2.resize(frame, (0, 0), fx=1 / 4, fy=1 / 4)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_small_frame)
    
    for (top, right, bottom, left) in face_locations:
        cv2.rectangle(frame, (left * 4, top * 4), (right * 4, bottom * 4), (0, 0, 255), 2)
        if not register:
            register = True
            # 1. Get face data
            face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
            if face_encodings:
                face_data = face_encodings[0].tobytes()
                # Display a message to indicate registration is in progress
                cv2.putText(frame, "Face detected. Press 'q' to save...", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    
    if register and face_data:
        # Display message to prompt saving
        cv2.putText(frame, "Press 'q' to save data and exit.", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    
    cv2.imshow('Video', frame)
    
    # Wait for 'q' key press to save data and exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        if register and face_data:
            # Insert user data including faceData
            cursor = conn.cursor()
            sql = "INSERT INTO users (username, email, password, staffId, user_type, faceData) VALUES (%s, %s, %s, %s, %s, %s)"
            user_data = (username, email, hashed_password, staffId, user_type, face_data)
            cursor.execute(sql, user_data)
            insert_id = cursor.lastrowid
            print("Inserted record ID:", insert_id)
            conn.commit()
        break

video_capture.release()
cv2.destroyAllWindows()
conn.close()
