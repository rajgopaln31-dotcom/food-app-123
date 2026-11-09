// All TypeScript types used in the project
export interface User { name: string; email: string; mobile: string; password: string; }
export interface Restaurant { id: number; name: string; category: string; rating: number; reviews: number; time: number; priceForTwo: number; image: string; description: string; }
export interface Food { id: number; restaurantId: number; name: string; price: number; veg: boolean; category: string; image: string; description: string; available: boolean; }
export interface AddOn { name: string; price: number; }
export interface CartItem { key: string; foodId: number; restaurantId: number; restaurantName: string; name: string; price: number; quantity: number; image: string; addOns: string; }
export interface Address { id: number; fullName: string; mobile: string; house: string; street: string; landmark: string; city: string; state: string; pin: string; instructions: string; }
export interface Order { id: string; restaurantName: string; items: CartItem[]; total: number; address: Address; paymentMethod: string; createdAt: number; }
