import {

  ECommerce ,

  
  } from "../pages/Dashboard/admin"
  import Calnder from "../pages/Dashboard/Calnder";
  import { GoogaleCalnder  ,CompaiginPage , GetcompainByid , CurrencyAPP , WhatsAppExcelCampaign, WhatsAppFilterCampaign ,  Expensess , ArchiveBoarding , CustomersArchiev , WhatsappBoarding} from "../pages";
export const AdminRoutes = [
    { path: "/dashboard", element: <ECommerce /> },
    { path: "/Googale-calnder", element: <GoogaleCalnder /> },
    { path: "/calnder-customer", element: <Calnder /> },
    { path: "/Currency", element: <CurrencyAPP /> },
        { path: "/expenss", element: <Expensess /> },
        { path: "/archive-boarding", element: <ArchiveBoarding /> },
        { path: "/archive/customers", element: <CustomersArchiev /> },
        { path: "/whatsap-boarding", element: <WhatsappBoarding /> },
             { path: "/whatsap-FilterCampaign", element: <WhatsAppFilterCampaign /> },
              { path: "/whatsap-ExcelCampaign", element: <WhatsAppExcelCampaign /> },
              { path: "/whatsap-allcompaigins", element: <CompaiginPage /> },
               { path: "/whatsap-allcompaigins/:id", element: <GetcompainByid /> },




  ];