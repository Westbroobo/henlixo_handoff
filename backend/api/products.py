from fastapi import APIRouter, HTTPException

from schemas.product import Product
from services.data_loader import load_json_file


router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return [Product.model_validate(item) for item in load_json_file("products.json")]


@router.get("/{sku}", response_model=Product)
def get_product(sku: str) -> Product:
    for product in list_products():
        if product.sku.lower() == sku.lower():
            return product
    raise HTTPException(status_code=404, detail="Product not found")
