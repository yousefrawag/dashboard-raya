import { UserTaskes  , GetTaskes , EmployeeRepoarts , TaskwithSatuts , CustomerReports , BoardingReports , AddTask , UpdateTaske , GetReports , TaskOverview , ReportChat} from "../pages";
import store from "../store/index"
import Checkuserautherzationview from "../middleware/Checkuserautherzationview";  
export const TaskesRoutes = [
      { path: "/", element: <UserTaskes />  },
      { path: "/Taskes", element: <GetTaskes /> ,  loader:Checkuserautherzationview(store , "canViewMissions") },
      { path: "/Add-Taskes", element: <AddTask />  ,  loader:Checkuserautherzationview(store , "canAddMissions")},
      { path: "/edit-Taskes/:id", element: <UpdateTaske /> ,  loader:Checkuserautherzationview(store , "canEditMissions") },
      { path: "/missions-repoart", element: <GetReports />  ,  loader:Checkuserautherzationview(store , "canViewReports")},
      { path: "/Taskes/:id", element: <TaskOverview /> ,  loader:Checkuserautherzationview(store , "canViewMissions")},
      { path: "/Boardin-Reports", element: <BoardingReports /> ,  loader:Checkuserautherzationview(store , "canViewReports")},
      { path: "/Taskes-status/:status", element: <TaskwithSatuts />  },
      { path: "cutomer-reports", element: <CustomerReports />  },
      { path: "employee-reports", element: <EmployeeRepoarts />  },

      { path: "/team-chat/:missionid/:chatid", element: <ReportChat /> },
  
    ];