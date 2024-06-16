import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "./WelcomePage/WelcomePage";
import Profile from "./Profile/Profile";
import Choice from "./Contact/Choice";
import Contact from "./Contact/Contact";
import Mentoring from "./Mentoring/Mentoring";
import MentoringSystems from "./Mentoring/MentoringSystems";
import Exchange from "./Exchange/Exchange";
import TradeCoin from "./Exchange/TradeCoin";
import ShowRoom from "./Exchange/ShowRoom";
import LoadingScreen from "./LoadingScreen";

import Wallet from "./Wallet/Wallet";
import Error404 from "./UI/ErrorPage/Error404";


function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: <WelcomePage />,
    },
    { path: "*", element: <Error404 /> },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/contact",
      element: <Contact />,
      children: [
        {
          path: "forms",
          element: <Choice />,
        },
      ],
    },
    {
      path: "/mentoring",
      element: <Mentoring />,
    },
    {
      path: "/mentoringsystems",
      element: <MentoringSystems />,
    },
    {
      path: "/trade",
      element: <TradeCoin />,
      loader: () => {
        return <LoadingScreen />;
      },
    },

    {
      path: "/exchange",
      id: "exchange-page",

      children: [
        {
          element: <Exchange />,
          index: true,
          loader: async () => {
            return <LoadingScreen />;
          },
        },

        {
          path: "showroom",
          element: <ShowRoom />,
          loader: () => {
            return <LoadingScreen />;
          },
        },
        { path: ":coinID", element: <TradeCoin /> },
      ],
    },
    { path: "/wallet", element: <Wallet /> },
  ]);

    return <RouterProvider router={routes} />;
 
}

export default App;
