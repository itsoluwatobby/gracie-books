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
import { UserRole } from "../utils/constants";
import { browserAPI } from "../composables/local-storage";

class UsersService {
  private key = "wandyte-sales::unique_id";
  private usersRef = collection(ApplicationDB, "users");

  public async updateUser(email: string, updatedInfo: Partial<UserInfo>) {
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
  public async addUser(user: Partial<UserInfo> | null) {
    if (!user) return null;

    const duplicateRecord = await this.getUser(user.email!);
    if (duplicateRecord) {
      await this.updateUser(duplicateRecord.email, { isLoggedIn: true });
      return { ...duplicateRecord, isLoggedIn: true };
    }
  
    await setDoc(
      doc(this.usersRef, user.email),
      {
        ...user,
        deviceId: userService.getDeviceId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    );
    return this.getUser(user.email!);
  };

  // public async getUserWithoutError(email: string) {
  //   const docRef = doc(ApplicationDB, "users", email);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     return { ...docSnap.data(), id: docSnap.id } as UserInfo;
  //   } else {
  //     console.log("UserInfo not found");
  //     return null;
  //   }
  // };

  public async getUser(email: string) {
    const docRef = doc(ApplicationDB, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as UserInfo;
    }
    return null;
  };

  public async getAdminUser() {
    const q = query(this.usersRef, where("role", "==", UserRole.admin));
    const querySnapShot = await getDocs(q);

    const support: UserInfo[] = [];
    querySnapShot.forEach((doc) => {
      support.push({ ...doc.data(), id: doc.id } as UserInfo);
    });

    if (support.length) return support[0];
    return null;
  };

  public async getOrAddUser(user: Partial<UserInfo> | null) {
    if (!user) return null;

    const result = await this.getUser(user.email!);
    if (result) return result;

    return this.addUser(user);
  };

  public async getUsers() {
    const q = query(this.usersRef, where("role", "!=", UserRole.admin));
    const querySnapShot = await getDocs(q);
    const users: UserInfo[] = [];
    querySnapShot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id } as UserInfo);
    });
    return users;
  };

  public getDeviceId() {
    let deviceId = browserAPI.get(this.key);
    if (!deviceId) {
      const navigator = window.navigator;
      const screen = window.screen;
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset()
      ].join('|');
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
        hash = hash & hash;
      }
      deviceId = 'device_' + `wandyte::${Math.abs(hash).toString(36)}`;
      browserAPI.add(this.key, deviceId);
    }
    return deviceId;
  }
}
export const userService = new UsersService();