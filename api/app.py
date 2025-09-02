from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    return JSONResponse({"result": "ok", "received": data})

# This is required for Vercel Python serverless
handler = app
