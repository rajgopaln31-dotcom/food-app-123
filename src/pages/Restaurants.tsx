import { useEffect, useState } from "react";
import { Box, Typography, TextField, Chip, MenuItem, FormControlLabel, Switch, Paper, Button, Alert } from "@mui/material";
import { Restaurant, Food } from "../types";
import { getRestaurants, getAllFoods } from "../services/api";
import { categories } from "../data/mockData";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSearch, setCategory, setSort } from "../slices/restaurantSlice";
import RestaurantCard from "../components/RestaurantCard";
import CardSkeleton from "../components/CardSkeleton";
import "./Restaurants.css";

function Restaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [onlyTopRated, setOnlyTopRated] = useState(false);
  const { search, category, sort } = useAppSelector((state) => state.restaurant);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([getRestaurants(), getAllFoods()])
      .then(([restaurantList, foodList]) => { setRestaurants(restaurantList); setFoods(foodList); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Step 1: search by restaurant name, category or food name
  const text = search.toLowerCase();
  let result = restaurants.filter((r) =>
    r.name.toLowerCase().includes(text) || r.category.toLowerCase().includes(text) ||
    foods.some((f) => f.restaurantId === r.id && f.name.toLowerCase().includes(text))
  );
  // Step 2: filter by category and rating
  if (category !== "All") result = result.filter((r) => r.category === category);
  if (onlyTopRated) result = result.filter((r) => r.rating >= 4);
  // Step 3: sort
  if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
  if (sort === "time") result = [...result].sort((a, b) => a.time - b.time);

  const clearAll = () => { dispatch(setSearch("")); dispatch(setCategory("All")); dispatch(setSort("none")); setOnlyTopRated(false); };

  return (
    <Box>
      <Typography variant="h5">Restaurants</Typography>
      <Box className="filter-row">
        <TextField size="small" label="Search restaurants or food" value={search} onChange={(e) => dispatch(setSearch(e.target.value))} className="filter-search" />
        <TextField select size="small" label="Sort by" value={sort} onChange={(e) => dispatch(setSort(e.target.value))} className="filter-sort">
          <MenuItem value="none">Default</MenuItem>
          <MenuItem value="rating">Rating (high to low)</MenuItem>
          <MenuItem value="time">Delivery time (fast first)</MenuItem>
        </TextField>
        <FormControlLabel control={<Switch checked={onlyTopRated} onChange={(e) => setOnlyTopRated(e.target.checked)} />} label="Rating 4.0+" />
      </Box>
      <Box className="chip-row">
        {["All", ...categories.map((c) => c.name)].map((name) => (
          <Chip key={name} label={name} color={category === name ? "primary" : "default"} onClick={() => dispatch(setCategory(name))} />
        ))}
      </Box>

      {error && <Alert severity="error">Could not load restaurants. Please refresh.</Alert>}
      {loading && <CardSkeleton />}
      {!loading && !error && result.length > 0 && (
        <>
          <Typography className="section-title">{result.length} restaurants found</Typography>
          <Box className="card-grid">{result.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</Box>
        </>
      )}
      {!loading && !error && result.length === 0 && (
        <Paper className="empty-box">
          <Typography variant="h6">No restaurants match your search</Typography>
          <Button variant="contained" onClick={clearAll}>Clear Search and Filters</Button>
        </Paper>
      )}
    </Box>
  );
}
export default Restaurants;
