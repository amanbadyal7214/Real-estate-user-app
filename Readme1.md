This documentation provides details for all available API endpoints in this Real Estate platform.

**Base URL**: `https://real-back-x9ln.onrender.com` (or as configured in your environment)

---

## 1. Authentication

### Registration Workflow (Full Flow)

The registration is a multi-stage process involving both frontend-side phone validation and backend-side email verification.

#### Step 1: Phone Validation (Frontend)
Before details are collected, the frontend performs a mock phone verification.
*   **Action**: User enters a 10-digit phone number.
*   **Logic**: The frontend generates a 6-digit random code and displays it via an alert (Mock).
*   **Outcome**: Once the correct code is entered, the user proceeds to the details form.

#### Step 2: Account Registration (Backend OTP)
*   **Endpoint**: `POST /auth/register`
*   **Description**: Validates that the email and phone are unique, sends a real OTP to the email address, and stores data in a temporary state.
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "Password123!",
      "role": "owner",
      "profileData": {
        "phone": "9876543210",
        "city": "Mumbai",
        "companyName": "Optional Firm Name",
        "businessSince": "2020"
      }
    }
    ```
*   **Notes**:
    - `city` is saved to both the `User` document and the role-specific profile (`OwnerProfile`, `BrokerProfile`, `BuilderProfile`, `BuyerProfile.preferences.city`).
    - `companyName` maps to `firmName` for broker/builder profiles.
    - `businessSince` is only relevant for `builder` role.
*   **Roles**: `owner`, `builder`, `broker`, `buyer`.
*   **Success Response**: `200 OK`
    ```json
    { "success": true, "message": "OTP sent to email" }
    ```
*   **Error Case**:
    - `400`: "Email already registered" or "Phone number already registered".
    - `500`: "Email could not be sent" (usually due to SMTP timeout on restricted environments).

#### Step 3: Email OTP Verification
*   **Endpoint**: `POST /auth/verify-otp`
*   **Description**: Verifies the email OTP, clears temporary data, and creates the permanent User and Role-specific Profile.
*   **Body**:
    ```json
    {
      "email": "john@example.com",
      "otp": "123456"
    }
    ```
*   **Success Response**: `201 Created`
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN_HERE",
      "role": "owner",
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "city": "Mumbai",
        "profileImage": null
      }
    }
    ```
*   **What gets created**: A `User` document (with `name`, `email`, `phone`, `city`, `role`, `isVerified: true`) plus a role-specific profile document with all the same data.

---

### Login User
*   **Endpoint**: `POST /auth/login`
*   **Body**:
    ```json
    {
      "email": "john@example.com", // Can be email or phone number
      "password": "password123"
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN_HERE",
      "role": "owner",
      "user": {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "city": "Mumbai",
        "profileImage": null
      }
    }
    ```
*   Use `role` for post-login navigation: `owner` → `/listings`, others → `/dashboard`.

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
