import React from 'react'
import CustomeTabel from '../../../components/common/CustomeTabel'
import useQuerygetiteams from '../../../services/Querygetiteams'
import HeadPagestyle from '../../../components/common/HeadPagestyle'
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations'
import Breadcrumb from '../../../components/common/Breadcrumbs/Breadcrumb'
import MdouleAddCategoray from "../../../components/common/popupmdules/MdouleAddCategoray"
import { useDashboardContext } from '../../../context/DashboardProviedr'
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from 'date-fns'
import { RxReload } from "react-icons/rx";
import useQueryDelete from '../../../services/useQueryDelete'
import EditmainCategory from "../../../components/common/popupmdules/EditmainCategory"
import Loader from '../../../components/common/Loader'
import AddLocationRegions from '../../../components/common/popupmdules/AddLocationRegions'
import EditLocationsRegion from '../../../components/common/popupmdules/EditLocationsRegion'
import useQueryupdate from '../../../services/useQueryupdate'
const ProjectTypesArchiev = () => {
    const {data , isLoading , isError} = useQuerygetiteams("region/archiev", "region")
    const {deleteIteam} = useQueryDelete("region" , "region")
  
  const {updateiteam} = useQueryupdate("region" ,"region")
    const {module, setmodule , setmainCategory , setEditmaincategory} = useDashboardContext()
    console.log("regione" , data);
    
    const {CanAdd , CanDelte , CanEdit , CanView , isAdmin } = useGetUserAuthentications("projectstypes")

const handelEdit = (item) => {
    setmainCategory(item)
    setEditmaincategory(true)
}
 const SendeProjectToarchev = (id , status) => {
try {
  const data = {
   ArchievStatuts: status
  }
     updateiteam( { id , data }, {
        onSuccess: () => {
    
          toast.success("تم  إستعاده نوع العقار من الأرشيف بنجاح");
        },
      });
} catch (error) {
  
}
 } 
  const columns = [
      {
        name: "النوع",
        selector: (row) => row?.name,
        cell: (row) => (
                  <span  >{row.name}</span>
        )
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

<div className='shadow-md p-3 mt-10'>
<CustomeTabel  data={data?.data?.data} columns={columns}/>
</div>

    </div>
  )
}

export default ProjectTypesArchiev