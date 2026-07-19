import "./App.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import WelcomePage from "./WelcomePage/WelcomePage";
import Profile from "./Profile/Profile";
import Contact from "./Contact/Contact";
import Mentoring from "./Mentoring/Mentoring";
import MentoringSystems from "./Mentoring/MentoringSystems";
import Exchange from "./Exchange/Exchange";
import TradeCoin from "./Exchange/TradeCoin";
import ShowRoom from "./Exchange/ShowRoom";
import RouteLayout from "./UI/RouteLayout";
import Wallet from "./Wallet/Wallet";
import Error404 from "./UI/ErrorPage/Error404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <Error404 />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "profile", element: <Profile /> },
      { path: "contact", element: <Contact /> },
      { path: "contact/forms", element: <Navigate to="/contact" replace /> },
      { path: "mentoring", element: <Mentoring /> },
      { path: "mentoringsystems", element: <MentoringSystems /> },
      { path: "trade", element: <Navigate to="/exchange" replace /> },
      { path: "markets", element: <Navigate to="/exchange" replace /> },
      { path: "exchange", element: <Exchange /> },
      { path: "exchange/showroom", element: <ShowRoom /> },
      { path: "exchange/:coinID", element: <TradeCoin /> },
      { path: "wallet", element: <Wallet /> },
      { path: "*", element: <Error404 /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
