import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Minus, UtensilsCrossed } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Meal, WaterLog } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [newMeal, setNewMeal] = useState({ name: "", calories: "", type: "breakfast" });

  const { data: meals } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const { data: waterLogs } = useQuery<WaterLog[]>({
    queryKey: ["/api/water-logs"],
  });

  const addMealMutation = useMutation({
    mutationFn: async (meal: Partial<Meal>) => {
      const res = await apiRequest("POST", "/api/meals", {
        ...meal,
        time: new Date(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
    },
  });

  const addWaterMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest("POST", "/api/water-logs", { amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/water-logs"] });
    },
  });

  // คำนวณปริมาณน้ำที่ดื่มวันนี้
  const todayWaterAmount = waterLogs
    ?.filter((log) => {
      const today = new Date();
      const logDate = new Date(log.time);
      return (
        today.getFullYear() === logDate.getFullYear() &&
        today.getMonth() === logDate.getMonth() &&
        today.getDate() === logDate.getDate()
      );
    })
    .reduce((sum, log) => sum + log.amount, 0) ?? 0;

  const waterProgress = user?.waterGoal
    ? Math.min((todayWaterAmount / user.waterGoal) * 100, 100)
    : 0;

  // สร้างเมนูแนะนำตามข้อมูลผู้ใช้
  const getRecommendedMenus = () => {
    const profile = user?.profile;
    if (!profile) return [];

    const baseMenus = {
      weight_loss: [
        { name: "สลัดไก่อกย่าง", calories: 350 },
        { name: "ปลานึ่งมะนาว", calories: 200 },
        { name: "ข้าวกล้องผัดผัก", calories: 300 },
      ],
      weight_gain: [
        { name: "ข้าวไก่ย่างเทอริยากิ", calories: 550 },
        { name: "พาสต้าซอสครีม", calories: 600 },
        { name: "แซนด์วิชไข่อะโวคาโด", calories: 450 },
      ],
      muscle_gain: [
        { name: "อกไก่ย่างควินัว", calories: 400 },
        { name: "สเต็กปลาแซลมอน", calories: 450 },
        { name: "สลัดทูน่าไข่ต้ม", calories: 350 },
      ],
      healthy_eating: [
        { name: "ข้าวกล้องแกงเขียวหวานไก่", calories: 400 },
        { name: "สลัดผักรวมน้ำสลัดน้ำใส", calories: 250 },
        { name: "ซุปผักรวม", calories: 150 },
      ],
    };

    // กรองเมนูตามข้อจำกัดด้านอาหาร
    return baseMenus[profile.goal as keyof typeof baseMenus].filter((menu) => {
      const allergyWords = profile.allergies.map(allergy => allergy.toLowerCase());
      return !allergyWords.some(allergy => menu.name.toLowerCase().includes(allergy));
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">แดชบอร์ด</h1>

        {/* เมนูแนะนำ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              เมนูแนะนำวันนี้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {getRecommendedMenus().map((menu, index) => (
                <Card key={index} className="bg-white/50">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">{menu.name}</h3>
                    <p className="text-sm text-gray-600">{menu.calories} แคลอรี่</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* บันทึกมื้ออาหาร */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>บันทึกมื้ออาหารวันนี้</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มมื้ออาหาร
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>เพิ่มมื้ออาหาร</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">ชื่ออาหาร</Label>
                    <Input
                      id="name"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="calories">แคลอรี่</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    />
                  </div>
                  <Button 
                    onClick={() => {
                      addMealMutation.mutate({ 
                        name: newMeal.name,
                        calories: parseInt(newMeal.calories),
                        type: newMeal.type
                      });
                      setNewMeal({ name: "", calories: "", type: "breakfast" });
                    }}
                  >
                    บันทึก
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {meals
                ?.filter((meal) => {
                  const today = new Date();
                  const mealDate = new Date(meal.time);
                  return (
                    today.getFullYear() === mealDate.getFullYear() &&
                    today.getMonth() === mealDate.getMonth() &&
                    today.getDate() === mealDate.getDate()
                  );
                })
                .map((meal) => (
                  <div
                    key={meal.id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(meal.time).toLocaleTimeString("th-TH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {meal.calories && (
                      <span className="text-sm text-gray-600">
                        {meal.calories} แคลอรี่
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ติดตามการดื่มน้ำ */}
          <Card>
            <CardHeader>
              <CardTitle>การดื่มน้ำวันนี้</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={waterProgress} className="h-2" />
                <p className="text-center">
                  {todayWaterAmount} / {user?.waterGoal ?? 0} มล.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addWaterMutation.mutate(250)}
                    disabled={addWaterMutation.isPending}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addWaterMutation.mutate(-250)}
                    disabled={addWaterMutation.isPending}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ข้อมูลเป้าหมาย */}
          <Card>
            <CardHeader>
              <CardTitle>เป้าหมายของคุณ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>เป้าหมาย:</strong>{" "}
                  {user?.profile?.goal === "weight_loss"
                    ? "ลดน้ำหนัก"
                    : user?.profile?.goal === "weight_gain"
                    ? "เพิ่มน้ำหนัก"
                    : user?.profile?.goal === "muscle_gain"
                    ? "เพิ่มกล้ามเนื้อ"
                    : "กินเพื่อสุขภาพ"}
                </p>
                <p>
                  <strong>ระดับความเข้มข้น:</strong>{" "}
                  {user?.profile?.intensity === "low"
                    ? "เบา"
                    : user?.profile?.intensity === "medium"
                    ? "ปานกลาง"
                    : "เข้มข้น"}
                </p>
                <p>
                  <strong>จำนวนมื้อต่อวัน:</strong> {user?.profile?.mealsPerDay} มื้อ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}