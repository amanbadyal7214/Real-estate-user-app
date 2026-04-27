# API Documentation: Real Estate App

This document provides a comprehensive list of all API endpoints required to power the Real Estate User Application.

## Base URL
`https://api.yourdomain.com/v1`

---

## 1. Authentication & User Management
Manage user sessions, registration, and profile data.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/auth/register` | `POST` | Create a new user account (Buyer/Seller). |
| `/auth/login` | `POST` | Authenticate user and return JWT. |
| `/auth/verify-otp` | `POST` | Verify phone/email OTP for security. |
| `/user/profile` | `GET` | Fetch current user data and preferences. |
| `/user/profile` | `PUT` | Update user details (Name, Image, Location). |
| `/user/preferences` | `PATCH` | Update property preferences (BHK, Budget, Locality). |

---

## 2. Property Discovery (Buy, Rent, PG, Plots, Commercial)
The core engine for fetching listings across different sectors.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/properties/search` | `GET` | Advanced search with filters (type, price, BHK, amenities). |
| `/properties/{id}` | `GET` | Get exhaustive details for a specific property. |
| `/properties/trending` | `GET` | Fetch properties for "Spotlight" and "Trending" sections. |
| `/properties/recommended` | `GET` | Personalized properties based on user preferences. |
| `/properties/similar/{id}` | `GET` | Get similar listings for the detail page. |

---

## 3. Projects & Developers
Endpoints for gated communities and upcoming developments.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/projects/search` | `GET` | Filter projects by construction status and budget. |
| `/projects/{id}` | `GET` | Project highlights, unit configurations, and RERA info. |
| `/projects/high-demand` | `GET` | Data for "High Demand Projects" cards. |
| `/developers/{id}` | `GET` | Developer bio and list of their current/past projects. |

---

## 4. Search & Geolocation
Powering the search bars and location selection screens.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/search/autocomplete` | `GET` | Real-time suggestions for localities and landmarks. |
| `/location/cities` | `GET` | List of supported cities for the startup screen. |
| `/location/localities` | `GET` | Top localities with average price/growth metrics. |
| `/search/recent` | `GET` | Fetch user's last performed searches. |

---

## 5. Insights & Analytics
Data for market trends and investment advice.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/insights/price-trends` | `GET` | Historic price data for a specific locality. |
| `/insights/growth-rates` | `GET` | Comparison data for "Highest Growth" localities. |
| `/insights/better-priced` | `GET` | Logic identifying undervalued properties. |

---

## 6. User Engagement & Leads
Tracking interactions between users and sellers.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/properties/save/{id}` | `POST` | Add property to favorites. |
| `/properties/saved` | `GET` | Fetch all favorited listings. |
| `/leads/contact` | `POST` | Notify seller/agent of user interest. |
| `/leads/schedule-visit` | `POST` | Book a site visit appointment. |

---

## 7. Informational & Tools
Calculators and content for auxiliary pages.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/news` | `GET` | Real estate news and article highlights. |
| `/calculators/emi` | `POST` | Calculate monthly installments (can also be client-side). |
| `/testimonials` | `GET` | Fetch user reviews for the home screen. |

---

## Technical Specifications
- **Format**: JSON
- **Authentication**: Bearer Token (JWT)
- **Filtering**: Query parameters (e.g., `?minPrice=5000000&bhk=2`)
- **Pagination**: Offset-based (`?page=1&limit=10`) or Cursor-based.
