from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_endpoint_returns_ok():
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "henlixo-api"}


def test_products_endpoint_returns_henlixo_skus():
    response = client.get("/api/products")

    assert response.status_code == 200
    products = response.json()
    assert len(products) == 11
    assert products[0]["sku"] == "HL-PG-LV-STD"
    assert products[0]["family"] == "Pergola"


def test_product_detail_endpoint_returns_single_sku():
    response = client.get("/api/products/HL-MSR-PC")

    assert response.status_code == 200
    product = response.json()
    assert product["sku"] == "HL-MSR-PC"
    assert product["family"] == "Sunroom"


def test_cases_endpoint_returns_application_scenarios():
    response = client.get("/api/cases")

    assert response.status_code == 200
    cases = response.json()
    assert cases[0]["kind"] == "application-scenario"
    assert "recommendedProducts" in cases[0]


def test_social_endpoint_returns_channels_and_items():
    response = client.get("/api/social")

    assert response.status_code == 200
    payload = response.json()
    assert payload["channels"][0]["name"] == "Instagram"
    assert len(payload["items"]) >= 3


def test_inquiry_endpoint_accepts_payload_without_persistence():
    payload = {
        "name": "Jane Buyer",
        "company": "Resort Group",
        "email": "jane@example.com",
        "phone": "+1 310 555 0100",
        "country": "USA",
        "customerType": "Hotel / Resort",
        "productInterest": "Pergola",
        "projectSize": "12 sets",
        "message": "Please quote a resort pergola project.",
    }

    response = client.post("/api/inquiries", json=payload)

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Inquiry received",
    }
