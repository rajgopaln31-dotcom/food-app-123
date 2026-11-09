# FoodieGo - Food Delivery Website (React + TypeScript + MUI + Redux Toolkit)

## How to run
1. Install Node.js (version 18 or higher)
2. Open a terminal in this folder and run `npm install`
3. Run `npm run dev` and open the link shown (usually http://localhost:5173)

## Customer journey
Login -> Home -> Restaurants -> Restaurant Details (food popup) -> Cart -> Checkout (address) -> Payment -> Order Confirmation / Tracking -> My Orders

## Notes
- **Register first**, then log in. Users are saved in the browser (localStorage), so you can log out and log in again.
- **Mock data**: no backend. Restaurants and food are in `src/data/mockData.ts` and are read through `src/services/api.ts` (with a fake delay for loading skeletons). The base URL is in `.env`.
- **Coupons**: `SAVE10` (10% off) and `FLAT50` (Rs. 50 off). Delivery Rs. 40, tax 5%.
- **Payment is simulated.** To test a failed payment use UPI `fail@upi` or card number `0000000000000000`. The order is created only after payment succeeds.
- **Order tracking is simulated**: the status moves forward every 8 seconds.
- Images are SVG files in `public/images`. No internet needed.
- Redux slices: auth, restaurant, cart, address, order, favourite (`src/slices`). The store is saved to localStorage in `src/store.ts`.
- Two small extras beyond the 8 screens: `MyOrders` page (PDF asks for "My Orders") and `FoodDetailsDialog` (Food Details is a popup).

## Zoom / responsive design
Layouts use CSS Grid/Flexbox with `flex-wrap`, `minmax()`, `max-width`, `aspect-ratio` and `object-fit: cover`, so images keep their ratio and nothing overlaps at 80%-150% zoom. No absolute positioning and no transforms.

## Testing checklist
Register -> Login -> search/filter/sort -> favourite -> open restaurant -> add food with add-ons -> try adding from another restaurant (confirm dialog) -> coupon -> add address (validation) -> pay (success + failure) -> track order -> My Orders -> Logout -> Login again.
