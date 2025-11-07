import { Context, useContext } from "react";
import { BooksContext } from "./BooksContext";

export default function useBooksContext() {

  return useContext(BooksContext as Context<BookContextType>);
}