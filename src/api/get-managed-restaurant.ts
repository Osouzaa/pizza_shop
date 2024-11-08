import { api } from "@/lib/axios";

export interface GetManagerdRestaurant {
  name: string;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  description: string | null;
  managerId: string | null;
}

export async function getManagedRestaurant() {
    const response = await api.get<GetManagerdRestaurant>('/managed-restaurant')

    return response.data
}