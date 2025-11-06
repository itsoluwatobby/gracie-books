import { ApplicationDB } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  arrayUnion,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { StorageModels } from "../utils/constants";
// import { nanoid } from "nanoid/non-secure";
// import { browserAPI } from "../composables/local-storage";

class CartsService {
  private cartsRef = collection(ApplicationDB, StorageModels.carts);

  public async updateCart(userId: string, bookId: string, quantity: number): Promise<CartItem[] | null> {
    const docRef = doc(ApplicationDB, "carts", userId);
    const docSnap = await getDoc(docRef);

    const status = "pending";
    if (docSnap.exists()) {
      const cartData = docSnap.data();
      const items: CartItem[] = cartData.items || [];
      const existingItem = items.find(
        (item) => item.book.id === bookId && item.status === status
      );
      
      if (existingItem) {
        // Update existing item in the array
        let updatedItems;
        if (quantity >= 1) {
          updatedItems = items.map((item) =>
            item.book.id === bookId && item.status === status
              ? {
                  ...item,
                  quantity,
                  price: quantity * item.book.price,
                  updatedAt: new Date().toISOString(),
                }
              : item
          );
        } else {
          updatedItems = items.filter((item) => item.book.id !== bookId && item.status === status);
        }
        console.log(updatedItems)
        await updateDoc(docRef, { items: updatedItems, updatedAt: new Date().toISOString() });
      } else {
        throw new Error("Item not found")
      }
    } else {
      throw new Error("Item not found")
    }

    return this.getCart(userId, status);
  }

  async clearCart(userId: string) {
    const docRef = doc(ApplicationDB, "carts", userId);
    const docSnap = await getDoc(docRef);

    const status = "pending";
    if (docSnap.exists()) {
      const cartData = docSnap.data();
      const items: CartItem[] = cartData.items || [];

      const updatedItems = items.filter((item) => item.status !== status);
      console.log(updatedItems)
      await updateDoc(docRef, { items: updatedItems, updatedAt: new Date().toISOString() });
    } else {
      throw new Error("Cart empty")
    }
  }

  async addCart(cart: CartItem): Promise<CartItem[] | null> {
    if (!cart.userId || !cart.book?.id || !cart.status) {
      throw new Error("Missing required cart fields: userId, book.id, or status");
    }

    const docRef = doc(ApplicationDB, "carts", cart.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cartData = docSnap.data();
      const items: CartItem[] = cartData.items || [];
      const existingItem = items.find(
        (item) => item.book.id === cart.book.id && item.status === cart.status
      );

      if (existingItem) {
        // Update existing item in the array
        const updatedItems = items.map((item) =>
          item.book.id === cart.book.id && item.status === cart.status
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
                price: (item.price || 0) + cart.book.price,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        await updateDoc(docRef, { items: updatedItems, updatedAt: new Date().toISOString() });
      } else {
        // Add new item to the array
        const newItem = {
          ...cart,
          id: doc(collection(ApplicationDB, "carts")).id, // Unique ID for the item
          quantity: cart.quantity || 1,
          price: cart.book.price || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(docRef, {
          items: arrayUnion(newItem),
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      const newItem = {
        ...cart,
        id: doc(collection(ApplicationDB, "carts")).id,
        quantity: cart.quantity || 1,
        price: cart.book.price || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, {
        userId: cart.userId,
        items: [newItem],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return this.getCart(cart.userId, cart.status);
  }

  async getCart(userId: string, status: CartStatus): Promise<CartItem[] | null> {
    const docRef = doc(ApplicationDB, "carts", userId);
    const querySnapshot = await getDoc(docRef);

    if (!querySnapshot.exists()) {
      console.log(`No cart items found for user ${userId} with status ${status}`);
      return null;
    }

    const items = querySnapshot.data().items as unknown as CartItem[];
    if (!items.length) {
      console.log(`No cart items found for user ${userId} with status ${status}`);
      return null;
    }

    return items.filter((item) => item.status === status);
  }

  // public async getCart(userId: string, status: CartStatus) {
  //   const q = query(
  //     this.cartsRef,
  //     where("userId", "==", userId),
  //     // where("book.id", "==", cartId),
  //     where("status", "==", status),
  //   );
  //   const querySnapshot = await getDocs(q);

  //   if (querySnapshot.empty) {
  //     console.log(`No cart items found for user ${userId} with status ${status}`);
  //     return null;
  //   }

  //   return querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   } as CartItem));
  // };

  // public async getOrAddCart (cart: CartItem) {
  //   const result = await this.getCart(cart.userId);
  //   if (result) return result;

  //   return this.addCart(cart);
  // };

  public async getCarts(userId: string) {
    const q = query(this.cartsRef, where("userId", "==", userId));
    const querySnapShot = await getDocs(q);
    const carts: CartItem[] = [];
    querySnapShot.forEach((doc) => {
      carts.push({ ...doc.data(), id: doc.id } as CartItem);
    });
    return carts;
  };
}
export const cartService = new CartsService();