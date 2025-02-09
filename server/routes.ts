import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Profile routes
  app.post("/api/profile", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = await storage.updateUserProfile(req.user.id, req.body);
    res.json(user);
  });

  app.post("/api/water-goal", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = await storage.updateWaterGoal(req.user.id, req.body.goal);
    res.json(user);
  });

  // Meal routes
  app.post("/api/meals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const meal = await storage.createMeal({
      ...req.body,
      userId: req.user.id,
      time: new Date(req.body.time),
    });
    res.json(meal);
  });

  app.get("/api/meals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const meals = await storage.getMealsByUserId(req.user.id);
    res.json(meals);
  });

  // Water tracking routes
  app.post("/api/water-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const log = await storage.createWaterLog({
      ...req.body,
      userId: req.user.id,
      time: new Date(),
    });
    res.json(log);
  });

  app.get("/api/water-logs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const logs = await storage.getWaterLogsByUserId(req.user.id);
    res.json(logs);
  });

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    const restaurants = await storage.getRestaurants();
    res.json(restaurants);
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    const restaurant = await storage.getRestaurantById(parseInt(req.params.id));
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  });

  app.get("/api/restaurants/search/features", async (req, res) => {
    const features = req.query.features as string[];
    if (!features || !Array.isArray(features)) {
      return res.status(400).json({ message: "Invalid features parameter" });
    }
    const restaurants = await storage.getRestaurantsByFeatures(features);
    res.json(restaurants);
  });

  const httpServer = createServer(app);
  return httpServer;
}