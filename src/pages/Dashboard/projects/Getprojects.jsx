import React, { useState, useMemo } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../hooks/FiltertionHook";
import CardDataStats from '../../../components/common/CardDataStats';
import GetProjectStatusChart from '../../../components/common/GetProjectStatusChart';
import GetprojectTypesChart from '../../../components/common/GetprojectTypesChart';
import GetprojectsOpeartionType from '../../../components/common/GetprojectsOpeartionType';
import useQueryupdate from '../../../services/useQueryupdate';
import { FiFilter, FiX } from "react-icons/fi";

const Getprojects = () => {
  const { data, isLoading } = useQuerygetiteams("projects", "projects");
  const { deleteIteam } = useQueryDelete("projects", "projects");
  const {updateiteam} = useQueryupdate("projects" , "projects")
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const [isSectionOpen , setIssectionOpen] = useState(false)
  
  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  const fillters = [
    {value:"projectOwner", name:"مالك المشروع"},
    {value:"projectOwnerPhone", name:"جوال مالك المشروع"},
   
     {value:"governoate", name:"المنطقة"}  ,
     {value:"projectName", name:"إسم المشروع"} , 
     {value:"addedBy.fullName", name:"الموظف"} ,
     {value:"estateType", name:"نوع العقار"} ,
     {value:"detailedAddress", name:"العنوان بالتفصيل"} ,
     {value:"operationType", name:"نوع العملية"} ,
     {value:"clientType", name:"الطوابق المتوفرة"} ,
     {value:"areaMatter", name:"المساحة بالمتر"} ,
     {value:"spaceOuteside", name:"المساحة الخارجية للعقار"} ,
     {value:"typeOfSpaceoutside", name:"نوع المساحة الخارجية للعقار"} ,
     {value:"pymentType", name:"العملة"} ,
     {value:"estatePrice", name:"سعر العقار الإجمالى"} ,
     {value:"materPriec", name:" سعر المتر"} ,
     {value:"projectSatatus", name:"حالة المشروع"} ,
     {value:"installments", name:"إمكانية التقسيط"} ,
     {value:"installmentsFirstPyment", name:"الدفعة الإولى"} ,
     {value:"InstallmentPeriod", name:"مده التقسيط"} ,
     {value:"projectDetails", name:" تفاصيل المشروع"} ,
     {value:"projectads", name:"نص الإعلان"} ,
     {value:"projectNotes", name:"ملاحظات المشروع"} ,

     ]
  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.filter(item => {
      if (params.searchTerm && params.field) {
        const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);
        return fieldValue?.toLowerCase().includes(params.searchTerm.toLowerCase());
      }
      return true;
    });
  }, [data, params]);

 const SendeProjectToarchev = (id , status) => {
try {
  const data = {
    status
  }
     updateiteam( { id , data }, {
        onSuccess: () => {
    
          toast.success("تم  إرسال مشروع الى الأرشيف بنجاح");
        },
      });
} catch (error) {
  
}
 } 
  const columns = [

    {
      name: "الموظف",
      selector: (row) => row?.addedBy?.fullName,
    },

 
    {
      name: "اسم المشروع",
      selector: (row) => row?.projectName ,
       width:"170px" ,
      cell: (row) => <Link to={`/projects-main/${row._id}`}>{row?.projectName  || row?._id} </Link>,
    },
    {
      name: "نوع العقار",
       width:"170px" ,
      selector: (row) => row?.estateType,
    },
           {
      name: " حاله المشروع",
        
       width:"170px" ,
      selector: (row) => row?.projectSatatus,
      cell: (row) => <div   
      style={{
       
       whiteSpace: "wrap",
    

     }}
     title={row?.projectSatatus}>{row?.projectSatatus}</div>,
    },
        {
      name: "سعر العقار الإجمالى",
      selector: (row) => row?.estatePrice,
      width:"180px" ,
        sortFunction: (rowA, rowB) => {
    return Number(rowA.estatePrice) - Number(rowB.estatePrice);
  },
      cell: (row) => <div   
      style={{
       
       whiteSpace: "wrap",
    

     }}
     title={row?.estatePrice}>{ Number(row?.estatePrice).toLocaleString("en-US")}</div>,
      
    },
   {
      name: "العملة",
      selector: (row) => row?.estatePrice,
     
      cell: (row) => <div   
      style={{
       
       whiteSpace: "wrap",
    

     }}
     title={row?.pymentType}>{row?.pymentType}</div>,
      
    },
  
 

    {
      name: "  نوع العمليه",
      selector: (row) => row?.operationType,
    },

    {
      name: "تاريخ الإنشاء",
      selector: (row) => row.createdAt,
      cell: (row) => <div   
       style={{
        
        whiteSpace: "wrap",
       
     

      }}
      title={format(new Date(row.createdAt), "dd MMMM, yyyy")}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</div>,
    },
  

   {
      name: "اجراء",
      width:"170px",
      selector: (row) => row.procedure,
      cell: (row) => (
        <div className="flex items-center justify-center space-x-3.5">
 
          {
            isAdmin || CanDelte ?
             <button
  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-lg transition-all duration-200"
  onClick={() => SendeProjectToarchev(row._id, "archiev")}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
  أرشيف
</button> : null
          }
        </div>
      ),
    },
  ];
  const columnsfile = [
    {
      name: "مالك المشروع",
      selector: (row) => row?.projectOwner,
    },
    {
      name: "جوال مالك المشروع",
      selector: (row) => row?.projectOwnerPhone,
    },
   {
      name: "الموظف",
      selector: (row) => row?.addedBy?.fullName,
    },
       {
      name: "الدوله",
      selector: (row) => row?.locations?.countryName,
    },
      {
      name: "المنطقة",
      selector: (row) => row?.governoate,
    },
    {
      name: "اسم المشروع",
      selector: (row) => row?.projectName,
    },
    {
      name: "نوع العقار",
      selector: (row) => row?.estateType,
    },
        {
      name: "العنوان بالتفصيل",
      selector: (row) => row?.detailedAddress,
    },
        {
      name: " تفاصيل العقار",
      selector: (row) => row?.projectDetails,
    },
       {
      name: " نص الاعلان",
      selector: (row) => row?.projectads,
    },
       {
      name: "  نوع العمليه",
      selector: (row) => row?.operationType,
    },
       {
      name: " حاله المشروع",
      selector: (row) => row?.projectSatatus,
    },

       {
      name: "العملة",
      selector: (row) => row?.pymentType,
    },
    {
      name: " سعر العقار الإجمالى",
      selector: (row) => row?.estatePrice,
    },
   
      {
      name: "سعر المتر",
      selector: (row) => row?.materPriec,
    },

   
    {
      name: " امكانيه التقسيط",
      selector: (row) => row?.installments,
    },
    {
      name: "الدفعة الاولى",
      selector: (row) => row?.installmentsFirstPyment,
    },
        {
      name: " مده التقسيط",
      selector: (row) => row?.InstallmentPeriod,
    },
    {
      name: "الدفعة الشهريه",
      selector: (row) => row?.installmentsFirstPermonth,
    },
        {
      name: "الطوابق المتوفره",
      selector: (row) => row?.availableFloors,
      cell :() => {
        <div>
          {
            row?.availableFloors?.map((floor) => {
              return <span>{floor}</span>
            })
          }
        </div>
      }
    },
   {
      name: " المساحه / متر",
      selector: (row) => row?.areaMatter,
    },
    {
      name: " المساحه / الخارجيه للعقار",
      selector: (row) => row?.spaceOuteside,
    },
    {
      name: " نوع المساحه / الخارجيه للعقار",
      selector: (row) => row?.typeOfSpaceoutside,
    },

    {
      name: " ملاحظات المشروع",
      selector: (row) => row?.projectNotes,
    },
 
    {
      name: " حاله الترخيص",
      selector: (row) => row?.RefereeStatus,
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) => format(new Date(row.createdAt ), "dd MMMM, yyyy"),
   
    },

  
  ];
 

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <HeadPagestyle pageName="مشاريع عامة" isAdmin={isAdmin} CanAdd={CanAdd} to="/Add-project" title="إضافة مشروع" />
        
                 <Link 
                       className="w-[180px] block flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                        to="/drop-projects">
                        إضافة مشاريع بالاكسيل
                        </Link>
          <button 
                         className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"

                 onClick={() => setIssectionOpen(!isSectionOpen)}>
                {open ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
    
   {
    isSectionOpen && <FiltertionHook filteredData={filteredData} columns={columnsfile} filters={fillters} params={params} setParams={setParams} />
   }   
      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default Getprojects;