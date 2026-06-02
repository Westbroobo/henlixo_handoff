from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.cases import router as cases_router
from api.health import router as health_router
from api.inquiries import router as inquiries_router
from api.products import router as products_router
from api.site_config import router as site_config_router
from api.social import router as social_router


app = FastAPI(title="Henlixo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(site_config_router)
app.include_router(products_router)
app.include_router(cases_router)
app.include_router(social_router)
app.include_router(inquiries_router)
