import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Droplets, Settings } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !user.profile) {
      setLocation("/profile-setup");
    }
  }, [user]);

  if (user && !user.profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-green-600 text-transparent bg-clip-text">
            ยินดีต้อนรับสู่ Mealdee
          </h1>
          <p className="text-gray-600 text-lg">
            วางแผนและติดตามการรับประทานอาหารเพื่อสุขภาพที่ดี
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Utensils className="h-12 w-12 text-teal-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">บันทึกมื้ออาหาร</h2>
              <p className="text-gray-600 mb-4">
                ติดตามและบันทึกมื้ออาหารของคุณเพื่อสุขภาพที่ดี
              </p>
              <Button onClick={() => setLocation("/dashboard")} className="w-full">
                เริ่มบันทึก
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Droplets className="h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">ติดตามการดื่มน้ำ</h2>
              <p className="text-gray-600 mb-4">
                ดื่มน้ำให้เพียงพอตามเป้าหมายที่ตั้งไว้
              </p>
              <Button onClick={() => setLocation("/dashboard")} className="w-full">
                ดูเป้าหมาย
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Settings className="h-12 w-12 text-gray-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">ตั้งค่าโปรไฟล์</h2>
              <p className="text-gray-600 mb-4">
                ปรับแต่งการแนะนำให้เหมาะกับคุณ
              </p>
              <Button onClick={() => setLocation("/profile-setup")} className="w-full">
                แก้ไขโปรไฟล์
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352"
            alt="Healthy meals"
            className="rounded-lg shadow-xl"
          />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-4">เริ่มต้นชีวิตที่ดีต่อสุขภาพ</h2>
            <p className="text-gray-600 mb-6">
              Mealdee จะช่วยให้คุณวางแผนมื้ออาหาร ติดตามการดื่มน้ำ
              และสร้างนิสัยการกินที่ดีเพื่อสุขภาพที่ดีในระยะยาว
            </p>
            <Button onClick={() => setLocation("/dashboard")} size="lg">
              ไปที่แดชบอร์ด
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
