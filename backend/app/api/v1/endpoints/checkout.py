import stripe
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.api.v1.endpoints.cart import get_current_user
from config import settings

router = APIRouter()

stripe.api_key = settings.STRIPE_SECRET_KEY

# Mock product data map for price lookup (since we don't have a real product DB yet)
MOCK_PRODUCTS_DB = {
    1: {"name": "Winter Cardinal Pop-Up Card", "price": 1300}, # in cents
    2: {"name": "Snowy Owl Pop-Up Bouquet", "price": 2600},
    3: {"name": "Holiday Train Pop-Up Card", "price": 1500},
}

@router.post("/create-session")
def create_checkout_session(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get user's cart
    statement = select(Cart).where(Cart.user_id == current_user.id)
    cart = session.exec(statement).first()
    
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    line_items = []
    for item in cart.items:
        product = MOCK_PRODUCTS_DB.get(item.product_id)
        if product:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": product["name"],
                    },
                    "unit_amount": product["price"],
                },
                "quantity": item.quantity,
            })

    if not line_items:
        raise HTTPException(status_code=400, detail="No valid items in cart")

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url="http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000/cart",
            customer_email=current_user.email,
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
