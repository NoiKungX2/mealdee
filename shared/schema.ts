import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  profile: json("profile").$type<{
    allergies: string[];
    diseases: string[];
    goal: string;
    intensity: string;
    mealTimes: string[];
    mealsPerDay: number;
  }>(),
  waterGoal: integer("water_goal"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  calories: integer("calories"),
  time: timestamp("time").notNull(),
  imageUrl: text("image_url"),
});

export const waterLogs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  time: timestamp("time").notNull(),
});

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  imageUrl: text("image_url"),
  healthyFeatures: json("healthy_features").$type<string[]>(),
  dietaryOptions: json("dietary_options").$type<string[]>(),
  recommendedMenus: json("recommended_menus").$type<{
    name: string;
    description: string;
    calories: number;
    price: number;
  }[]>(),
  rating: integer("rating"),
  openingHours: json("opening_hours").$type<{
    day: string;
    open: string;
    close: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const profileSchema = z.object({
  allergies: z.array(z.string()),
  diseases: z.array(z.string()),
  goal: z.string(),
  intensity: z.string(),
  mealTimes: z.array(z.string()),
  mealsPerDay: z.number(),
});

export const insertMealSchema = createInsertSchema(meals);
export const insertWaterLogSchema = createInsertSchema(waterLogs);

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type WaterLog = typeof waterLogs.$inferSelect;
export type Profile = z.infer<typeof profileSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;