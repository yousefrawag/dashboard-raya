import React from 'react'
import CustomeTabel from '../../../components/common/CustomeTabel';
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom'
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import useQueryDelete from '../../../services/useQueryDelete';
import { format } from 'date-fns';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import employeesImage from  "../../../images/user/user-01.png"
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';

const Getpermissions = () => {
  
  const {data , isLoading} = useQuerygetiteams("roles/getRolesWithUserCounts" , "roles/getRolesWithUserCounts")
  const {deleteIteam , isLoading:loaddingDelete} = useQueryDelete("roles" , "roles")
  const {CanAdd , CanDelte , CanEdit , CanView , isAdmin} = useGetUserAuthentications("Administration")

 
  
     const columns = [
      {
          name:"إسم الصلاحية",
          selector: (row) =><Link to={`/Edit-permission/${row._id}`}   className='text-wrap'>{row.name}</Link> ,

      },
      {
        name: "عدد المستخدمين",
        selector: (row) => row.name,
              cell: (row) => (
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
           <img
              src={employeesImage}
              alt={row.name}
              className='rounded-full'
              style={{ width: "30px", height: "30px", marginRight: "0", transform: "translateX(-1px)" }}
            />
          
            <span style={{backgroundColor: "#181C32", color: "white", width: "25px", height: "25px", display:"flex", fontSize: "10px", alignItems: "center", justifyContent: "center", borderRadius: "50%"}}>{row.userCount}</span>
          </div>
        ),
      },
     

     
      
    
     
     
       
   
      ]
if(isLoading){
  return <Loader />
}

return (
  <div>
      <HeadPagestyle  pageName="الصلاحيات" isAdmin={isAdmin} CanAdd={CanAdd} to="/Add-permission" title="إضافة صلاحية"/>
      <CustomeTabel columns={columns} data={data?.data?.roles || []} />
  </div>
)
}

export default Getpermissions