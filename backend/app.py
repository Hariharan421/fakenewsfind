from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

# Load model and vectorizer
with open("model.pkl", "rb") as file:
    model = pickle.load(file)

with open("vectorizer.pkl", "rb") as file:
    vectorizer = pickle.load(file)


@app.route("/")
def home():
    return "Fake News Detector API is running!"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    news = data.get("news", "")

    if not news:
        return jsonify({"error": "Please enter news text"}), 400

    # Convert news text into numbers
    news_vector = vectorizer.transform([news])

    # Make prediction
    prediction = model.predict(news_vector)[0]

    return jsonify({
        "prediction": prediction
    })


if __name__ == "__main__":
    app.run(debug=True)