import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile.tsx";
import Create from "./pages/project/Create.tsx";
import ProjectUuid from "./pages/project/ProjectUuid.tsx";
import About from "./pages/static pages/About";
import Contact from "./pages/static pages/Contact";
import Privacy from "./pages/static pages/Privacy";
import Terms from "./pages/static pages/Terms";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects",
        children: [
          {
            path: "create",
            element: <Create />,
          },
          {
            path: ":uuid",
            element: <ProjectUuid />,
          },
        ],
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
