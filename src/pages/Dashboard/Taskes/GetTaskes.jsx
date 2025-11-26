import React from 'react'
import HeadPagestyle from '../../../components/common/HeadPagestyle'
import CustomeTabel from '../../../components/common/CustomeTabel'

import { Link } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from "date-fns";

import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import { useState , useMemo } from 'react';
import FiltertionHook from '../../../hooks/FiltertionHook';
const GetTaskes = () => {
  const {data , isLoading} = useQuerygetiteams("missions" , "missions")
  const {deleteIteam} = useQueryDelete("missions" , "missions")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Missions")
// handel filter 
    const [params, setParams] = useState({
        field: "",
        searchTerm: "",
        startDate: "",
        endDate: "",
      });
    
      const filters = [
     
        {
          value: "missionType",
          name: " نوع المهمة"
        },
        {
          value: "assignedBy.fullName",
          name: " مضاف من قبل"
        },
        {
          value: "status",
          name: " حالة المهمة "
        },
        {
          value: "project.projectName",
          name: "مشروع عام"
        },
        
        {
          value: "Privetproject.projectName",
          name: "مشروع خاص"
        },
      
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
        name: "نوع المهمة",
        selector: (row) => <Link to={`/Taskes/${row?._id}`}>
        {
           row?.missionType 
        }
        </Link>,
      },
      {
        name: "المشروع",
        selector: (row) =>  row?.project?.projectName ? row?.project?.projectName : row?.Privetproject?.projectName || "غير متعارف عليه",
        cell: (row) => <div   
        style={{
         
         whiteSpace: "wrap",
      
  
       }}
       >{ row?.project?.projectName ? row?.project?.projectName : row?.Privetproject?.projectName || "غير معروف"}</div>,
      },

   
    
   
        {
          name: "مضافه من قبل",
          selector: (row) => row?.assignedBy?.fullName,
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
   
        <HeadPagestyle  isAdmin={isAdmin} CanAdd={CanAdd} pageName="توزيع المهام" to="/Add-Taskes" title="إضافة مهمة"/>
        <FiltertionHook filteredData={filteredData} columns={columns}  filters={filters} params={params} setParams={setParams}/>
        <CustomeTabel  data={filteredData} columns={columns}/>
    </div>
  )
}

export default GetTaskes