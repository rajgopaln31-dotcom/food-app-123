import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Tabs, Tab, Card, CardActionArea, CardMedia, CardContent, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Restaurant, Food, CartItem, AddOn } from "../types";
import { getRestaurants, getFoods } from "../services/api";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, changeQuantity, clearCart } from "../slices/cartSlice";
import FoodDetailsDialog from "../components/FoodDetailsDialog";
import QuantityButtons from "../components/QuantityButtons";
import CardSkeleton from "../components/CardSkeleton";
import Toast, { ToastState, emptyToast } from "../components/Toast";
import "./RestaurantDetails.css";

const menuCategories = ["Starters", "Main Course", "Desserts"];

function RestaurantDetails() {
  const { id } = useParams();
  const restaurantId = Number(id);
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState(0);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [pendingItem, setPendingItem] = useState<CartItem | null>(null);
  const [toast, setToast] = useState<ToastState>(emptyToast);
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([getRestaurants(), getFoods(restaurantId)])
      .then(([list, menu]) => { setRestaurant(list.find((r) => r.id === restaurantId)); setFoods(menu); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [restaurantId]);

  const addNow = (item: CartItem) => {
    dispatch(addToCart(item));
    setToast({ open: true, message: `${item.name} added to cart`, severity: "success" });
  };

  // Builds a cart item and adds it. Asks for confirmation if the cart has food from another restaurant.
  const handleAdd = (food: Food, quantity: number, selectedAddOns: AddOn[]) => {
    if (!restaurant) return;
    const addOnNames = selectedAddOns.map((a) => a.name).join(", ");
    const addOnPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const item: CartItem = {
      key: food.id + "-" + addOnNames, foodId: food.id, restaurantId: restaurant.id, restaurantName: restaurant.name,
      name: food.name, price: food.price + addOnPrice, quantity, image: food.image, addOns: addOnNames,
    };
    setSelectedFood(null);
    if (cartItems.length > 0 && cartItems[0].restaurantId !== restaurant.id) setPendingItem(item);
    else addNow(item);
  };

  const handleReplaceCart = () => {
    if (pendingItem) { dispatch(clearCart()); addNow(pendingItem); }
    setPendingItem(null);
  };

  if (loading) return <CardSkeleton />;
  if (error || !restaurant) return <Alert severity="error">Restaurant not found or could not be loaded.</Alert>;

  const visibleFoods = foods.filter((food) => food.category === menuCategories[tab]);

  return (
    <Box>
      <img src={restaurant.image} alt={restaurant.name} className="restaurant-banner" />
      <Typography variant="h4">{restaurant.name}</Typography>
      <Typography color="text.secondary">⭐ {restaurant.rating} ({restaurant.reviews} reviews) • {restaurant.time} mins • ₹{restaurant.priceForTwo} for two</Typography>
      <Typography>{restaurant.description}</Typography>

      <Tabs value={tab} onChange={(_event, value: number) => setTab(value)} variant="fullWidth" className="menu-tabs">
        {menuCategories.map((name) => <Tab key={name} label={name} />)}
      </Tabs>

      <Box className="card-grid">
        {visibleFoods.map((food) => {
          const cartItem = cartItems.find((item) => item.key === food.id + "-"); // plain item without add-ons
          return (
            <Card key={food.id}>
              <CardActionArea onClick={() => setSelectedFood(food)}>
                <CardMedia component="img" image={food.image} alt={food.name} className="food-image" />
              </CardActionArea>
              <CardContent className="food-content">
                <div className="food-name-row"><span className={food.veg ? "veg-dot" : "veg-dot nonveg"} /><Typography variant="h6">{food.name}</Typography></div>
                <Typography variant="body2" color="text.secondary">{food.description}</Typography>
                <Typography>₹{food.price}</Typography>
                {!food.available && <Typography color="error">Currently not available</Typography>}
                {food.available && cartItem && (
                  <QuantityButtons quantity={cartItem.quantity} onMinus={() => dispatch(changeQuantity({ key: cartItem.key, change: -1 }))} onPlus={() => dispatch(changeQuantity({ key: cartItem.key, change: 1 }))} />
                )}
                {food.available && !cartItem && <Button variant="contained" onClick={() => handleAdd(food, 1, [])}>Add to Cart</Button>}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {selectedFood && <FoodDetailsDialog key={selectedFood.id} food={selectedFood} onClose={() => setSelectedFood(null)} onAdd={handleAdd} />}

      <Dialog open={pendingItem !== null} onClose={() => setPendingItem(null)}>
        <DialogTitle>Replace cart items?</DialogTitle>
        <DialogContent><DialogContentText>Your cart has food from another restaurant. Do you want to clear it and add this item?</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingItem(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleReplaceCart}>Replace</Button>
        </DialogActions>
      </Dialog>
      <Toast toast={toast} onClose={() => setToast(emptyToast)} />
    </Box>
  );
}
export default RestaurantDetails;
