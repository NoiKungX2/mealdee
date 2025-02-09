import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Restaurant } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star } from "lucide-react";

export default function RestaurantsPage() {
  const { data: restaurants } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ร้านอาหารเพื่อสุขภาพแนะนำ</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {restaurants?.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden">
              {restaurant.imageUrl && (
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl mb-2">{restaurant.name}</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{restaurant.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Features and Dietary Options */}
                  <div className="flex flex-wrap gap-2">
                    {restaurant.healthyFeatures.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                    {restaurant.dietaryOptions.map((option) => (
                      <Badge key={option} variant="outline">
                        {option}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{restaurant.address}</span>
                    </div>
                    {restaurant.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{restaurant.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <div className="text-sm">
                        {restaurant.openingHours.map((hours, index) => (
                          <div key={index}>
                            {hours.day}: {hours.open}-{hours.close}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Menus */}
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">เมนูแนะนำ</h3>
                    <div className="space-y-2">
                      {restaurant.recommendedMenus.map((menu, index) => (
                        <div
                          key={index}
                          className="bg-white/50 p-3 rounded-lg"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{menu.name}</h4>
                            <span className="text-sm font-medium">
                              {menu.price} บาท
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {menu.description}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {menu.calories} แคลอรี่
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
