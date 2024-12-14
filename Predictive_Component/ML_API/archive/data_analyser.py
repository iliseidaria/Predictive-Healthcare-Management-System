import numpy as np
import pandas as pd
from scipy.stats import norm


YesNoFeatures = 'Fever,Cough,Fatigue,Difficulty Breathing'.split(',')
OrdinalFeatures = 'Blood Pressure,Cholesterol Level'.split(',')

def load_csv_to_dataframe(file_path):
    try:
        df = pd.read_csv(file_path)
        print("CSV file successfully loaded into a DataFrame.")
        return df
    except FileNotFoundError:
        print(f"Error: File not found at the specified path: {file_path}")
    except pd.errors.ParserError:
        print("Error: Failed to parse the CSV file. Check the file's formatting.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


def calculate_priors(df, disease_col):
    """Calculate prior probabilities P(D) for each disease."""
    priors = df[disease_col].value_counts(normalize=True).to_dict()
    return priors

def calculate_likelihoods(df, feature_cols, disease_col):
    """Calculate likelihoods P(X_i | D) for each feature and disease."""
    likelihoods = {}
    diseases = df[disease_col].unique()

    for disease in diseases:
        likelihoods[disease] = {}
        subset = df[df[disease_col] == disease]
        for feature in feature_cols:
            if df[feature].dtype in [np.float64, np.int64]:  # Continuous features
                mu = subset[feature].mean()
                sigma = subset[feature].std()
                likelihoods[disease][feature] = (mu, sigma)
            else:  # Categorical features
                if feature in YesNoFeatures:  # Specify your Yes/No columns
                    counts = subset[feature].value_counts(normalize=True).to_dict()
                    likelihoods[disease][feature] = counts
                elif feature in OrdinalFeatures:  # Specify your Ordinal columns
                    # Map ordinal values to numerical values
                    ordinal_map = {'Normal': 0, 'Low': 1, 'High': 2}
                    subset.loc[:, feature] = subset[feature].map(ordinal_map)

                    mu = subset[feature].mean()
                    sigma = subset[feature].std()
                    likelihoods[disease][feature] = (mu, sigma)
                else:
                    counts = subset[feature].value_counts(normalize=True).to_dict()
                    likelihoods[disease][feature] = counts
    return likelihoods


def compute_posterior(input_data, priors, likelihoods, feature_cols):
    """Calculate posterior probabilities P(D | X) for each disease."""
    posteriors = {}
    for disease, prior in priors.items():
        posterior = prior
        for feature, value in input_data.items():
            if feature in likelihoods[disease]:
                if isinstance(value, (float, int)):
                    mu, sigma = likelihoods[disease][feature]
                    prob = norm.pdf(value, mu, sigma) if sigma > 0 else 1e-6
                else:
                    if feature in YesNoFeatures:
                        prob = likelihoods[disease][feature].get(value, 1e-6)
                    elif feature in OrdinalFeatures:
                        prob = norm.pdf(value, likelihoods[disease][feature][0], likelihoods[disease][feature][1]) if likelihoods[disease][feature][1] > 0 else 1e-6
                    else:
                        prob = likelihoods[disease][feature].get(value, 1e-6)
                posterior *= prob
        posteriors[disease] = posterior

    # Normalize posteriors to sum to 1
    total = sum(posteriors.values())
    for disease in posteriors:
        posteriors[disease] /= total
    return posteriors

# Example dataset
'''
data = {'Disease': ['Flu', 'Cold', 'Flu', 'COVID', 'Cold'],
        'Fever': [1, 0, 1, 1, 0],
        'Cough': [1, 1, 0, 1, 0],
        'Age': [30, 22, 25, 40, 35]}
df = pd.DataFrame(data)
'''
'''
# Define columns
disease_col = 'Disease'
feature_cols = list(df.columns)

# Calculate priors and likelihoods
priors = calculate_priors(df, disease_col)
likelihoods = calculate_likelihoods(df, feature_cols, disease_col)

# Example input data for prediction
new_patient = {'Fever': 'Yes', 'Cough': 'No', 'Age': 28}

# Compute posterior probabilities
posteriors = compute_posterior(new_patient, priors, likelihoods, feature_cols)
'''
def get_answer(patientAux):
  path = '../Disease_symptom_and_patient_profile_dataset.csv'
  disease_col = 'Disease'
  df = load_csv_to_dataframe(path)

  if df is not None:
    print(df.head())

  feature_cols = list(df.columns)

  # Calculate priors and likelihoods
  priors = calculate_priors(df, disease_col)
  likelihoods = calculate_likelihoods(df, feature_cols, disease_col)
  fp = open('../res.txt', 'a')
  fp.write(f'\n\n{likelihoods}\n\n')
  posteriors = compute_posterior(patientAux, priors, likelihoods, feature_cols)
  answer = ''

  fp = open('../res.txt', 'a')
  print("Posterior probabilities:", posteriors)
  for posterior in posteriors.keys():
    fp.write(f'{posterior} {posteriors[posterior]:.15f}\n')
    answer +=f'{posterior} {posteriors[posterior]:.15f}\n'
  return answer


def get_data_from_med_recs(medical_records):
  initial_data = {}
  path = '../Disease_symptom_and_patient_profile_dataset.csv'
  disease_col = 'Disease'
  df = load_csv_to_dataframe(path)
  feature_cols = list(df.columns)
  for col in feature_cols:
    if col not in YesNoFeatures and col not in OrdinalFeatures:
      continue
    occurence = 0
    for rec in medical_records:
      for note in rec.notes:
        if str(note).lower().find(str(col)) > -1:
          occurence += 1
      for diagnosis in rec.diagnosis:
        if str(diagnosis).lower().find(str(col)) > -1:
          occurence += 1
    if col in YesNoFeatures:
      initial_data[col] = 'Yes' if occurence > 0 else 'No'
    else:
      initial_data[col] = 'Normal' if occurence == 0 else ('Low' if occurence <2 else 'High')
  return initial_data
