import React from 'react'
import HeadPagestyle from '../../../../components/common/HeadPagestyle'
import CustomeTabel from '../../../../components/common/CustomeTabel'
import DropdownDefault from '../../../../components/common/Dropdowns/DropdownDefault'
import { Link } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from "date-fns";
import useQuerygetiteams from '../../../../services/Querygetiteams';
import Loader from '../../../../components/common/Loader';
import useQueryDelete from '../../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../../middleware/GetuserAuthencations';
import FiltertionHook from '../../../../hooks/FiltertionHook';
import { useState } from 'react';
import { useMemo } from 'react';
const GetprivetProject = () => {
  const {data , isLoading} = useQuerygetiteams("Privetprojects" , "Privetprojects")
  const {deleteIteam} = useQueryDelete("Privetprojects" , "Privetprojects")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("PrivetProjects")
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
   
     
      ];


   

        const filteredData = useMemo(() => {
          if (!data?.data?.data) return [];
      
          return data.data?.data.filter(item => {
            if (params.searchTerm && params.field) {
              const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);
              return fieldValue?.toLowerCase().includes(params.searchTerm.toLowerCase());
            }
            return true;
          });
        }, [data, params]);

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
    name: "متطلبات المهمة",
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


];       
        
 if(isLoading){
  return <Loader />
 }    
  return (
    <div>
        <HeadPagestyle isAdmin={isAdmin} CanAdd={CanAdd}  pageName="مهام مخصصة" to="/Add-privte-projects" title="إضافة مهمة خاصة"/>
       <FiltertionHook filteredData={filteredData} columns={columns} filters={filters} params={params} setParams={setParams}/>
        <CustomeTabel  data={filteredData} columns={columns}/>
    </div>
  )
}

export default GetprivetProject