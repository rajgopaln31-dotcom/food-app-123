import { restaurants, foods } from "../data/mockData";
import { Restaurant, Food } from "../types";

// The real backend URL would come from the .env file. We use mock data now.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// Pretend the server takes some time to reply
const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function getRestaurants(): Promise<Restaurant[]> {
  await wait(500);
  return restaurants;
}
export async function getAllFoods(): Promise<Food[]> {
  await wait(500);
  return foods;
}
export async function getFoods(restaurantId: number): Promise<Food[]> {
  await wait(400);
  return foods.filter((food) => food.restaurantId === restaurantId);
}
