BASE URL: https://real-back-x9ln.onrender.com/

--------------------------------------------------------------------------------
1. AUTHENTICATION & USER MANAGEMENT
--------------------------------------------------------------------------------

[POST] /auth/register
- Payload: { "name", "email", "password", "role", "profileData": { "phone", "city" } }

[POST] /auth/verify-otp
- Payload: { "email", "otp" }

[POST] /auth/login
- Payload: { "email", "password" }

[POST] /auth/forgot-password
- Payload: { "email" }

[PUT] /auth/reset-password/:resettoken
- Payload: { "password" }

[GET] /auth/me (Protected)
- Returns: Current user profile details.

--------------------------------------------------------------------------------
2. LOCALITY MANAGEMENT
--------------------------------------------------------------------------------

[GET] /localities
- Params: ?search=NAME
- Returns: Matching localities.

[POST] /localities (Single or Bulk)
- Payload Single: { "name": "Sector 91", "label": "Sector 91, Mohali" }
- Payload Bulk: [{ "name": "S1", "label": "L1" }, { "name": "S2", "label": "L2" }]

[PUT] /localities/:id
- Payload: { "name", "label", "isActive" }

[DELETE] /localities/:id
- Description: Deactivates the locality.

--------------------------------------------------------------------------------
3. PROPERTY MANAGEMENT
--------------------------------------------------------------------------------

[GET] /properties
- Params: ?city, ?lookingFor, ?propertyType, ?subPropertyType, ?minPrice, ?maxPrice, ?page, ?limit

[POST] /properties (Protected)
- Payload: { "title", "lookingFor", "propertyType", "subPropertyType", "city", "locality", "address", "pincode", "price", "area", "images": [], "amenities": [{ "amenity", "count" }] }

[GET] /properties/me (Protected)
- Returns: Properties listed by the current user.

[GET] /properties/:id
- Returns: Full property details.

[PUT] /properties/:id (Protected)
- Payload: { "price", "isActive", "title", etc. }

[DELETE] /properties/:id (Protected)

--------------------------------------------------------------------------------
4. SPECIALIZED PROPERTY DISCOVERY
--------------------------------------------------------------------------------

[GET] /properties/find/location
- Params: ?city, ?locality, ?pincode, ?projectName, ?lookingFor, ?demand=true, ?PriceAscending=true

[GET] /properties/find/high-demand
- Returns: Properties sorted by highest view counts.

[GET] /properties/find/sellers-by-location
- Params: ?city, ?locality, ?pincode
- Returns: Profiles of users selling/renting in that area.

[POST] /properties/view/:id (Protected)
- Description: Increments property demand and adds to user history.

[GET] /properties/recently-viewed (Protected)
[GET] /properties/contacted (Protected)
[GET] /properties/revisit (Protected)
[GET] /properties/matched (Protected)

--------------------------------------------------------------------------------
5. FINANCIAL CALCULATORS
--------------------------------------------------------------------------------

[POST] /calculators/affordability
- Payload: { "monthlyIncome", "existingEmi", "tenureYears", "interestRate", "downPayment" }

[POST] /calculators/eligibility
- Payload: { "monthlyIncome", "age", "tenureYears", "interestRate", "existingLoans" }

[POST] /calculators/emi-breakdown
- Payload: { "loanAmount", "interestRate", "tenureYears" }

--------------------------------------------------------------------------------
6. REFERENCE DATA (LOOKUPS)
--------------------------------------------------------------------------------

All endpoints follow format: [GET] /ENDPOINT -> { success: true, data: [...] }

- /categories             (Sell, Rent, PG)
- /property-types         (Residential, Commercial, Plot)
- /sub-property-types     (Flat, Villa, Office, Shop, Showroom, Warehouse)
- /amenities              (Gym, Pool, Parking, Lift, Power Backup)
- /furnishing-status      (Furnished, Semi-furnished, Unfurnished)
- /facing-directions      (North, East, West, South, North-East, etc.)
- /construction-status    (Ready to Move, Under Construction)
- /possession-status      (Immediate, 6 Months, 1 Year)
- /ownership-types        (Freehold, Leasehold, Power of Attorney)
- /measurement-units      (sq. ft., sq. yards, acre, Kanal)
- /zone-types             (Industrial, Commercial, Residential)
- /location-hubs          (IT Park, Business District, Metro Station)
- /electricity-types      (Single Phase, Three Phase)
- /registration-types     (Registered, Not Registered)
- /plc                    (Park Facing, Corner, Wide Road)
- /structures             (BHK, RK, Studio)
- /sub-structures         (1 BHK, 2 BHK, etc.)

--------------------------------------------------------------------------------
7. USER ACTIVITY & SEARCH
--------------------------------------------------------------------------------

[GET] /user/activity/recently-viewed
[GET] /user/saved-searches (Protected)
[POST] /user/saved-searches (Protected)
- Payload: { "searchName", "filters": { "city", "category", etc. } }

[GET] /search (Advanced)
- Params: Flexible filters across all property attributes.

[GET] /insights
- Description: Market trends and area-wise price analytics.

--------------------------------------------------------------------------------
8. PROJECT & DEVELOPER MANAGEMENT
--------------------------------------------------------------------------------

[GET] /projects
[GET] /projects/:id
[GET] /developers
[GET] /developers/:id

--------------------------------------------------------------------------------
9. ADMIN OPERATIONS (Protected/Admin)
--------------------------------------------------------------------------------

[GET] /admin/dashboard-stats
[GET] /admin/users
[PUT] /admin/verify-property/:id
[PUT] /admin/verify-user/:id

================================================================================
END OF DIRECTORY
================================================================================
