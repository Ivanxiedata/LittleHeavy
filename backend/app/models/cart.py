from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class CartBase(SQLModel):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    # For guest carts, we might use a session_id, but for now let's stick to auth users or local storage sync
    # We'll assume backend cart is for logged-in users.

class Cart(CartBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    items: List["CartItem"] = Relationship(back_populates="cart")

class CartItemBase(SQLModel):
    product_id: int
    quantity: int = 1

class CartItem(CartItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    cart_id: Optional[int] = Field(default=None, foreign_key="cart.id")
    cart: Optional[Cart] = Relationship(back_populates="items")

class CartItemCreate(CartItemBase):
    pass

class CartItemRead(CartItemBase):
    id: int
    product_id: int
    quantity: int

class CartRead(CartBase):
    id: int
    items: List[CartItemRead] = []
