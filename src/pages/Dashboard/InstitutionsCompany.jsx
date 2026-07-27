import React, { useState } from 'react'
import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb'
import MdouleAddCategoray from "../../components/common/popupmdules/MdouleAddCategoray"
import { useDashboardContext } from '../../context/DashboardProviedr'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdOutlineEditNote } from 'react-icons/md'
import { FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import useQueryDelete from '../../services/useQueryDelete'
import EditmainCategory from "../../components/common/popupmdules/EditmainCategory"
import Loader from '../../components/common/Loader'
import useQuerygetiteams from '../../services/Querygetiteams'
import useGetUserAuthentications from '../../middleware/GetuserAuthencations'

const InstitutionsCompany = () => {
  const { data, isLoading } = useQuerygetiteams("InstitutionsCompany", "InstitutionsCompany")
  const { deleteIteam } = useQueryDelete("InstitutionsCompany", "InstitutionsCompany")
  const { setmodule, setmainCategory, setEditmaincategory } = useDashboardContext()

  const { CanAdd, CanDelte, CanEdit, isAdmin } =
    useGetUserAuthentications("appCurency")

  const handelEdit = (item) => {
    setmainCategory(item)
    setEditmaincategory(true)
  }

  // دالة للحذف
  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه المؤسسة؟")) {
      deleteIteam(id)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  const institutions = data?.data?.data || []

  return (
    <div>
      {/* رأس الصفحة */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
        <Breadcrumb pageName="المؤسسات والشركات" />

        {(isAdmin || CanAdd) && (
          <button
            onClick={() => setmodule(true)}
            className="block text-white bg-main hover:bg-main2 rounded-lg text-sm px-5 py-2.5 transition-colors"
          >
            إضافة مؤسسة جديدة
          </button>
        )}
      </div>

      {/* شبكة البطاقات */}
      {institutions.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          لا توجد مؤسسات لعرضها
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {institutions.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 flex flex-col"
            >
              {/* اسم المؤسسة */}
              <Link
                to={`/InstitutionsCompany/${item._id}`}
                className="text-lg font-semibold text-main hover:underline truncate"
              >
                {item.name}
              </Link>

              {/* الحالة */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-500">الحالة:</span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  item.status === 'نشط' ? 'bg-green-100 text-green-700' :
                  item.status === 'غير نشط' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {item.status || 'غير محدد'}
                </span>
              </div>

              {/* تاريخ الإنشاء */}
              <div className="mt-2 text-sm text-gray-500">
                <span>تاريخ الإنشاء: </span>
                <span>{format(new Date(item.createdAt), "dd MMMM, yyyy")}</span>
              </div>

              {/* أزرار الإجراءات */}
              <div className="mt-4 flex items-center justify-end gap-3 border-t pt-3">
                {(isAdmin || CanEdit) && (
                  <button
                    onClick={() => handelEdit(item)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="تعديل"
                  >
                    <MdOutlineEditNote size={22} />
                  </button>
                )}
                {(isAdmin || CanDelte) && (
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="حذف"
                  >
                    <AiTwotoneDelete size={22} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مودالات الإضافة والتعديل */}
      <MdouleAddCategoray
        fetshkey="InstitutionsCompany"
        titale="المؤسسه"
      />

      <EditmainCategory
        fetshkey="InstitutionsCompany"
        titale="المؤسسه"
      />
    </div>
  )
}

export default InstitutionsCompany