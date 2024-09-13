import cv2
import face_recognition
import pickle
import os
import sys

save_dir = "../../app/images"

def capture_face(id):
    print(f"Starting face capture... Press 'f' to register the face and 'q' to quit. Saving to {save_dir}")

    video_capture = cv2.VideoCapture(0)
    register = False

    while True:
        ok, frame = video_capture.read()
        if not ok:
            break

        small_frame = cv2.resize(frame, (0, 0), fx=1 / 4, fy=1 / 4)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_small_frame)

        for (top, right, bottom, left) in face_locations:
            cv2.rectangle(frame, (left * 4, top * 4), (right * 4, bottom * 4), (0, 0, 255), 2)

            if not register and cv2.waitKey(1) & 0xFF == ord('f'):
                register = True
                face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
                face_data = face_encodings[0]

                face_file = os.path.join(save_dir, f'face_data_{id}.pkl')
                with open(face_file, 'wb') as f:
                    pickle.dump(face_data, f)

                print(f"Face data saved to file: {face_file}")
                video_capture.release()
                cv2.destroyAllWindows()
                return face_file

        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    user_id = sys.argv[1] if len(sys.argv) > 1 else input("Enter user ID: ")

    if not os.path.exists(save_dir):
        os.makedirs(save_dir)

    capture_face(user_id)
