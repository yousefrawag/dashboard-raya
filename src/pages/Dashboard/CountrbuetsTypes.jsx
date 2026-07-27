import React, { useState } from 'react'
import CustomeTabel from '../../components/common/CustomeTabel'
import useQuerygetiteams from '../../services/Querygetiteams'
import useGetUserAuthentications from '../../middleware/GetuserAuthencations'
import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb'
import MdouleAddCategoray from "../../components/common/popupmdules/MdouleAddCategoray"
import { useDashboardContext } from '../../context/DashboardProviedr'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdOutlineEditNote } from 'react-icons/md'
import { FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi'
import { format } from 'date-fns'
import useQueryDelete from '../../services/useQueryDelete'
import EditmainCategory from "../../components/common/popupmdules/EditmainCategory"
import Loader from '../../components/common/Loader'



const CountrbuetsTypes = () => {
  const { data, isLoading } = useQuerygetiteams("contrbuteTypes", "contrbuteTypes")
  const { deleteIteam } = useQueryDelete("contrbuteTypes", "contrbuteTypes")
  const { setmodule, setmainCategory, setEditmaincategory } = useDashboardContext()

  const { CanAdd, CanDelte, CanEdit, isAdmin } =
    useGetUserAuthentications("appCurency")

  const handelEdit = (item) => {
    setmainCategory(item)
    setEditmaincategory(true)
  }

  const columns = [
{
  name: "النوع",
  selector: (row) => row?.name,
  cell: (row) => (
    <span>
      {row.name}
    </span>
  )
}
,
 
  
 
   
    
 
   

   
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

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>

      <div className="w-full flex justify-between">

        <Breadcrumb pageName="المساهمات" />

        {(isAdmin || CanAdd) && (
          <button
            onClick={() => setmodule(true)}
            className="block text-white bg-main hover:bg-main2 rounded-lg text-sm px-5 py-2.5"
          >
            إضافة مساهمه جديد
          </button>
        )}

      </div>

      <div className="shadow-md p-3 mt-10">
        <CustomeTabel
          data={data?.data?.data}
          columns={columns}
        />
      </div>

      <MdouleAddCategoray
        fetshkey="contrbuteTypes"
        titale=" نوع المساهمه"
      />

      <EditmainCategory
        fetshkey="contrbuteTypes"
        titale="نوع المساهمه"
      />

    </div>
  )
}

export default CountrbuetsTypes