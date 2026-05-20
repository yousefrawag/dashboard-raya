import {GetCustomers , AddCustomer ,  GetCustomerByid ,
  ClientCheckstauts
  ,ClientTypes ,
    UpdateCutomer ,
    Callcentercustomerstauts ,
    AddContact ,
    CustomersRecommendations ,
    ClientRequirments ,
    ClientWork ,
    LeadsBoard ,
    TodayReminders ,
    Customerdata ,
    BrokerReports ,
    DropCustomers
  
  } from "../pages";
    import store from "../store/index"
 import Checkuserautherzationview from "../middleware/Checkuserautherzationview";   
    export const CustomerRoutes = [
        { path: "/cutomers", element: <GetCustomers />  , loader:Checkuserautherzationview(store , "canViewClients")},
        { path: "/Add-Customer", element: <AddCustomer /> , loader:Checkuserautherzationview(store , "canAddClients") },
        { path: "/Edit-Customer/:id", element: <UpdateCutomer /> , loader:Checkuserautherzationview(store , "canEditClients") },
        { path: "/cutomers/:id", element: <GetCustomerByid /> , loader:Checkuserautherzationview(store , "canViewClients")},
        { path: "/cutomers-types", element: <ClientTypes /> , loader:Checkuserautherzationview(store , "canViewCustomerTypes")},
        { path: "/customer-checksatuts", element: <ClientCheckstauts /> , loader:Checkuserautherzationview(store , "canViewisvewied")} ,
         { path: "/customer-callcenter-stauts", element: <Callcentercustomerstauts /> , loader:Checkuserautherzationview(store , "canViewcallcentercustomer")} ,
         { path: "/customer-add-contact/:id", element: <AddContact /> , loader:Checkuserautherzationview(store , "canViewClients")} ,
         { path: "/Recommendations", element: <CustomersRecommendations /> } ,
         { path: "/Requiremnts", element: <ClientRequirments /> } ,
         { path: "/client-work", element: <ClientWork /> } ,
         { path: "/customers-leads", element: <LeadsBoard /> } ,
         { path: "/User-Reminder", element: <TodayReminders /> } ,
         { path: "/customers-search-results", element: <Customerdata /> } ,
             { path: "/brokers-deaily-reports", element: <BrokerReports /> } ,
              { path: "/drop-customers", element: <DropCustomers /> } ,

      ];