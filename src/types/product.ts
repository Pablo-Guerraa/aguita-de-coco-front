export interface ProductPresentation {
  /** Stable id, e.g. "240ml" | "1l" */
  id: string;
  /** Human readable label, e.g. "240 ml" */
  label: string;
  /** Temporary price in COP — trivial to replace once real pricing exists. */
  price: number;
  /** Purely visual scale hint applied to the (currently shared) product image. */
  sizeScale?: number;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  image: string;
  /** Hex color used to lightly tint accents while this flavor is selected. */
  accentColor: string;
  presentations: ProductPresentation[];
}

export interface ProductsResponse {
  products: Product[];
}
