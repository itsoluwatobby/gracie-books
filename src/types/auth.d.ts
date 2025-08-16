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
  email: string | null;
  signInMethod: SignInMethodTypes;
  address: string;
  referralCode: string;
  name: string | null;
  phone: string | null;
}

type SignupProps = {
  signInMethod: SignInMethodTypes,
  credentials?: UserCredentials,
  referralCode: string,
}

type AppState = {
  isLoading: boolean,
  isError: boolean,
  errMsg: string
}