from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

# Load the pre-trained garbage classification model
MODEL_PATH = "model/garbage_classification_model.h5"
model = load_model(MODEL_PATH)

# Define class labels
CLASS_LABELS = ['Cardboard', 'Glass', 'Metal', 'Paper', 'Plastic', 'Trash']

@app.route("/")
def index():
    """Serve the frontend."""
    return render_template("index.html")

@app.route("/classify", methods=["POST"])
def classify_image():
    """Handle image classification."""
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    if not file:
        return jsonify({"error": "File not found"}), 400

    # Save the image temporarily
    file_path = "temp_image.jpg"
    file.save(file_path)

    # Preprocess the image
    try:
        image = load_img(file_path, target_size=(224, 224))  # Adjust size based on your model
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0) / 255.0  # Normalize

        # Predict the class
        predictions = model.predict(image)
        class_index = np.argmax(predictions[0])
        classification = CLASS_LABELS[class_index]

        # Remove the temporary image
        os.remove(file_path)

        return jsonify({"class": classification})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
