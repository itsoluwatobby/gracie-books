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
import { nanoid } from "nanoid/non-secure";
import { UserRole } from "../utils/constants";
import { browserAPI } from "../composables/local-storage";

class UsersService {
  private key = "wandyte-sales::unique_id";
  private usersRef = collection(ApplicationDB, "users");

  public async updateUser(email: string, updatedInfo: Partial<User>) {
    const docRef = doc(this.usersRef, email);
    await updateDoc(
      docRef,
      {
        ...updatedInfo,
        updatedAt: new Date().toISOString(),
      },
    );
  };

  // USERS
  public async addUser(user: Partial<User>) {
    const userId = nanoid();
    await setDoc(
      doc(this.usersRef, user.email),
      {
        ...user,
        id: userId,
        convoId: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    );
    return this.getUser(user.email!);
  };

  public async getUser(email: string) {
    const docRef = doc(ApplicationDB, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as User;
    } else {
      console.log("User not found");
      return null;
    }
  };

  public async getAdminUser () {
    const q = query(this.usersRef, where("role", "==", UserRole.admin));
    const querySnapShot = await getDocs(q);

    const support: User[] = [];
    querySnapShot.forEach((doc) => {
      support.push({ ...doc.data(), id: doc.id } as User);
    });

    if (support.length) return support[0];
    return null;
  };

  public async getOrAddUser (user: User) {
    const result = await this.getUser(user.email);
    if (result) return result;

    return this.addUser(user);
  };

  public async getUsers() {
    const q = query(this.usersRef, where("role", "!=", UserRole.admin));
    const querySnapShot = await getDocs(q);
    const users: User[] = [];
    querySnapShot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id } as User);
    });
    return users;
  };

  public getDeviceId() {
    const deviceId = browserAPI.get(this.key) as string
    if (deviceId) return deviceId
    const generatedId = `wandyte-sales::${nanoid()}`;
    browserAPI.add(this.key, generatedId)
    return generatedId;
  }
}
export const userService = new UsersService();