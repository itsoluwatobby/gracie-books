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
import { StorageKey, StorageModels, UserRole } from "../utils/constants";
import { browserAPI } from "../composables/local-storage";

class UsersService {
  private usersRef = collection(ApplicationDB, StorageModels.users);

  public async updateUser(userId: string, updatedInfo: Partial<UserInfo>) {
    const docRef = doc(this.usersRef, userId);
    await updateDoc(
      docRef,
      {
        ...updatedInfo,
        updatedAt: new Date().toISOString(),
      },
    );

    return this.getUser(userId);
  };

  // USERS
  public async addUser(user: Partial<UserInfo> | null) {
    if (!user) return null;

    const duplicateRecord = await this.getUser(user.id!);
    if (duplicateRecord) {
      await this.updateUser(duplicateRecord.id, { isLoggedIn: true });
      return { ...duplicateRecord, isLoggedIn: true };
    }
  
    await setDoc(
      doc(this.usersRef, user.id),
      {
        ...user,
        role: UserRole.user,
        isAdmin: false,
        deviceId: userService.getDeviceId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    );
    return this.getUser(user.id!);
  };

  public async getUser(userId: string) {
    const docRef = doc(ApplicationDB, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserInfo;
    }
    return null;
  };

  public async getUserById(userId: string) {
    const q = query(this.usersRef, where("id", "==", userId));
    const querySnapShot = await getDocs(q);

    let user: UserInfo | null = null;
    querySnapShot.forEach((doc) => {
      user = doc.data() as UserInfo;
    });
    return user;
  };

  public async getOrAddUser(user: Partial<UserInfo> | null) {
    if (!user) return null;

    const result = await this.getUser(user.id!);
    if (result) return result;

    return this.addUser(user);
  };

  public async getUsers() {
    const q = query(this.usersRef, where("role", "!=", UserRole.admin));
    const querySnapShot = await getDocs(q);
    const users: UserInfo[] = [];
    querySnapShot.forEach((doc) => {
      users.push(doc.data() as UserInfo);
    });
    return users;
  };

  public getDeviceId() {
    let deviceId = browserAPI.get(StorageKey.deviceKey) as string;
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
      browserAPI.add(StorageKey.deviceKey, deviceId);
    }
    return deviceId;
  }
}
export const userService = new UsersService();