import { api } from "@/lib/axios";

export interface RegisterResturantBody {
  restaurantName: string;
  managerName: string;
  email: string;
  phone: string
}

export async function registerResturant({
    restaurantName,
    managerName,
    email,
    phone
}: RegisterResturantBody) {
  await api.post('/restaurants', {
    restaurantName,
    managerName,
    email,
    phone
  })
}