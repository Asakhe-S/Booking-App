import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./components/UserContext.jsx";
import BookingComponent from "./components/BookingComponent.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import AuthForm from "./components/AuthForm.jsx";
import AllRooms from "./components/AllRooms.jsx";
import OccupiedDatesDisplay from "./components/OccupiedDatesDisplay.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/", element: <BookingComponent></BookingComponent>},
      {
        path: "/auth",
        element:(
          <GuestRoute>
            <AuthForm></AuthForm>
          </GuestRoute>
        ),
      },
       {
        path: "/all-rooms",
        element:(
          <AllRooms></AllRooms>
        ),
      },
      {
        path: "/my-bookings",
        element: <OccupiedDatesDisplay></OccupiedDatesDisplay>,
      }
    ],
      
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>

  </StrictMode>
);
