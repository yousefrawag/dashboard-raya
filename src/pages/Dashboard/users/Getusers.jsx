import React from 'react'
import HeadPagestyle from '../../../components/common/HeadPagestyle'
import CustomeTabel from '../../../components/common/CustomeTabel'
import { FaWhatsapp } from "react-icons/fa";
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
const Getusers = () => {
  const {data , isLoading} = useQuerygetiteams("users" , "users")
  const {deleteIteam} = useQueryDelete("users" , "users")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Employees")

// handel filter 
    const [params, setParams] = useState({
        field: "",
        searchTerm: "",
        startDate: "",
        endDate: "",
      });
    
      const filters = [{value:"fullName", name:"الإسم"} ,{value:"email", name:"الإيميل"}  ,{value:"job", name:"الوظيفة"} ]


   

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
          name: "الإسم",
          selector: (row) =>  row.fullName,
          cell: (row) => <Link   
          to={`/edtit-user/${row._id}`}
          style={{
           
           whiteSpace: "wrap",
        
    
         }}
         className='flex gap-4'

      > 
      <img className='w-[30px] h-[30px] rounded-full' src={row?.imageURL} alt='user-image' />
      <span>{ row.fullName}</span>
      </Link>,
    
        },
        {
          name: "الإيميل",
          selector: (row) => <span className='text-wrap'>
            {
                 row?.email
            }
          </span> ,
        },
     {
             name: "الجوال",
             selector: (row) => row.phoneNumber ,
             cell:(row) =>  <span
             style={{
               textOverflow: "ellipsis",
               whiteSpace: "nowrap",
               display:"flex",
               flexDirection:"column",
               gap:"10px"
             }}
           >
             {" "}
            { row.phoneNumber}
       
             <a style={{fontSize:"20px" , color:"#075E54"}}  href={`whatsapp://send?phone=${row.phoneNumber}`} target="_blank" rel="noopener noreferrer">
             <FaWhatsapp />
             </a>
          
           </span>
           },,
           {
            name: "نوع المستخدم",
            selector: (row) => row?.type === "admin" ? "أدمن" : "موظف" || "غير متوفر",
          },
        {
          name: "الصلاحية",
          selector: (row) => row?.role?.name || "غير متوفر",
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
        <HeadPagestyle isAdmin={isAdmin} CanAdd={CanAdd}  pageName="مستخدمين" to="/Add-user" title="إضافة مستخدم"/>
             <FiltertionHook filteredData={filteredData} columns={columns} key="المشاريع العامه.xlsx" filters={filters} params={params} setParams={setParams}/>
     
        <CustomeTabel  data={filteredData} columns={columns}/>
    </div>
  )
}

export default Getusers