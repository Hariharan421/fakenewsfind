from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)

# Allow requests from your GitHub Pages frontend
CORS(app)

# Get the folder where this app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model
with open(os.path.join(BASE_DIR, "model.pkl"), "rb") as file:
    model = pickle.load(file)

# Load vectorizer
with open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb") as file:
    vectorizer = pickle.load(file)


@app.route("/")
def home():
    return jsonify({
        "message": "Fake News Detector API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "news" not in data:
        return jsonify({
            "error": "Please provide news text"
        }), 400

    news = data["news"].strip()

    if not news:
        return jsonify({
            "error": "News text cannot be empty"
        }), 400

    # Convert text using TF-IDF
    news_vector = vectorizer.transform([news])

    # Predict
    prediction = model.predict(news_vector)[0]

    return jsonify({
        "prediction": str(prediction)
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)