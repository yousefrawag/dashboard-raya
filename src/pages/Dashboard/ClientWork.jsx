import React from 'react'
import CustomeTabel from '../../components/common/CustomeTabel'
import useQuerygetiteams from '../../services/Querygetiteams'
import HeadPagestyle from '../../components/common/HeadPagestyle'
import useGetUserAuthentications from '../../middleware/GetuserAuthencations'
import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb'
import MdouleAddCategoray from "../../components/common/popupmdules/MdouleAddCategoray"
import { useDashboardContext } from '../../context/DashboardProviedr'
import { GrFormView } from "react-icons/gr";
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from 'date-fns'
import useQueryDelete from '../../services/useQueryDelete'
import EditmainCategory from "../../components/common/popupmdules/EditmainCategory"
import Loader from '../../components/common/Loader'
import AddLocationRegions from '../../components/common/popupmdules/AddLocationRegions'
import EditLocationsRegion from '../../components/common/popupmdules/EditLocationsRegion'
const ClientWork = () => {
    const {data , isLoading , isError} = useQuerygetiteams("client-work", "client-work")
    const {deleteIteam} = useQueryDelete("client-work" , "client-work")
    const {module, setmodule , setmainCategory , setEditmaincategory} = useDashboardContext()
    console.log("regione" , data);
    
    const {CanAdd , CanDelte , CanEdit , CanView , isAdmin } = useGetUserAuthentications("work")

const handelEdit = (item) => {
    setmainCategory(item)
    setEditmaincategory(true)
}
  const columns = [
      {
        name: "الوظيفة",
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
              <div className="flex items-center justify-center gap-4 space-x-3.5">
            
                {
                  isAdmin || CanEdit ? <button onClick={() => handelEdit(row)} className="hover:text-primary">
                    <MdOutlineEditNote size={20} />
                  </button> : null
                }
                {
                  isAdmin || CanDelte ?
                    <button className="hover:text-red-500" onClick={() => deleteIteam(row._id)}>
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
        <div className=' w-full flex justify-between'>
        <Breadcrumb  pageName="وظائف العملاء"/>
        {
          isAdmin || CanAdd ? 
        <button onClick={( ) => setmodule(true)} className="block text-white bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800"> إضافة وظيفة جديد</button>
: null
        }
        </div>
<div className='shadow-md p-3 mt-10'>
<CustomeTabel  data={data?.data?.data} columns={columns}/>
</div>
 <AddLocationRegions  fetshkey="client-work" titale="وظيفة العميل "/>
 <EditLocationsRegion  fetshkey="client-work" titale="وظيفة العميل "/>
    </div>
  )
}

export default ClientWork