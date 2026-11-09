# Explanation of every TSX file (for your faculty presentation)

**Big picture:** Each page has its own `.tsx` (what it shows and does) and `.css` (how it looks). Data shared by many pages (login user, cart, address, orders, favourites) lives in Redux. `useState` is used for things that belong to one page only (form text, loading, popups). `useEffect` runs code once when a page opens (loading data). `useNavigate` changes the page.

## main.tsx / App.tsx / AppRoutes.tsx
- **main.tsx** - starting file. `Provider` gives Redux to the whole app, `BrowserRouter` enables page navigation, `ThemeProvider` sets the orange colour, `CssBaseline` resets browser default styles.
- **App.tsx** - only shows `AppRoutes`.
- **AppRoutes.tsx** - list of all URLs. `Route path="/home" element={<Home/>}` means: URL /home shows the Home page. Routes inside `ProtectedRoute` need login.

## components/ProtectedRoute.tsx
Why: stop people who are not logged in. If `currentUser` is null -> `Navigate` to Login. Otherwise shows `Header`, the page (`Outlet`) and `Footer`.

## components/Header.tsx
`AppBar` + `Toolbar` = top bar. `Button` = Home/Restaurants/My Orders links. `Badge` on the cart `IconButton` shows item count (`cartCount`, added up with `reduce`). `Menu`/`MenuItem` = profile dropdown (also shows Home/Restaurants on mobile). `goTo(path)` closes the menu and navigates. `handleLogout` dispatches `logoutUser` and goes to Login.

## components/Footer.tsx
Simple `Box` + `Typography` text at the bottom.

## components/Toast.tsx
Reusable message popup. `Snackbar` = small popup at the bottom, `Alert` = coloured message inside it. Pages keep a `toast` state and show it with `setToast({open:true, message, severity})`.

## components/QuantityButtons.tsx
The "- 1 +" control. Two `IconButton`s call `onMinus` / `onPlus` given by the parent page. Used in cart, menu and food popup.

## components/CardSkeleton.tsx
`Skeleton` = grey loading boxes shown while data loads.

## components/RestaurantCard.tsx
One restaurant card. `Card`, `CardMedia` (image), `CardContent`. Clicking the image navigates to `/restaurant/ID`. The heart `IconButton` dispatches `toggleFavourite`; `isFavourite` decides the filled/empty heart.

## components/PriceSummary.tsx
Reads cart from Redux and calls `getTotals` (subtotal, discount, delivery, tax, total). `row()` is a small function that makes one line. Used in Cart, Checkout, Payment.

## components/FoodDetailsDialog.tsx
Popup for one food. `Dialog` = popup window. `Checkbox`es choose add-ons; `toggleAddOn` adds/removes it from `selectedAddOns`. `totalPrice` updates automatically. "Add to Cart" calls `onAdd` from the parent.

## pages/Login.tsx
`Paper` card, `TextField` inputs, `Button`. Show/hide password toggles `showPassword`. `handleLogin`: checks empty/invalid fields -> shows errors under the fields -> fake 0.8s loading (`CircularProgress`) -> looks for the user in registered `users` -> if found `loginUser` + `navigate("/home")`, else error snackbar. "Create Account" link goes to /register. Forgot Password shows an info message (not available in demo).

## pages/Register.tsx
Fields come from the `fields` array, shown with `.map()`. `handleChange` saves typed text. `handleRegister` validates name, email, 10-digit mobile, password length, confirm password match and duplicate email; then `registerUser` saves the user and goes to Login.

## pages/Home.tsx
`useEffect` loads restaurants and foods (`Promise.all`). Sections: location `TextField select`, search box, category images, offer banners, Popular (most reviews), Recommended food (main-course items), Top Rated (rating >= 4.5). Search button / category click store the value in Redux and `navigate("/restaurants")`.

## pages/Restaurants.tsx
Search, category `Chip`s, sort dropdown and "Rating 4.0+" `Switch`. Filtering is done step by step with `.filter()` and `.sort()` on the list. If the list is empty an empty-state message with a "Clear" button appears.

## pages/RestaurantDetails.tsx
`useParams` reads the restaurant id from the URL. `Tabs` switch Starters / Main Course / Desserts. Each food `Card` has a veg/non-veg dot, price and "Add to Cart" (or quantity buttons if already in cart; "not available" if unavailable). Clicking the image opens `FoodDetailsDialog`. `handleAdd` builds the cart item; if the cart has another restaurant's food, a confirmation `Dialog` asks to replace it (`handleReplaceCart`).

## pages/Cart.tsx
Lists cart items with quantity buttons and a delete `IconButton`. Coupon: `handleApplyCoupon` accepts SAVE10 / FLAT50. "Proceed to Checkout" navigates to /checkout. Empty cart shows a message and a button to browse restaurants.

## pages/Checkout.tsx
Address list with `RadioGroup` (selected = default). Edit/Delete icons. "Add New Address" opens a `Dialog` form built from the `fields` array. `handleSaveAddress` validates (required fields, 10-digit mobile, 6-digit PIN) and adds or updates. "Place Order" checks cart and address, then navigates to /payment.

## pages/Payment.tsx
Choose UPI / Card / Net Banking / COD (`RadioGroup`). `validatePayment` checks the fields of the selected method. `handlePay`: ignores clicks while loading (no double submit), waits 2 seconds (simulated), then on success creates the order (`addOrder`), clears the cart and goes to the confirmation page. Failure shows an error snackbar. "Cancel Payment" goes back to checkout.

## pages/OrderConfirmation.tsx
Finds the order by id (`useParams`). Shows order ID, items, address, total and estimated time. `Stepper` shows the 6 statuses; `step` is calculated from the time since the order was placed (simulated, every 8 s) using a timer in `useEffect`. Buttons: Track Order (scrolls to timeline), Continue Shopping (/home), View My Orders (/orders).

## pages/MyOrders.tsx
Shows all saved orders (order history) with a "Track Order" button for each.
