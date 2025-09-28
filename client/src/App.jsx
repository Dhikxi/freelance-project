// App.jsx
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import {
  Home,
  Footer,
  Gig,
  Gigs,
  MyGigs,
  Add,
  Orders,
  Message,
  Messages,
  Login,
  Register,
  Success,
  NotFound,
  Pay,
  BuyerDashboard
} from "./pages";
import { Navbar, PrivateRoute } from "./components";
import FreelancerProfile from "./pages/FreelancerProfile";

import "./App.scss";

const Layout = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/gig/:_id", element: <Gig /> },
      { path: "/gigs", element: <Gigs /> },
      { path: "/buyer-dashboard", element: <BuyerDashboard /> },
      { path: "/freelancer/:freelancerId", element: <FreelancerProfile /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        ),
      },
      {
        path: "/organize",
        element: (
          <PrivateRoute>
            <Add />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-gigs",
        element: (
          <PrivateRoute>
            <MyGigs />
          </PrivateRoute>
        ),
      },
      {
        path: "/message/:conversationID",
        element: (
          <PrivateRoute>
            <Message />
          </PrivateRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        ),
      },
      {
        path: "/pay/:_id",
        element: (
          <PrivateRoute>
            <Pay />
          </PrivateRoute>
        ),
      },
      {
        path: "/success",
        element: (
          <PrivateRoute>
            <Success />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <RouterProvider router={router} />
        <Toaster />
      </RecoilRoot>
    </div>
  );
}

export default App;
