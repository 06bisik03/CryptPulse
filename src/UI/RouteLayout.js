import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const RouteLayout = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }, [location.pathname, location.search]);

  return <Outlet />;
};

export default RouteLayout;
