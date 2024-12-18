import pandas as pd
from scipy.stats import norm

# Define feature categories
YesNoFeatures = 'Fever,Cough,Fatigue,Difficulty Breathing'.split(',')
OrdinalFeatures = 'Blood Pressure,Cholesterol Level'.split(',')


def calculate_priors(df, disease_col='Disease'):
    """Calculate prior probabilities P(D) for each disease."""
    priors = df[disease_col].value_counts(normalize=True).to_dict()
    return priors

def calculate_likelihoods(df, feature_cols, disease_col='Disease'):
    """Calculate likelihoods P(X_i | D) for each feature and disease."""
    likelihoods = {}
    diseases = df[disease_col].unique()

    # Map ordinal values to numeric
    ordinal_map = {'Normal': 0, 'Low': 1, 'High': 2}

    for disease in diseases:
        likelihoods[disease] = {}
        subset = df[df[disease_col] == disease]
        for feature in feature_cols:
            if feature in OrdinalFeatures:
                # Safely map ordinal values
                subset = subset.copy()  # Create a copy to avoid SettingWithCopyWarning
                subset.loc[:, feature] = subset[feature].map(ordinal_map)
                mu = subset[feature].mean()
                sigma = subset[feature].std()
                likelihoods[disease][feature] = (mu, sigma)
            elif feature in YesNoFeatures:  # Yes/No Features
                counts = subset[feature].value_counts(normalize=True).to_dict()
                likelihoods[disease][feature] = counts
            else:
                counts = subset[feature].value_counts(normalize=True).to_dict()
                likelihoods[disease][feature] = counts
    return likelihoods


def compute_posterior(patient_data, priors, likelihoods, feature_cols):
    """Calculate posterior probabilities P(D | X) for each disease."""
    ordinal_map = {'Normal': 0, 'Low': 1, 'High': 2}
    posteriors = {}
    for disease, prior in priors.items():
        posterior = prior
        for feature, value in patient_data.items():
            if feature in likelihoods[disease]:
                if feature in OrdinalFeatures:
                    # Map ordinal input to numeric
                    value = ordinal_map.get(value, -1)
                    mu, sigma = likelihoods[disease][feature]
                    prob = norm.pdf(value, mu, sigma) if sigma > 0 else 1e-6
                elif feature in YesNoFeatures:
                    prob = likelihoods[disease][feature].get(value, 1e-6)
                else:
                    prob = likelihoods[disease][feature].get(value, 1e-6)
                posterior *= prob
        posteriors[disease] = posterior

    # Normalize posteriors to sum to 1
    total = sum(posteriors.values())
    for disease in posteriors:
        posteriors[disease] /= total
    return posteriors


def predict_disease_probabilities(df, patient_data):
    """Predict the likelihood of each disease for a patient."""
    disease_col = 'Disease'
    feature_cols = [col for col in df.columns if col != disease_col and col != 'Outcome Variable']

    priors = calculate_priors(df, disease_col)
    likelihoods = calculate_likelihoods(df, feature_cols, disease_col)
    posteriors = compute_posterior(patient_data, priors, likelihoods, feature_cols)

    return posteriors


def get_answer(new_patient):
    df = pd.read_csv('Disease_symptom_and_patient_profile_dataset.csv')
    return predict_disease_probabilities(df, new_patient)
