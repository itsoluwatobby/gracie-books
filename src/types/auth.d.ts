// <reference="auth.d.ts">

interface UserCredentials {
  email: string;
  password: string;
}

type SignInMethodTypes = 'google.com' | 'apple.com' | 'password';
type VerType = 'ACCOUNT_VERIFICATION' | 'PASSWORD_RESET';

type OTPRequestResponse ={
  success: string,
  error:string,
  show: boolean,
}

type CreateUser =  {
  email: string;
  fullName: string;
  // signInMethod: SignInMethodTypes;
  // password?: string;
  // referralCode?: string;
  // confirmPassword?: string;
}

type SignupProps = {
  signInMethod: SignInMethodTypes,
  credentials?: UserCredentials,
  // referralCode: string,
  // userDetails: CreateUser
}

type AppState = {
  isLoading: boolean,
  isError: boolean,
  errMsg: string
}