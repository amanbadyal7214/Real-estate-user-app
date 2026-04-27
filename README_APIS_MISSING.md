# Enhanced API Documentation: Missing Feature Endpoints

This document identifies additional API endpoints required to fully support the frontend features identified in the Real Estate User App (Gated Communities, Insights, Activity Tracking, and Calculators).

---

## 1. User Activity & Engagement Analytics
These APIs drive the "Activity" tabs and notification badges in the user profile.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/user/activity/summary` | `GET` | Get counts for: Saved, Viewed, Contacted, and Recent Searches (for Profile badges). |
| `/properties/view/{id}` | `POST` | Log a property view event to track "Recently Viewed" history. |
| `/properties/recently-viewed` | `GET` | Fetch list of properties the user recently looked at. |
| `/properties/contacted` | `GET` | List of properties where the user clicked "Contact Seller" or "Call". |
| `/properties/revisit` | `GET` | Fetch properties viewed multiple times but not yet saved (for "Revisit" cards). |

---

## 2. Advanced Search & Personalization
Features for the SearchBox, Voice Search, and personalized Home feed.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/search/autocomplete` | `GET` | Real-time suggestions for City, Locality, or Project names as the user types. |
| `/search/recent` | `DELETE` | Remove a specific entry from search history. |
| `/search/recent/clear` | `DELETE` | Wipe the entire search history for the user. |
| `/properties/matched` | `GET` | Fetch properties that match 80% or more of user's saved preferences. |

---

## 3. High-Level Insights & Market Trends
Data for the `Insights.jsx`, `HighestGrowthCard`, and `BetterPricedCard`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/insights/locality-growth` | `GET` | Historical price data (1Y, 3Y, 5Y) for specific localities. |
| `/insights/better-priced` | `GET` | Returns properties in a locality priced significantly lower than the average. |
| `/insights/high-demand` | `GET` | Identify projects with the highest clicks/leads in the last 30 days. |
| `/insights/amenity-trends` | `GET` | Growth percentage for properties featuring specific amenities (e.g., "Swimming Pool"). |

---

## 4. Deep Project & Developer Data
Specific to gated communities and new launches found in `ProjectSearch`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/projects/{id}/units` | `GET` | List of available unit types (1BHK, 2BHK) with specific pricing and floor areas. |
| `/projects/{id}/floor-plans` | `GET` | URLs for layout images and 3D floor plan visualizations. |
| `/developers/{id}/stats` | `GET` | Developer trust metrics: Total Projects, Years in Market, and Delivery on Time %. |
| `/projects/{id}/rera-verify` | `GET` | Detailed RERA registration info and construction milestones. |

---

## 5. Smart Financial Tools
Backend logic for the calculator components.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/calculators/affordability` | `POST` | Input: Monthly Income, Savings, Loans. Output: Suggested Property Budget. |
| `/calculators/eligibility` | `POST` | Input: Age, Income, Credit Score. Output: Max Loan Limit & Bank Options. |
| `/calculators/emi-breakdown` | `POST` | Detailed monthly schedule showing Interest vs Principal components. |

---

## 6. Locality Comparison & Discovery
For state-wide or city-wide exploration.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/location/nearby` | `GET` | Fetch localities within a specific radius of coordinates (lat/lng). |
| `/location/compare` | `GET` | Compare two localities side-by-side (Price, Growth, Connectivity). |

---

### Implementation Notes for Backend Developer
1. **Analytics Logging**: The `/properties/view/{id}` should be lightweight (async) to avoid slowing down the property detail load.
2. **Caching**: Insight and Trend data should be cached for at least 24 hours as they don't change frequently.

3. **Calculators**: Ensure the math logic is standardized so frontend and backend results match perfectly.
