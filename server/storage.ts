import { InsertUser, User, Meal, WaterLog, Profile, Restaurant, InsertRestaurant } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: number, profile: Profile): Promise<User>;
  updateWaterGoal(userId: number, goal: number): Promise<User>;

  createMeal(meal: Omit<Meal, "id">): Promise<Meal>;
  getMealsByUserId(userId: number): Promise<Meal[]>;

  createWaterLog(log: Omit<WaterLog, "id">): Promise<WaterLog>;
  getWaterLogsByUserId(userId: number): Promise<WaterLog[]>;

  // New restaurant methods
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;
  getRestaurantsByFeatures(features: string[]): Promise<Restaurant[]>;

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private meals: Map<number, Meal>;
  private waterLogs: Map<number, WaterLog>;
  private restaurants: Map<number, Restaurant>;
  private currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.meals = new Map();
    this.waterLogs = new Map();
    this.restaurants = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Add some initial restaurant data
    this.initializeRestaurants();
  }

  private initializeRestaurants() {
    const initialRestaurants: InsertRestaurant[] = [
      {
        name: "สวนผักออร์แกนิค",
        description: "ร้านอาหารสุขภาพที่ใช้ผักออร์แกนิคปลูกเองจากสวน",
        address: "ซอยสุขุมวิท 49 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ",
        phone: "02-123-4567",
        imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
        healthyFeatures: ["ออร์แกนิค", "ไม่ใช้ผงชูรส", "ไม่มีน้ำมันทอดซ้ำ"],
        dietaryOptions: ["มังสวิรัติ", "วีแกน", "แพ้แป้งสาลี"],
        recommendedMenus: [
          {
            name: "สลัดผักรวมออร์แกนิค",
            description: "สลัดผักสดจากสวน พร้อมน้ำสลัดโยเกิร์ตธรรมชาติ",
            calories: 150,
            price: 220,
          },
          {
            name: "ข้าวกล้องผัดผักรวม",
            description: "ข้าวกล้องผัดกับผักออร์แกนิคหลากชนิด",
            calories: 300,
            price: 180,
          },
        ],
        rating: 4,
        openingHours: [
          { day: "จันทร์-ศุกร์", open: "10:00", close: "21:00" },
          { day: "เสาร์-อาทิตย์", open: "11:00", close: "22:00" },
        ],
      },
      {
        name: "ครัวสุขภาพดี",
        description: "ร้านอาหารคลีนที่คัดสรรวัตถุดิบคุณภาพ เน้นเมนูโปรตีนสูง",
        address: "ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ",
        phone: "02-987-6543",
        imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
        healthyFeatures: ["อาหารคลีน", "โปรตีนสูง", "ไขมันต่ำ"],
        dietaryOptions: ["คีโต", "โลวคาร์บ", "ไม่มีน้ำตาล"],
        recommendedMenus: [
          {
            name: "อกไก่ย่างสมุนไพร",
            description: "อกไก่ย่างหมักสมุนไพรไทย เสิร์ฟพร้อมผักย่าง",
            calories: 250,
            price: 180,
          },
          {
            name: "สเต็กปลาแซลมอน",
            description: "ปลาแซลมอนย่าง เสิร์ฟพร้อมผักรวมนึ่ง",
            calories: 350,
            price: 290,
          },
        ],
        rating: 5,
        openingHours: [
          { day: "ทุกวัน", open: "10:00", close: "20:00" },
        ],
      },
    ];

    initialRestaurants.forEach((restaurant) => {
      this.createRestaurant(restaurant);
    });
  }

  // Existing methods remain unchanged
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, profile: null, waterGoal: null, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(userId: number, profile: Profile): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, profile };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateWaterGoal(userId: number, goal: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, waterGoal: goal };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createMeal(meal: Omit<Meal, "id">): Promise<Meal> {
    const id = this.currentId++;
    const newMeal = { ...meal, id };
    this.meals.set(id, newMeal);
    return newMeal;
  }

  async getMealsByUserId(userId: number): Promise<Meal[]> {
    return Array.from(this.meals.values()).filter(
      (meal) => meal.userId === userId,
    );
  }

  async createWaterLog(log: Omit<WaterLog, "id">): Promise<WaterLog> {
    const id = this.currentId++;
    const newLog = { ...log, id };
    this.waterLogs.set(id, newLog);
    return newLog;
  }

  async getWaterLogsByUserId(userId: number): Promise<WaterLog[]> {
    return Array.from(this.waterLogs.values()).filter(
      (log) => log.userId === userId,
    );
  }

  // New restaurant methods
  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentId++;
    const newRestaurant: Restaurant = {
      ...restaurant,
      id,
      createdAt: new Date(),
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async getRestaurantsByFeatures(features: string[]): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter((restaurant) =>
      features.some((feature) =>
        restaurant.healthyFeatures.includes(feature) ||
        restaurant.dietaryOptions.includes(feature)
      )
    );
  }
}

export const storage = new MemStorage();