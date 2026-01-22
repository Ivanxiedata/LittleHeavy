from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.product import Product, ProductResponse
from config import settings
from app.core.database import create_db_and_tables
from app.api.v1.endpoints import auth, cart, checkout
from app.models.cart import Cart, CartItem
from typing import List

# Create DB tables on startup
try:
    create_db_and_tables()
except Exception as e:
    print(f"Database setup warning: {e}")

app = FastAPI(
    title="Little Heavy API",
    description="Backend API for the Little Heavy e-commerce platform",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(cart.router, prefix="/api/v1/cart", tags=["cart"])
app.include_router(checkout.router, prefix="/api/v1/checkout", tags=["checkout"])

# Mock data for Winter Collection
MOCK_PRODUCTS = [
    {
        "id": 1,
        "name": "Winter Cardinal Pop-Up Card",
        "price": 13.00,
        "image_url": "https://images.unsplash.com/photo-1473187983305-f615310e7daa?q=80&w=800&auto=format&fit=crop",
        "category": "Winter",
        "tags": ["Bird", "Nature"],
        "is_new": True,
        "discount_text": "15% off 5"
    },
    {
        "id": 2,
        "name": "Snowy Owl Pop-Up Bouquet",
        "price": 26.00,
        "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
        "category": "Winter",
        "tags": ["Flower", "Animal"],
        "is_sale": True,
        "original_price": 30.00
    },
    {
        "id": 3,
        "name": "Holiday Train Pop-Up Card",
        "price": 15.00,
        "image_url": "https://images.unsplash.com/photo-1607344645866-009c320b63e0?q=80&w=800&auto=format&fit=crop",
        "category": "Winter",
        "tags": ["Holiday", "Transport"],
        "discount_text": "10% off 5"
    }
]

@app.get("/")
async def root():
    return {"message": "Welcome to the Little Heavy API"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/v1/products", response_model=ProductResponse)
async def get_products(page: int = 1, page_size: int = 12):
    return {
        "products": MOCK_PRODUCTS,
        "total_count": len(MOCK_PRODUCTS),
        "page": page,
        "page_size": page_size
    }
