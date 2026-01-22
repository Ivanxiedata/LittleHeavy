from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    id: int
    name: str
    price: float
    original_price: Optional[float] = None
    image_url: str
    category: str
    tags: List[str] = []
    is_new: bool = False
    is_sale: bool = False
    discount_text: Optional[str] = None

class ProductResponse(BaseModel):
    products: List[Product]
    total_count: int
    page: int
    page_size: int
