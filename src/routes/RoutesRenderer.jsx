import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loader } from "@/components/ui";
import { routesConfig } from "./routesConfig";

const renderRoutes = (routes) =>
  routes.map(({ path, element, children, index }) => (
    <Route key={path || "index"} path={path} element={element} index={index}>
      {children && renderRoutes(children)}
    </Route>
  ));

const RoutesRenderer = () => (
  <Suspense fallback={<Loader />}>
    <Routes>{renderRoutes(routesConfig)}</Routes>
  </Suspense>
);

export default RoutesRenderer;
