# TanUM AgriSense

A soil-monitoring dashboard and fertilizer-recommendation prototype for the TanUM NanoTech Solutions project.

[Project case study](https://www.aaronarquillano.tech/projects/tanum)

![TanUM dashboard preview](https://raw.githubusercontent.com/aaronjalapon/portfolio/main/public/tanum.png)

## What this repository contains

- **Farmer dashboard:** soil nutrient indicators, moisture, temperature, and trend charts.
- **Recommendations:** a React interface that sends soil and crop inputs to a prediction API.
- **Application tracker:** fertilizer application records and monitoring views.
- **Research dashboard:** a separate view for exploring the prototype's data.
- **ML service:** a FastAPI application that loads a random-forest model and categorical encoders, with a CSV-based training fallback.

The broader TanUM project covers IoT ingestion, data processing, APIs, dashboards, and fertilizer recommendations. Aaron Jalapon Arquillano's project contributions span these areas. This repository is the public dashboard/recommendation prototype, rather than the complete hardware and ingestion system.

## Status and evidence

TanUM is an active pilot. Reductions in fertilizer use, cost savings, and yield improvements are targets pending broader validation.

The checked-in frontend uses [mock data](src/data/mockData.js), including generated trends. There are two distinct backend implementations:

| Path | Behavior |
| --- | --- |
| [ml-backend/app.py](ml-backend/app.py) | FastAPI service using a random-forest classifier and saved encoders. Returns model probabilities and rule-based recommendation text. |
| [api/app.py](api/app.py) | Lightweight serverless demo handler using nutrient thresholds and randomized confidence values. Its confidence values are illustrative, not model evaluation results. |

A prediction probability is not evidence of real-world agronomic accuracy. The public prototype does not establish field-level effectiveness.

## Stack

React 19, Vite 7, Tailwind CSS, DaisyUI, Recharts, Python, FastAPI, Pandas, NumPy, scikit-learn, and Joblib.

## Run locally

### Frontend

Use Node.js compatible with Vite 7.

```bash
git clone https://github.com/aaronjalapon/TanUM_NanoTechSolutions.git
cd TanUM_NanoTechSolutions
npm ci
```

Set the API address in a local override:

```dotenv
# .env.local
VITE_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

Open the URL printed by Vite, usually http://localhost:5173. Available routes are /dashboard, /recommendations, /tracker, and /research.

### ML API

In a second terminal, from the repository root, use Python 3.11 for the pinned dependency versions:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install -r ml-backend/requirements.txt
python -m uvicorn app:app --app-dir ml-backend --reload --host 127.0.0.1 --port 8000
```

The service loads the model and encoders from ml-backend/. If they cannot be loaded, it attempts to train from ml-backend/data_core.csv. Serialized model files must come from a trusted source.

- API documentation: http://127.0.0.1:8000/docs
- Health: GET /health
- Model categories and feature names: GET /model-info
- Recommendation request: POST /predict

## Try the workflow

1. Open the farmer dashboard and inspect the sample soil readings.
2. Open Recommendations to send the current soil/crop input to the ML API.
3. Inspect /model-info for the supported crop and soil categories.
4. Review fertilizer application records in Tracker and the Research view.

## Development checks

```bash
npm run lint
npm run build
```

These are the available frontend checks; their presence does not imply a passing result for every environment.

## Repository map

| Path | Purpose |
| --- | --- |
| src/pages/ | Dashboard, recommendations, tracker, and research screens |
| src/components/ | Layout, soil cards, charts, and weather widget |
| src/data/mockData.js | Sample records and generated chart data |
| ml-backend/ | FastAPI inference service, training script, CSV, and model artifacts |
| api/ | Separate serverless demonstration handler |
