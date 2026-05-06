#  API Documentation

This documentation provides details for all available API endpoints in the EstateOne Real Estate platform.

**Base URL**: `https://real-back-x9ln.onrender.com` (or as configured in your environment)

---

## 1. Authentication

### Register Us...r (Multi-step Flow)
*   **Endpoint**: `POST /auth/register`
*   **Description**: Sends an OTP to the user's email and temporarily stores user data.
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "Password123!",
      "role": "owner", 
      "profileData": {
        "phone": "9876543210",
        "companyName": "Optional Firm Name"
      }
    }
    ```
*   **Note**: Roles can be `owner`, `builder`, `broker`, `buyer`, or `flatmate`.
*   **Error Case**: If email or phone is already registered, it returns `400 Bad Request` with `"error": "Email already registered"`.

### Verify Registration OTP
*   **Endpoint**: `POST /auth/verify-otp`
*   **Description**: Verifies the OTP and creates the permanent user account.
*   **Body**:
    ```json
    {
      "email": "john@example.com",
      "otp": "123456"
    }
    ```
*   **Response**: `201 Created` with token and user profile.

### Login User
*   **Endpoint**: `POST /auth/login`
*   **Body**:
    ```json
    {
      "email": "john@example.com", // Can be email or phone number
      "password": "password123"
    }
    ```
*   **Response**: `200 OK` with token and role. Use role for navigation (e.g., `owner` -> `/listings`).

---

## 2. Property Management

### Post a New Property
*   **Endpoint**: `POST /properties`
*   **Headers**: `Authorization: Bearer <token>`
*   **Body (Common Fields)**:
    ```json
    {
      "title": "2 BHK Apartment",
      "city": "Mumbai",
      "locality": "Andheri West",
      "address": "Full street address",
      "propertyType": "ObjectId",
      "lookingFor": "ObjectId",
      "subPropertyType": "ObjectId",
      "price": 50000,
      "availableFrom": "2026-05-05",
      "constructionStatus": "ObjectId (Optional)",
      "possessionStatus": "ObjectId (Optional)",
      "area": 1200,
      "areaUnit": "ObjectId",
      "images": ["base64_string_1", "base64_string_2"],
      "amenities": ["ObjectId_1", "ObjectId_2"]
    }
    ```

### Update Existing Property
*   **Endpoint**: `PUT /properties/:id`
*   **Headers**: `Authorization: Bearer <token>`
*   **Description**: Partially update any property field.
*   **Example (Deactivate)**:
    ```json
    { "isActive": false, "deactivationReason": "Sold out" }
    ```

### Get My Properties (Dashboard/Listings)
*   **Endpoint**: `GET /properties/me`
*   **Headers**: `Authorization: Bearer <token>`
*   **Description**: Retrieves all properties listed by the currently authenticated user.

### Get All Properties (Public Search)
*   **Endpoint**: `GET /properties`
*   **Query Params**: `?city=Mumbai&propertyType=...`

---

## 3. Lookup Endpoints (Reference Data)

These endpoints provide data for dropdowns. All return a `{ success: true, data: [...] }` structure.

| Entity | Endpoint | Description |
| :--- | :--- | :--- |
| **Property Types** | `GET /property-types` | Residential, Commercial, Plot, etc. |
| **Categories** | `GET /categories` | Sell, Rent, PG, etc. |
| **Sub Property Types** | `GET /sub-property-types` | Flat, Villa, Office, Shop, etc. |
| **Measurement Units** | `GET /measurement-units` | sq. ft., sq. yards, acre, etc. |
| **Furnishing Status** | `GET /furnishing-status` | Furnished, Unfurnished, Semi-furnished. |
| **Amenities** | `GET /amenities` | Gym, Pool, Parking, etc. |
| **Construction Status**| `GET /construction-status` | Ready to Move, Under Construction. |
| **Possession Status** | `GET /possession-status` | Immediate, 6 Months, etc. |
| **Ownership Types** | `GET /ownership-types` | Freehold, Leasehold, etc. |
| **Zone Types** | `GET /zone-types` | Industrial, Commercial, Residential. |
| **Location Hubs** | `GET /location-hubs` | IT Park, Business District, etc. |
| **Facing Directions** | `GET /facing-directions` | North, East, etc. |

---

## 4. Search & Discovery

### Advanced Search
*   **Endpoint**: `GET /search`
*   **Params**: `?city=...&category=...&minPrice=...&maxPrice=...`

---

## Error Handling

Responses for errors follow this format:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```
**Common Error Codes:**
- `400`: Validation error (e.g., invalid ObjectId format, missing required fields).
- `401`: Auth error (Invalid token or incorrect credentials).
- `500`: Server error (Includes `ETIMEDOUT` for email failures on restricted hosts like Render).