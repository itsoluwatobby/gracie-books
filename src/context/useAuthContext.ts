import { Context, useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function useAuthContext() {

  return useContext(AuthContext as Context<AuthContextType>)
}