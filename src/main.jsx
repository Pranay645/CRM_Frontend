import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Dashboard from "./page/dashboard/Dashboard";
import Customers from "./page/customer/ListCustomer";
import Questions from "./page/questions/questions";
import Form from "./page/form/Form";
import Calendar from "./page/calendar/Calendar";
import Stepper from "./page/StepWizard/Stepper";
import NotFound from "./page/notFound/NotFound";
import Login from "./page/login/login";
import AuthContextProvider from "./contexts/AuthContext";
import PrivateRoute from "./ProtectedRoutes/PrivateRoute";
import UsersList from "./page/UserManagement/UsersList";
import Kanban from "./components/Kanban";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<PrivateRoute/>} >  
      <Route path="/app" element={<App />}>
        <Route index element={<Dashboard />} />
        <Route path="salesman/StepWizard" element={<Stepper />} />
        <Route path="salesman/customer" element={<Customers />} />
        <Route path="salesman/questions" element={<Questions />} />
        <Route path="salesman/form" element={<Form />} />
        <Route path="salesman/calendar" element={<Calendar />} />
        <Route path="salesman/users" element={<UsersList />} />
        <Route path="salesman/kanban" element={<Kanban />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);
