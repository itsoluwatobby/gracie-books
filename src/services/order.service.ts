import { ApplicationDB } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { userService } from "./user.service";
import { StorageModels } from "../utils/constants";


class OrdersService {
  private ordersRef = collection(ApplicationDB, StorageModels.orders);

  public async updateOrder(id: string, updatedInfo: Partial<Order>) {
    const docRef = doc(this.ordersRef, id);
    await updateDoc(
      docRef,
      {
        ...updatedInfo,
        updatedAt: new Date().toISOString(),
      },
    );
    return this.getOrder(id);
  };

  // ORDERS
  public async addOrder(order: Partial<Order>, userId: string) {
    await setDoc(
      doc(this.ordersRef, order.id),
      {
        ...order,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    );
    await userService.updateUser(userId, { shippingAddress: order.shippingAddress })
    return this.getOrder(order.id!);
  };

  public async getOrder(orderId: string) {
    const docRef = doc(ApplicationDB, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Order;
    } else {
      console.log("Order not found");
      return null;
    }
  };

  // public async getOrAddOrder (order: Order) {
  //   const result = await this.getOrder(order.userId);
  //   if (result) return result;

  //   return this.addOrder(order);
  // };

  public async getOrders(userId: string) {
    const q = query(this.ordersRef, where("userId", "==", userId));
    const querySnapShot = await getDocs(q);
    const orders: Order[] = [];
    querySnapShot.forEach((doc) => {
      orders.push({ ...doc.data(), id: doc.id } as Order);
    });
    return orders;
  };

  public async getAllOrders() {
    const q = query(this.ordersRef);
    const querySnapShot = await getDocs(q);
    const orders: Order[] = [];
    querySnapShot.forEach((doc) => {
      orders.push({ ...doc.data(), id: doc.id } as Order);
    });
    return orders;
  };
}
export const orderService = new OrdersService();