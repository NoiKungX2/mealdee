import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ProfileSetup() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      allergies: [],
      diseases: [],
      goal: "",
      intensity: "",
      mealTimes: [],
      mealsPerDay: 3,
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/profile", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
      });
      setLocation("/dashboard");
    },
  });

  const onSubmit = (data: any) => {
    profileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-8">ตั้งค่าโปรไฟล์</h1>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>แพ้อาหาร (คั่นด้วยเครื่องหมาย ,)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(",").map((s) => s.trim()))
                        }
                        value={field.value.join(", ")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="diseases"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>โรคประจำตัว (คั่นด้วยเครื่องหมาย ,)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(",").map((s) => s.trim()))
                        }
                        value={field.value.join(", ")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เป้าหมาย</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกเป้าหมายของคุณ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weight_loss">ลดน้ำหนัก</SelectItem>
                        <SelectItem value="weight_gain">เพิ่มน้ำหนัก</SelectItem>
                        <SelectItem value="muscle_gain">เพิ่มกล้ามเนื้อ</SelectItem>
                        <SelectItem value="healthy_eating">กินเพื่อสุขภาพ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ระดับความเข้มข้น</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกระดับความเข้มข้น" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">เบา</SelectItem>
                        <SelectItem value="medium">ปานกลาง</SelectItem>
                        <SelectItem value="high">เข้มข้น</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mealsPerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จำนวนมื้อต่อวัน</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mealTimes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เวลาทานอาหาร (คั่นด้วยเครื่องหมาย ,)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.split(",").map((s) => s.trim()))
                        }
                        value={field.value.join(", ")}
                        placeholder="07:00, 12:00, 18:00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={profileMutation.isPending}
              >
                บันทึกข้อมูล
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
