import { canonicalBooks } from "../schema/models/canonicalBooks";

export function booksModelExists() {
  return !!canonicalBooks;
}