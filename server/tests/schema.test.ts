import { booksModelExists } from "../utils/verifySchema";
test("Books model exists", async () => {
  expect(await booksModelExists()).toBe(true);
});