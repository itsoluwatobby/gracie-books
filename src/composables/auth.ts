/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "../firebase/config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  OAuthProvider,
  signOut,
  type User,
  confirmPasswordReset,
  // onAuthStateChanged,
} from "firebase/auth";
import { browserAPI } from "./local-storage";
import { helper } from "../utils/helper";
import { StorageKey } from "../utils/constants";


// onAuthStateChanged(auth, (user) => {
//   console.log({ user })
//   if (user) {
//     console.log('User is signed in:', user.uid);
//     // Show user profile
//   } else {
//     console.log('User is signed out');
//     // Show login
//   }
// });

class UserAuthenticationAPI {
  public static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  public static PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$£%^&*()_+\-=[\]{};:'"~|/\\,.<>/?])[A-Za-z\d!@#$£%^&*()_+\-=[\]{};:'"~|/\\,.<>/?]{9,25}$/;
  
  token: string | null = null;

  public PasswordRegexBreakDown = {
    uppercase: /(?=.*[A-Z])/,
    lowercase: /(?=.*[a-z])/,
    digit: /(?=.*\d)/,
    symbol: /(?=.*[!@#$£%^&*()_+\-=[\]{};:'"~|/\\ ,.<>/?])/,
    minLength: /[A-Za-z\d!@#$£%^&*()_+\-=[\]{};:'"~|/\\,.<>/?]{9,}/,
    maxLength: /[A-Za-z\d!@#$£%^&*()_+\-=[\]{};:'"~|/\\,.<>/?]{,25}/,
  };

  setTokenValue(accessToken: string) {
    this.token = accessToken;
    localStorage.setItem("wandyte-token", JSON.stringify({ accessToken }));
  };

  async getRefreshToken() {
    const user = auth.currentUser;
    if (!user) return null;
    const newToken = await user?.getIdToken(true);
    this.setTokenValue(newToken!);
    return newToken;
  };

  async loginWithEmailAndPassword(credentials: UserCredentials) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials?.email,
        credentials?.password,
      );

      return userCredential.user;
    } catch(error: any) {
      console.log(error);
      const errorCode = error.code;
      throw new Error(errorCode);
    }
  };

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const userCredential = await signInWithPopup(auth, provider)
      return userCredential.user;
    } catch(error: any) {
      const errorCode = error.code;
      throw new Error(errorCode);
    }
  };

  async loginWithApple() {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    provider.addScope("phone");
    provider.addScope("address");

    try {
      const userCredential = await signInWithPopup(auth, provider)
      return userCredential.user;
    } catch(error: any) {
      const errorCode = error.code;
      throw new Error(errorCode);
    }
  };

  private async constructUserInfo(
    user: User,
    signInMethod: SignupProps["signInMethod"],
  ): Promise<Partial<UserInfo>> {
    const accessToken = await user.getIdToken();
    this.setTokenValue(accessToken);

    browserAPI.add(StorageKey.userKey, user.uid);
    return {
      id: user.uid,
      fullName: user?.displayName ?? null,
      email: user.email!,
      profilePicture: user.photoURL ?? null,
      phoneNumber: user.phoneNumber ?? null,
      accessToken: accessToken,
      refreshToken: user.refreshToken,
      provider: signInMethod,
      isLoggedIn: true,
    };
  }

  async login({ signInMethod, credentials }: SignupProps): Promise<any> {
    let user: User;
    if (signInMethod === "password") {
      user = await this.loginWithEmailAndPassword(credentials!);
    } else if (signInMethod === "google.com") {
      user = await this.loginWithGoogle();
    } else {
      user = await this.loginWithApple();
    }

    return this.constructUserInfo(user, signInMethod);
  };

  async signup({ signInMethod, credentials }: SignupProps) {
    let user: User;
    if (signInMethod === "password") {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          credentials!.email,
          credentials!.password,
        )
        user = userCredential.user;
      } catch(error: any) {
        const errorCode = error.code;
        throw new Error(errorCode);
      }
    } else {
      if (signInMethod === "google.com") {
        user = await this.loginWithGoogle();
      } else {
        user = await this.loginWithApple();
      }
    }

    return this.constructUserInfo(user, signInMethod);
  };

  async resetPassword(email: string) {
    const resetLink = JSON.parse(
      localStorage.getItem("reset_password_data") as string,
    ) as { expiresIn: number };
    if (resetLink && resetLink.expiresIn >= new Date().getTime())
      return "duplicate";

    await sendPasswordResetEmail(auth, email);
    browserAPI.add(
      "reset_password_data",
      helper.stringifyData(
        {
          email,
          expiresin: new Date().getTime() + 24 * 60 * 60 * 1000,
        }
      )
    );
    return "sent";
  };

  async sendResetPasswordCode(_email: string, code: string) {
    // const tempResetPasswordData = { email, otp }

    //Save reset password email in local storage
    return verifyPasswordResetCode(auth, code);
    // localStorage.setItem('reset_password_data', JSON.stringify(tempResetPasswordData));
  };

  async changePassword(credential: { oobCode: string; newPassword: string; }): Promise<void> {
    await confirmPasswordReset(
      auth,
      credential.oobCode,
      credential.newPassword,
    );
    localStorage.removeItem("reset_password_data");
  };

  async logout() {
    await signOut(auth);
    browserAPI.clear();
  };
}
export const userAuthenticationAPI = new UserAuthenticationAPI();