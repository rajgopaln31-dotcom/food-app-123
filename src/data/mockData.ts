import { Restaurant, Food, AddOn } from "../types";

export const categories = [
  { name: "Pizza", image: "/images/pizza.svg" },
  { name: "Burger", image: "/images/burger.svg" },
  { name: "Biryani", image: "/images/biryani.svg" },
  { name: "Chinese", image: "/images/chinese.svg" },
  { name: "Dessert", image: "/images/dessert.svg" },
  { name: "South Indian", image: "/images/dosa.svg" },
];
export const locations = ["Hyderabad", "Bengaluru", "Chennai", "Anantapur"];
export const addOns: AddOn[] = [
  { name: "Extra Cheese", price: 30 },
  { name: "Extra Sauce", price: 20 },
  { name: "Large Size", price: 60 },
];
export const restaurants: Restaurant[] = [
  { id: 1, name: "Pizza Palace", category: "Pizza", rating: 4.5, reviews: 320, time: 30, priceForTwo: 500, image: "/images/pizza.svg", description: "Freshly baked pizzas with lots of cheese." },
  { id: 2, name: "Burger Hub", category: "Burger", rating: 4.2, reviews: 210, time: 25, priceForTwo: 350, image: "/images/burger.svg", description: "Juicy burgers, crispy fries and cool shakes." },
  { id: 3, name: "Biryani House", category: "Biryani", rating: 4.7, reviews: 540, time: 40, priceForTwo: 600, image: "/images/biryani.svg", description: "Authentic dum biryani cooked with spices." },
  { id: 4, name: "Dragon Wok", category: "Chinese", rating: 3.9, reviews: 150, time: 35, priceForTwo: 450, image: "/images/chinese.svg", description: "Indo-Chinese favourites made fresh." },
  { id: 5, name: "Sweet Tooth", category: "Dessert", rating: 4.6, reviews: 280, time: 20, priceForTwo: 300, image: "/images/dessert.svg", description: "Cakes, sundaes and Indian sweets." },
  { id: 6, name: "Dosa Corner", category: "South Indian", rating: 4.4, reviews: 400, time: 25, priceForTwo: 250, image: "/images/dosa.svg", description: "Crispy dosas, soft idlis and filter coffee." },
];

// Small helper so every food needs only one short line
function makeFood(id: number, restaurantId: number, name: string, price: number, veg: boolean, category: string, image: string, description: string, available = true): Food {
  return { id, restaurantId, name, price, veg, category, image: `/images/${image}.svg`, description, available };
}
export const foods: Food[] = [
  makeFood(1, 1, "Garlic Bread", 129, true, "Starters", "pizza", "Toasted bread with garlic butter"),
  makeFood(2, 1, "Margherita Pizza", 249, true, "Main Course", "pizza", "Classic cheese and tomato pizza"),
  makeFood(3, 1, "Chocolate Lava Cake", 99, true, "Desserts", "pizza", "Warm cake with melting chocolate", false),
  makeFood(4, 2, "French Fries", 99, true, "Starters", "burger", "Crispy salted fries"),
  makeFood(5, 2, "Chicken Burger", 179, false, "Main Course", "burger", "Grilled chicken patty with sauce"),
  makeFood(6, 2, "Chocolate Shake", 129, true, "Desserts", "burger", "Thick and creamy chocolate shake"),
  makeFood(7, 3, "Chicken 65", 150, false, "Starters", "biryani", "Spicy fried chicken bites"),
  makeFood(8, 3, "Chicken Biryani", 280, false, "Main Course", "biryani", "Dum biryani with raita"),
  makeFood(9, 3, "Gulab Jamun", 80, true, "Desserts", "biryani", "Sweet milk balls in sugar syrup"),
  makeFood(10, 4, "Veg Spring Rolls", 140, true, "Starters", "chinese", "Crispy rolls with veggies"),
  makeFood(11, 4, "Chicken Fried Rice", 220, false, "Main Course", "chinese", "Wok tossed rice with chicken"),
  makeFood(12, 4, "Vanilla Ice Cream", 90, true, "Desserts", "chinese", "Two scoops of vanilla"),
  makeFood(13, 5, "Fruit Salad", 120, true, "Starters", "dessert", "Fresh seasonal fruits"),
  makeFood(14, 5, "Brownie Sundae", 199, true, "Main Course", "dessert", "Brownie with ice cream and sauce"),
  makeFood(15, 5, "Rasmalai", 110, true, "Desserts", "dessert", "Soft paneer discs in sweet milk"),
  makeFood(16, 6, "Idli Vada", 70, true, "Starters", "dosa", "Two idlis and one vada"),
  makeFood(17, 6, "Masala Dosa", 110, true, "Main Course", "dosa", "Crispy dosa with potato masala"),
  makeFood(18, 6, "Rava Kesari", 60, true, "Desserts", "dosa", "Sweet semolina dessert"),
];
