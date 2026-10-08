import React, { useState, useMemo } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { format } from "date-fns";
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import toast from 'react-hot-toast';
import FiltertionHook from "../../../hooks/FiltertionHook";
import { FiFilter, FiX } from "react-icons/fi";
import { MdOutlineEditNote } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { GrFormView } from "react-icons/gr";

const GetSupliers = () => {
  const { data, isLoading } = useQuerygetiteams("supliers", "supliers");
  const { deleteIteam } = useQueryDelete("supliers", "supliers");

  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } =
    useGetUserAuthentications("Supliers");

  const [isSectionOpen, setIssectionOpen] = useState(false);

  const [params, setParams] = useState({
    field: "",
    searchTerm: "",
    startDate: "",
    endDate: "",
  });

  // الفلاتر المتاحة
  const fillters = [
    { value: "companyName", name: "اسم الشركة" },
    { value: "email", name: "البريد الإلكتروني" },
    { value: "phoneNumber", name: "رقم الهاتف" },
    { value: "phoneNumber2", name: "رقم الهاتف الثاني" },
    { value: "country", name: "الدولة" },
    { value: "city", name: "المدينة" },
    { value: "address", name: "العنوان" },
    { value: "products.length", name: "عدد المنتجات" },
  ];

  // الفلترة
  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data.data.filter((item) => {
      if (params.searchTerm && params.field) {
        const fieldValue = params.field
          .split(".")
          .reduce((obj, key) => obj?.[key], item);
        return fieldValue
          ?.toString()
          .toLowerCase()
          .includes(params.searchTerm.toLowerCase());
      }
      return true;
    });
  }, [data, params]);

  // حذف مورد
  const handleDelete = (id) => {
    try {
      deleteIteam(
        id ,
        {
          onSuccess: () => {
            toast.success("تم حذف المورد بنجاح");
          },
        }
      );
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  // الأعمدة الخاصة بجدول الموردين
  const columns = [
    {
      name: "اسم الشركة",
      selector: (row) => row?.companyName,
      width: "200px",
      sortable: true,
      cell: (row) => (
        <Link
          to={`/supliers/${row._id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          {row?.companyName || row?._id}
        </Link>
      ),
    },
    {
      name: "رقم الهاتف",
      selector: (row) => row?.phones[0],
      width: "150px",
      cell: (row) => (
        <div dir="ltr" className="text-right">
          {row?.phones[0] || "غير متوفر"}
        </div>
      ),
    },
    {
      name: "رقم الهاتف الثاني",
      selector: (row) => row?.phones[1],
      width: "150px",
      cell: (row) => (
        <div dir="ltr" className="text-right">
          {row?.phones[1] || "غير متوفر"}
        </div>
      ),
    },
    {
      name: "البريد الإلكتروني",
      selector: (row) => row?.emails[0],
      width: "220px",
      cell: (row) => (
        <div dir="ltr" className="text-right truncate" title={row?.emails[0]}>
          {row?.emails[0] || "غير متوفر"}
        </div>
      ),
    },
    {
      name: "دولة الشركة",
      selector: (row) => row?.country,
      width: "140px",
      cell: (row) => (
        <span
          className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-sm"
        >
          {row?.country || "غير متوفر"}
        </span>
      ),
    },
    {
      name: "عدد المنتجات",
      selector: (row) => row?.products?.length || 0,
      width: "150px",
      sortable: true,
      sortFunction: (rowA, rowB) =>
        (rowA?.products?.length || 0) - (rowB?.products?.length || 0),
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-lg font-semibold text-sm ${
            row?.products?.length > 0
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-gray-50 text-gray-500 border border-gray-200"
          }`}
        >
          {row?.products?.length || 0}
        </span>
      ),
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) => row.createdAt,
      width: "170px",
      sortable: true,
      cell: (row) => (
        <div title={format(new Date(row.createdAt), "dd MMMM, yyyy")}>
          {format(new Date(row.createdAt), "dd MMMM, yyyy")}
        </div>
      ),
    },
    {
      name: "إجراءات",
      width: "220px",
      cell: (row) => (
        <div className="flex items-center justify-center space-x-2 space-x-reverse">
          {/* عرض */}
          {(isAdmin || CanView) && (
            <Link
              to={`/supliers-main/${row._id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200"
              title="عرض"
            >
              <GrFormView size={20} />
             
            </Link>
          )}

          {/* تعديل */}
          {(isAdmin || CanEdit) && (
            <Link
              to={`/edit-suplier/${row._id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-all duration-200"
              title="تعديل"
            >
              <MdOutlineEditNote size={20} />
            
            </Link>
          )}

          {/* حذف */}
          {(isAdmin || CanDelte) && (
            <button
              onClick={() => handleDelete(row._id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-500 rounded-lg transition-all duration-200"
              title="حذف"
            >
              <AiTwotoneDelete size={18} />
             
            </button>
          )}
        </div>
      ),
    },
  ];

  // أعمدة الفلتر / التصدير
  const columnsfile = [
    { name: "اسم الشركة", selector: (row) => row?.companyName },
    { name: "رقم الهاتف", selector: (row) => row?.phoneNumber },
    { name: "رقم الهاتف الثاني", selector: (row) => row?.phoneNumber2 },
    { name: "البريد الإلكتروني", selector: (row) => row?.email },
    { name: "الدولة", selector: (row) => row?.country },
    { name: "المدينة", selector: (row) => row?.city },
    { name: "العنوان", selector: (row) => row?.address },
    {
      name: "عدد المنتجات",
      selector: (row) => row?.products?.length || 0,
    },
    {
      name: "تاريخ الإنشاء",
      selector: (row) =>
        format(new Date(row.createdAt), "dd MMMM, yyyy"),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='pt-5'>
      <HeadPagestyle
        pageName="الموردين"
        isAdmin={isAdmin}
        CanAdd={CanAdd}
        to="/supliers/new"
        title="إضافة مورد"
      />

      {/* زر عرض الفلاتر */}
      <button
        className="flex items-center gap-2 mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
        onClick={() => setIssectionOpen(!isSectionOpen)}
      >
        {isSectionOpen ? <FiX size={20} /> : <FiFilter size={20} />}
        {isSectionOpen ? "إخفاء الفلاتر" : "عرض الفلاتر"}
      </button>

      {isSectionOpen && (
        <FiltertionHook
          filteredData={filteredData}
          columns={columnsfile}
          filters={fillters}
          params={params}
          setParams={setParams}
        />
      )}

      <CustomeTabel data={filteredData} columns={columns} />
    </div>
  );
};

export default GetSupliers;