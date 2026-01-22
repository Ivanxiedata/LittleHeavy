from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.core.database import get_session
from app.models.cart import Cart, CartItem, CartItemCreate, CartRead, CartItemRead
from app.models.user import User
from config import settings
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/", response_model=CartRead)
def get_cart(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Find cart for user
    statement = select(Cart).where(Cart.user_id == current_user.id)
    cart = session.exec(statement).first()
    
    if not cart:
        # Create new cart if not exists
        cart = Cart(user_id=current_user.id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    
    return cart

@router.post("/items", response_model=CartRead)
def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get or create cart
    statement = select(Cart).where(Cart.user_id == current_user.id)
    cart = session.exec(statement).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
    
    # Check if item already exists in cart
    statement = select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == item.product_id)
    existing_item = session.exec(statement).first()
    
    if existing_item:
        existing_item.quantity += item.quantity
        session.add(existing_item)
    else:
        new_item = CartItem(cart_id=cart.id, product_id=item.product_id, quantity=item.quantity)
        session.add(new_item)
    
    session.commit()
    session.refresh(cart)
    return cart

@router.delete("/items/{item_id}", response_model=CartRead)
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    statement = select(Cart).where(Cart.user_id == current_user.id)
    cart = session.exec(statement).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
        
    item = session.get(CartItem, item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    session.delete(item)
    session.commit()
    session.refresh(cart)
    return cart
