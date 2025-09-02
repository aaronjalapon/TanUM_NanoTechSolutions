from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running"}

@app.post("/predict")
@app.post("/predict/")
async def predict(request: Request):
    data = await request.json()
    return JSONResponse({"result": "ok", "received": data})

# Vercel handler
handler = app