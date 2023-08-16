import "./App.css";
import {
  Router,
  Route,
  Routes,
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import WelcomePage from "./WelcomePage/WelcomePage";
import Profile, { action } from "./Profile/Profile";
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <WelcomePage />,
    },
    {
      path: "/profile",
      element: <Profile />,
      action: action,
    },
  ]);
  return <RouterProvider router={routes} />;
}

export default App;
