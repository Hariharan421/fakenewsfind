import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


# 1. Load dataset
data = pd.read_csv("../dataset.csv")

# 2. Get text and labels
X = data["text"]
y = data["label"]

# 3. Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# 4. Convert text into numbers using TF-IDF
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

X_train_vector = vectorizer.fit_transform(X_train)
X_test_vector = vectorizer.transform(X_test)

# 5. Train Machine Learning model
model = LogisticRegression()

model.fit(X_train_vector, y_train)

# 6. Test model
prediction = model.predict(X_test_vector)

accuracy = accuracy_score(y_test, prediction)

print("Model Accuracy:", round(accuracy * 100, 2), "%")

# 7. Save model
with open("model.pkl", "wb") as file:
    pickle.dump(model, file)

# 8. Save vectorizer
with open("vectorizer.pkl", "wb") as file:
    pickle.dump(vectorizer, file)

print("Model saved as model.pkl")
print("Vectorizer saved as vectorizer.pkl")