import { Context, useContext } from "react";
import { CartContext } from "./CartContext";

export default function useAuthContext() {

  return useContext(CartContext as Context<CartContextType>)
}