import App from "@/App";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <p>about us </p>,
      },
    ],
  },
]);

export default router;
