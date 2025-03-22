import { BrowserRouter, Route, Routes } from "react-router-dom";
// import AuthRoute from "./auth.route";
import { authenticationRoutePaths } from "./common/routes";
import NotFound from "@/page/errors/NotFound";
import BaseLayout from "@/layout/base.layout";
import ProtectedRoute from "./protected.route";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<AuthRoute />}> */}
        <Route element={<BaseLayout />}>
          {authenticationRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        {/* </Route> */}
        <Route path="/" element={<ProtectedRoute />}>
          
        </Route>
        {/* Catch-all for undefined routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
