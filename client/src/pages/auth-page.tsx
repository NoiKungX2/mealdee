import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-green-600 text-transparent bg-clip-text">
            Mealdee
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            วางแผนและติดตามการรับประทานอาหารเพื่อสุขภาพที่ดีของคุณ
          </p>
          
          <Card className="p-6">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="register">สมัครสมาชิก</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}>
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>ชื่อผู้ใช้</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>รหัสผ่าน</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}>
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>ชื่อผู้ใช้</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel>รหัสผ่าน</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      สมัครสมาชิก
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <div className="hidden md:flex flex-col justify-center">
          <img
            src="https://images.unsplash.com/photo-1493770348161-369560ae357d"
            alt="Healthy food"
            className="rounded-lg shadow-xl mb-4"
          />
          <div className="bg-white/80 backdrop-blur p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              เริ่มต้นการใช้ชีวิตที่ดีต่อสุขภาพ
            </h2>
            <p className="text-gray-600">
              Mealdee จะช่วยให้คุณวางแผนมื้ออาหาร ติดตามการดื่มน้ำ 
              และสร้างนิสัยการกินที่ดีเพื่อสุขภาพที่ดีในระยะยาว
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
