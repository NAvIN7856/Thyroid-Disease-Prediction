from flask import Flask, request, jsonify
import numpy as np
import pickle
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # allow React to call Flask

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "thyroid_model.pkl")
scaler_path = os.path.join(BASE_DIR, "scaler.pkl")

model = pickle.load(open(model_path, "rb"))
scaler = pickle.load(open(scaler_path, "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [
        data["age"],
        data["sex"],
        data["on_thyroxine"],
        data["query_on_thyroxine"],
        data["on_antithyroid_medication"],
        data["sick"],
        data["pregnant"],
        data["thyroid_surgery"],
        data["I131_treatment"],
        data["query_hypothyroid"],
        data["query_hyperthyroid"],
        data["lithium"],
        data["goitre"],
        data["tumor"],
        data["hypopituitary"],
        data["psych"],
        data["TSH"],
        data["T3"],
        data["T4U"],
        data["FTI"]
    ]

    X = np.array(features).reshape(1, -1)

    # scale numeric features
    scale_idx = [0,1,16,17,18,19]
    X[:, scale_idx] = scaler.transform(X[:, scale_idx])

    pred = model.predict(X)[0]

    result = "No Thyroid Detected" if pred == 0 else "Thyroid Detected"

    return jsonify({"prediction": result})

@app.route("/predict-bulk", methods=["POST"])
def predict_bulk():
    data = request.json  # list of rows

    results = []

    for row in data:
        features = [
            row["age"], row["sex"], row["on_thyroxine"],
            row["query_on_thyroxine"], row["on_antithyroid_medication"],
            row["sick"], row["pregnant"], row["thyroid_surgery"],
            row["I131_treatment"], row["query_hypothyroid"],
            row["query_hyperthyroid"], row["lithium"], row["goitre"],
            row["tumor"], row["hypopituitary"], row["psych"],
            row["TSH"], row["T3"], row["T4U"], row["FTI"]
        ]

        X = np.array(features).reshape(1, -1)
        scale_idx = [0,1,16,17,18,19]
        X[:, scale_idx] = scaler.transform(X[:, scale_idx])

        pred = model.predict(X)[0]
        result = "Thyroid Detected" if pred == 1 else "No Thyroid"

        results.append(result)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)

# Age: 29
# Sex: 2
# TSH: 1.6
# T3: 1.9
# T4U: 0.97
# FTI: 113