import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import SignIn from '../pages/Authentication/SignIn.jsx';
import SignUp from '../pages/Authentication/SignUp.jsx';
import Profile from '../pages/Profile.jsx';

import DefaultLayout from '../layout/DefaultLayout.jsx';
import DashboardProvider from '../context/DashboardProviedr.jsx';
import { AdminRoutes } from './AdminRoutes.jsx';
import { TaskesRoutes } from './TaskesRoutes.jsx';
import { ProjectsRoutes } from './ProjectsRoutes.jsx';
import { CustomerRoutes } from './CustomerRoutes.jsx';
import { PermissionsRoutes } from './PermissionsRoutes.jsx';
import { UserRoutes } from './UserRoutes.jsx';

import Calnder from '../pages/Dashboard/Calnder.jsx';
import ForgetPaassword from '../pages/Authentication/ForgetPaassword.jsx';
import SetNewPassword from '../pages/Authentication/SetNewPassword.jsx';
import UserChangePassword from '../pages/Authentication/UserChangePassword.jsx';
import Checkuserautherzationview from "../middleware/Checkuserautherzationview.jsx"
import store from "../store/index.js"
const AppRoutes = () => {



  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardProvider><DefaultLayout /></DashboardProvider>,
      loader:Checkuserautherzationview(store , "canViewProjects") ,
      children:  [
       ...AdminRoutes,
       ...TaskesRoutes,
       ...ProjectsRoutes,
       ...CustomerRoutes,
   
       ...PermissionsRoutes,
       ...UserRoutes,

       {
        path: "/calendar",
        element: <Calnder />,
      },
      {
        path: "/user-changepassword",
        element: <UserChangePassword />,
      },
        {
          path: "/profile",
          element: <Profile />,
        },
    
      
       
   
      
      
      ],
    },
    {
      path: "/auth/signin",
      element: <SignIn />,
    },
    {
      path: "/auth/ForgetPassword",
      element: <ForgetPaassword />,
    },
    {
      path: "/auth/Reset-Password",
      element: <SetNewPassword />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;
