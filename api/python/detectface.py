import cv2
import face_recognition
import mysql.connector
import numpy as np
import torch
from datetime import datetime, time, timedelta
import pytz

# Set up Thailand timezone
THAILAND_TZ = pytz.timezone('Asia/Bangkok')

# Check face database connection
conn = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    password="root",
    database="face_db"
)

cursor = conn.cursor(dictionary=True)

# Load all faces
cursor.execute('''
SELECT f.staffId, s.displayName name, f.id faceId, f.faceData 
FROM staffs s
  JOIN faces f ON f.staffId=s.id''')
faces = cursor.fetchall()

# Convert all faces into a single tensor and move to GPU
all_faces = torch.stack([torch.tensor(np.frombuffer(face["faceData"], dtype=np.float64)).to('cuda') for face in faces])
print("Load all faces done")

video_capture = cv2.VideoCapture(0)
print("Camera ready")

def get_last_check_in_time(staff_id):
    cursor.execute('''
    SELECT MAX(time) AS last_check_in
    FROM check_in
    WHERE staffId = %s
    ''', (staff_id,))
    result = cursor.fetchone()
    last_check_in = result['last_check_in']
    if last_check_in:
        last_check_in = last_check_in.astimezone(THAILAND_TZ)
    return last_check_in

def is_within_check_in_time():
    now = datetime.now(THAILAND_TZ).time()
    start_time = time(8, 0)  # 8:00 AM
    end_time = time(20, 0)   # 6:00 PM
    return start_time <= now <= end_time

def display_message(frame, message, duration=5):
    end_time = datetime.now(THAILAND_TZ) + timedelta(seconds=duration)
    while datetime.now(THAILAND_TZ) < end_time:
        cv2.putText(frame, message, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

while True:
    ok, frame = video_capture.read()
    original_frame = frame.copy()  # Capture the original frame without any drawings
    small_frame = cv2.resize(frame, (0, 0), fx=1 / 4, fy=1 / 4)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    face_locations = face_recognition.face_locations(rgb_small_frame)  # CPU operation
    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)  # CPU operation

    for face_encoding, face_location in zip(face_encodings, face_locations):
        # Convert face encoding to torch tensor and move to GPU
        face_encoding = torch.tensor(face_encoding).to('cuda')

        # Calculate the distance between the face encoding and all loaded faces
        face_distances = torch.norm(all_faces - face_encoding, dim=1)

        min_index = torch.argmin(face_distances).item()
        staff_id = faces[min_index]["staffId"]
        name = faces[min_index]["name"]

        # Draw a red rectangle around the face
        top, right, bottom, left = face_location
        cv2.rectangle(frame, (left * 4, top * 4), (right * 4, bottom * 4), (0, 0, 255), 2)
        cv2.putText(frame, name, (left * 4, top * 4 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

        # Check the last check-in time
        last_check_in_time = get_last_check_in_time(staff_id)
        now = datetime.now(THAILAND_TZ)

        if is_within_check_in_time():
            if last_check_in_time is None or last_check_in_time.date() != now.date():
                # Insert check-in data into the database
                cursor.execute('''
                INSERT INTO check_in (staffId, time) VALUES (%s, %s)
                ''', (staff_id, now))
                conn.commit()

                # Crop and save the face image
                cropped_face = original_frame[top * 4:bottom * 4, left * 4:right * 4]
                cv2.imwrite(f'nodejs/api/app2/images/{staff_id}_{now.strftime("%Y%m%d_%H%M%S")}.jpg', cropped_face)

                # Display success message for 5 seconds
                display_message(frame, 'Check-in success', duration=5)
            else:
                # Display message if check-in was already done today
                cv2.putText(frame, 'Already registered', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
        else:
            # Display message if outside check-in window
            cv2.putText(frame, 'Check-in time is over', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)

    cv2.imshow('Video', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
conn.close()
