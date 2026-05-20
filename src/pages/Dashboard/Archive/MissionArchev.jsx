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
import { FiFilter, FiX } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';
const MissionArchev = () => {
  const {data , isLoading} = useQuerygetiteams("missions/archiev" , "missions-archev")
  const {deleteIteam} = useQueryDelete("missions" , "missions-archev")
    const {updateiteam} = useQueryupdate("missions/archevstauts" , "missions-archev")

  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Missions")
  const [isSectionOpen , setIssectionOpen] = useState(false)
  
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

 const SendeProjectToarchev = (id , status) => {
try {
  const data = {
   ArchievStatuts: status
  }
     updateiteam( { id , data }, {
        onSuccess: () => {
    
          toast.success("تم  إستعاده المهمة من الأرشيف بنجاح");
        },
      });
} catch (error) {
  
}
 } 
   

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
 if(isLoading){
  return <Loader />
 }    
  return (
    <div>
   
        <HeadPagestyle  isAdmin={isAdmin} CanAdd={CanAdd} pageName="توزيع المهام" to="/Add-Taskes" title="إضافة مهمة"/>
                  <button 
                         className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"

                 onClick={() => setIssectionOpen(!isSectionOpen)}>
                {open ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </button>
       {
        isSectionOpen &&         <FiltertionHook filteredData={filteredData} columns={columns}  filters={filters} params={params} setParams={setParams}/>

       }
        <CustomeTabel  data={filteredData} columns={columns}/>
    </div>
  )
}

export default MissionArchev