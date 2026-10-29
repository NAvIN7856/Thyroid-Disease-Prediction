import pandas as pd
import numpy as np
import pickle
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import accuracy_score
# df = pd.read_csv("c:\\Users\\navin\\Documents\\VSCode\\AIML\\Thyroid_Disease_Prediction\\backend\\thyroid.csv", header=None)
BASE_DIR = Path(__file__).resolve().parent
df = pd.read_csv(BASE_DIR / "thyroid.csv", header=None)
columns = [
    'age','sex','on_thyroxine','query_on_thyroxine',
    'on_antithyroid_medication','sick','pregnant',
    'thyroid_surgery','I131_treatment',
    'query_hypothyroid','query_hyperthyroid',
    'lithium','goitre','tumor','hypopituitary','psych',
    'TSH_measured','TSH',
    'T3_measured','T3',
    'TT4_measured','TT4',
    'T4U_measured','T4U',
    'FTI_measured','FTI',
    'TBG_measured','TBG',
    'referral_source','target'
]

df.columns = columns
df.replace('?', np.nan, inplace=True)
df.drop(
    [
        'TBG_measured','TBG',
        'T3_measured','TSH_measured',
        'TT4_measured','T4U_measured',
        'FTI_measured',
        'referral_source'
    ],
    axis=1,
    inplace=True
)
# Extract main label (A, B, C, ..., Z)
df['target'] = df['target'].str.extract('([A-Za-z]+)')
df['target'] = df['target'].fillna('Z')
df['target'] = df['target'].apply(lambda x: 0 if x == 'Z' else 1)
binary_cols = [
    'on_thyroxine','query_on_thyroxine',
    'on_antithyroid_medication','sick','pregnant',
    'thyroid_surgery','I131_treatment',
    'query_hypothyroid','query_hyperthyroid',
    'lithium','goitre','tumor','hypopituitary','psych'
]

df[binary_cols] = df[binary_cols].replace({'t':1, 'f':0})

df['sex'] = df['sex'].map({'M':1, 'F':2})
df['sex'].fillna(df['sex'].mode()[0], inplace=True)
from sklearn.impute import KNNImputer

imputer = KNNImputer(n_neighbors=3)

num_cols = ['TSH','T3','TT4','T4U','FTI']
df[num_cols] = imputer.fit_transform(df[num_cols])
features = [
    'age','sex','on_thyroxine','query_on_thyroxine',
    'on_antithyroid_medication','sick','pregnant',
    'thyroid_surgery','I131_treatment',
    'query_hypothyroid','query_hyperthyroid',
    'lithium','goitre','tumor','hypopituitary',
    'psych','TSH','T3','T4U','FTI'
]

X = df[features]
y = df['target']
scaler = MinMaxScaler()

scale_cols = ['age','sex','TSH','T3','T4U','FTI']
X[scale_cols] = scaler.fit_transform(X[scale_cols])
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.33,
    random_state=42
)
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
with open("backend/thyroid_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("backend/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
print(df)