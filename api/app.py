from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    # Dummy response for testing
    return JSONResponse({"result": "ok", "received": data})

handler = app  # For Vercel
