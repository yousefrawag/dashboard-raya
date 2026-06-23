import { Getprojects  , AddProject , Updateproject,GetprojectSatuts , GetprojectTypes,GetProjectLocation ,SectionClients , ProjectByid , GetprivetProject ,
  UpdatePrivetproject,
  ProjectArchiev ,
  GetPrivetprojectByid,AddPrivetproject , AddDirectProperty, GetProperties ,
  GetPropertyInfo, PrievtProjectArchiev ,  DropProjects,ProjectArea , PropertyStauts ,EditProperty} from "../pages";
  import store from "../store/index"
  import Checkuserautherzationview from "../middleware/Checkuserautherzationview"; 
  export const ProjectsRoutes = [
      { path: "/projects-main", element: <Getprojects />  , loader:Checkuserautherzationview(store , "canViewProjects") },
      { path: "/Add-project", element: <AddProject /> , loader:Checkuserautherzationview(store , "canAddProjects")  },
      { path: "/edtit-project/:id", element: <Updateproject /> , loader:Checkuserautherzationview(store , "canEditProjects")  },
      { path: "/projects-main/:id", element: <ProjectByid />, loader:Checkuserautherzationview(store , "canViewProjects") },
      { path: "/privte-projects", element: <GetprivetProject /> , loader:Checkuserautherzationview(store , "canViewPrivetProjects")},
      { path: "/privte-projects/:id", element: <GetPrivetprojectByid /> , loader:Checkuserautherzationview(store , "canViewPrivetProjects")},
      { path: "/Add-privte-projects", element: <AddPrivetproject /> , loader:Checkuserautherzationview(store , "canAddPrivetProjects") },
      { path: "/edit-privte-projects/:id", element: <UpdatePrivetproject /> , loader:Checkuserautherzationview(store , "canEditPrivetProjects") },
      { path: "/Section-Client/:section", element: <SectionClients /> },
      { path: "/projects-Types", element: <GetprojectTypes /> },
      { path: "/projects-location", element: <GetProjectLocation /> },
      { path: "/projects-stauts", element: <GetprojectSatuts /> },
       { path: "/drop-projects", element: <DropProjects /> },
         { path: "/archive/projects", element: <ProjectArchiev /> },

        { path: "/archive/prievt-tasks", element: <PrievtProjectArchiev /> },
          { path: "/projects-area", element: <ProjectArea /> },
          { path: "/projects/properties", element: <GetProperties /> },
            { path: "/project/property/:id/:propertyId", element: <GetPropertyInfo /> },
             { path: "/Add-property", element: <AddDirectProperty /> },  
               { path: "/propertyStauts", element: <PropertyStauts /> },
                 { path: "/project/property/edit/:id/:propertyId", element: <EditProperty /> }

    ];