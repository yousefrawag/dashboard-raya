import {

  ECommerce ,

  
  } from "../pages/Dashboard/admin"
  import Calnder from "../pages/Dashboard/Calnder";
  import { GoogaleCalnder  , JopAplication ,
  GetFullAplication , PreFormance, CustomerBorker ,   GetImproveFullData ,
  GetAllimprovmentAplications , GetSurveyAplicationId, GetFullServyAplications,ReportType, ProjectTypesArchiev, RegionArchiev ,MissionArchev, FloorNumber,FirstPayments ,UsersArchiev  , PaymentMonthly, CompaiginPage , GetcompainByid , CurrencyAPP , WhatsAppExcelCampaign, WhatsAppFilterCampaign ,  Expensess , ArchiveBoarding , CustomersArchiev , WhatsappBoarding} from "../pages";
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
    { path: "/FistPayment", element: <FirstPayments /> },
     { path: "/ReportType", element: <ReportType /> },
    { path: "/PaymentMonthly", element: <PaymentMonthly /> },
     { path: "/FloorNumbers", element: <FloorNumber /> },
      { path: "/archive/missions", element: <MissionArchev /> },
      { path: "/archive/users", element: <UsersArchiev /> },
      { path: "/archive/projectType", element: <ProjectTypesArchiev /> },
      { path: "/archive/locations", element: <RegionArchiev /> },
      { path: "/compare-prevormance", element: <PreFormance /> },
      { path: "/borkers-customers", element: <CustomerBorker /> },
      { path: "/raya-jops", element: <JopAplication /> },
      { path: "/raya-jops/:id", element: <GetFullAplication /> },
      { path: "/raya-Survey", element: <GetFullServyAplications /> },
      { path: "/raya-Survey/:id", element: <GetSurveyAplicationId /> },
      { path: "/raya-improve", element: <GetAllimprovmentAplications /> },
      { path: "/raya-improve/:id", element: <GetImproveFullData /> },




  ];