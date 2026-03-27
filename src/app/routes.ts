import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import About from "./pages/About";
import ProductsOverview from "./pages/ProductsOverview";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import BulkOrder from "./pages/BulkOrder";
import Blog from "./pages/Blog";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "products", Component: ProductsOverview },
      { path: "products/:category", Component: ProductCategory },
      { path: "product/:slug", Component: ProductDetail },
      { path: "bulk-order", Component: BulkOrder },
      { path: "blog", Component: Blog },
      { path: "career", Component: Career },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);
