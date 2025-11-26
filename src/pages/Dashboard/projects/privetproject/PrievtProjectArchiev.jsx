import React, { useState, useMemo } from 'react';
import CustomeTabel from '../../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from "date-fns";
import { FaUsers } from "react-icons/fa";
import { RxReload } from "react-icons/rx";

import useQueryDelete from '../../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../../services/Querygetiteams';
import Loader from '../../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../../hooks/FiltertionHook";
import CardDataStats from '../../../../components/common/CardDataStats';
import GetProjectStatusChart from '../../../../components/common/GetProjectStatusChart';
import GetprojectTypesChart from '../../../../components/common/GetprojectTypesChart';
import GetprojectsOpeartionType from '../../../../components/common/GetprojectsOpeartionType';
import useQueryupdate from '../../../../services/useQueryupdate';
const PrievtProjectArchiev = () => {
  const { data, isLoading } = useQuerygetiteams("Privetprojects/archived", "Privetprojects");
  const { deleteIteam } = useQueryDelete("Privetprojects", "Privetprojects");
  const {updateiteam} = useQueryupdate("Privetprojects" , "Privetprojects")
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

      const filters = [
        {value:"projectName", name:"إسم المهمة"}
        ,{value:"projectNotes", name:"ملاحظات"}  ,
        {value:"projectDetails", name:"تفاصيل المهمة"} , 
        {value:"addedBy.fullName", name:"مضاف من قبل"} ,
   
     
      ]; const fillters = [
    {value:"projectOwner", name:"مالك المشروع"},
    {value:"projectOwnerPhone", name:"جوال مالك المشروع"},
   
     {value:"governoate", name:"المنطقة"}  ,
     {value:"projectName", name:"إسم المشروع"} , 
     {value:"addedBy", name:"المسوق"} ,
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
    
          toast.success("تم  إستعاده مشروع من الأرشيف بنجاح");
        },
      });
} catch (error) {
  
}
 } 
const columns = [
  {
    name: "اسم المهمة",
    selector: (row) => row?.projectName,
    cell: (row) => <Link
    to={`/privte-projects/${row?._id}`}  
    style={{
      
      whiteSpace: "wrap",
  

    }}
    >{ row?.projectName}</Link>,

  },

  {
    name: "متطلبات الخدمة",
    selector: (row) =>  row.projectDetails,
    cell: (row) => <div   
    style={{
      
      whiteSpace: "wrap",
  

    }}
  >{row?.projectDetails?.slice(0 ,50) + "..." }</div>,
  },

  {
    name: "مضافه من قبل",
    selector: (row) => row?.addedBy?.fullName,
  },
  {
    name:"تاريخ الإنشاء",
    selector: (row) => row.createdAt,
    cell: (row) => <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"wrap"}}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</span>
  },
   {
      name: "اجراء",
      selector: (row) => row.procedure,
      cell: (row) => (
        <div className="flex items-center justify-center space-x-3.5 gap-5">
 
          {
            isAdmin || CanDelte ?
              <button className="hover:text-red-500" onClick={() => SendeProjectToarchev(row._id  , false)}>
                <RxReload size={20} />
              </button> : null
          }
                 {
            isAdmin || CanDelte ?
              <button className="hover:text-red-500" onClick={() => deleteIteam(row._id )}>
                <AiTwotoneDelete size={20} />
              </button> : null
          }
        </div>
      ),
    },

];

 console.log("prievt-project" , data);
 

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>



      <FiltertionHook filteredData={filteredData}  filters={filters} params={params} setParams={setParams} />
      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default PrievtProjectArchiev;