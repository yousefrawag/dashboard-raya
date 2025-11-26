import { Getusers , Adduser , Updateuser , UpdateDealyReport , UserExpenses, UsersStatus , GetallDealyReport, UserDealyReport , AddDealyReport} from "../pages";
import store from "../store/index"
import Checkuserautherzationview from "../middleware/Checkuserautherzationview";  
  export const UserRoutes = [
      { path: "/All-users", element: <Getusers /> ,  loader:Checkuserautherzationview(store , "canViewEmployees")},
      { path: "/Add-user", element: <Adduser /> ,  loader:Checkuserautherzationview(store , "canAddEmployees") },
      { path: "/edtit-user/:id", element: <Updateuser /> , loader:Checkuserautherzationview(store , "canEditEmployees")  },
      { path: "/All-users/:type", element: <UsersStatus /> , loader:Checkuserautherzationview(store , "canViewEmployees")  },
      { path: "/User-Reports", element: <UserDealyReport />  },
       { path: "/Add-dealyReport", element: <AddDealyReport />  },
        { path: "/edtit-dealy/:id", element: <UpdateDealyReport />  },
       { path: "/all-dealyReport", element: <GetallDealyReport />  },
          { path: "/expenss/:id", element: <UserExpenses />  },
   
  
    ];