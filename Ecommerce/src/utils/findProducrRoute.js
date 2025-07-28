import { products } from "../data/MultiProductData";

export function findProductPath(productName) {
  const search = productName.trim().toLowerCase().replace(/\s|-/g, "");

  for (const category in products) {
    const found = products[category].find((p) => {
      const normalized = p.name.toLowerCase().replace(/\s|-/g, "");
      return normalized === search;
    });
    if (found) {
      return `/products/${category}/${found.name}`;
    }
  }

  return null;
}
