import React from 'react';
import HeadPagestyle from '../components/common/HeadPagestyle';
import CustomeTabel from '../components/common/CustomeTabel';
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GrFormView } from 'react-icons/gr';
import { AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineEditNote } from 'react-icons/md';
import { format } from 'date-fns';
import AddExpenssModule from '../components/common/popupmdules/AddExpenssModule';
import useQuerygetiteams from '../services/Querygetiteams';
import Loader from '../components/common/Loader';
import useQueryDelete from '../services/useQueryDelete';
import useGetUserAuthentications from '../middleware/GetuserAuthencations';
import { useState, useMemo } from 'react';
import FiltertionHook from '../hooks/FiltertionHook';
import Breadcrumb from '../components/common/Breadcrumbs/Breadcrumb';
import { useDashboardContext } from '../context/DashboardProviedr';
import EditExpensess from '../components/common/popupmdules/EditExpensess';
const Expensess = () => {
  const { data, isLoading } = useQuerygetiteams('expenss', 'expenss');
  const { deleteIteam } = useQueryDelete('expenss', 'expenss');
  const { setExpensesmoduleedit, expenssEidt, setExpensesEdit , setExpensesmodule } =
    useDashboardContext();

  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } =
    useGetUserAuthentications('expensee');

  // handel filter
  const [params, setParams] = useState({
    field: '',
    searchTerm: '',
    startDate: '',
    endDate: '',
  });

  const filters = [
    { value: 'user.fullName', name: 'الإسم' },
    { value: 'email', name: 'الإيميل' },
    { value: 'job', name: 'الوظيفة' },
  ];

  const filteredData = useMemo(() => {
    if (!data?.data?.data) return [];

    return data.data?.data.filter((item) => {
      if (params.searchTerm && params.field) {
        const fieldValue = params.field
          .split('.')
          .reduce((obj, key) => obj?.[key], item);
        return fieldValue
          ?.toLowerCase()
          .includes(params.searchTerm.toLowerCase());
      }
      return true;
    });
  }, [data, params]);
  const handelEdit = (item) => {
    setExpensesEdit(item);
    setExpensesmoduleedit(true);
  };
  const columns = [
    {
      name: 'الموظف',
      selector: (row) => row?.user?.fullName,
      cell: (row) => (
        <Link
        to={`/expenss/${ row?.user?._id}`}
          style={{
            width: '300px',
            cursor:"pointer"
          }}
          onClick={() => handelEdit(row)}
          className="flex gap-4 w-full w-50 no-wrap pointer"
        >
          <img
            className="w-[30px] h-[30px] rounded-full"
            src={row?.user?.imageURL}
            alt="user-image"
          />
          <span>{row?.user?.fullName}</span>
        </Link>
      ),
    },

    {
      name: 'الجوال',
      selector: (row) => row?.user?.phoneNumber,
      cell: (row) => (
        <span
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {' '}
          {row?.user?.phoneNumber}
          <a
            style={{ fontSize: '20px', color: '#075E54' }}
            href={`whatsapp://send?phone=${row?.user?.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        </span>
      ),
    },
    ,
    {
      name: 'نوع العملية',
      selector: (row) => row?.type || 'غير متوفر',
    },

    {
      name: 'العملة',
      selector: (row) => row?.curenccy || 'غير متوفر',
    },
 {
  name: 'إجمالى المبلغ',
  selector: (row) => {
    const currencySymbol =
      row?.curenccy === 'دولار' ? '$' :
      row?.curenccy === 'شيكل' ? '₪' :
      ''; // or use '؟' or 'غير معروف'

    return (
      <span className="text-red-500">
        {row?.total ? `${row.total} ${currencySymbol}` : 'غير متوفر'}
      </span>
    );
  }
}
 ,
    {
      name: 'ملاحظات',
      selector: (row) => row?.notes || 'غير متوفر',
    },
    {
      name: 'تاريخ الإنشاء',
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'wrap',
          }}
        >
          {format(new Date(row.createdAt), 'dd MMMM, yyyy')}
        </span>
      ),
    },
    {
      name: 'اجراء',
      selector: (row) => row.procedure,
      cell: (row) => (
        <div className="flex items-center justify-center gap-4 space-x-3.5">
          {isAdmin || CanEdit ? (
            <button
              onClick={() => handelEdit(row)}
              className="hover:text-primary"
            >
              <MdOutlineEditNote size={20} />
            </button>
          ) : null}
          {isAdmin || CanDelte ? (
            <button
              className="hover:text-red-500"
              onClick={() => deleteIteam(row._id)}
            >
              <AiTwotoneDelete size={20} />
            </button>
          ) : null}
        </div>
      ),
    },
  ];
      const columnsfile = [
       {
         name: 'الموظف',
         selector: (row) => row?.user?.fullName,
         cell: (row) => (
           <span
             style={{
               width: '300px',
               cursor:"pointer"
             }}
             onClick={() => handelEdit(row)}
             className="flex gap-4 w-full w-50 no-wrap pointer"
           >
             <img
               className="w-[30px] h-[30px] rounded-full"
               src={row?.user?.imageURL}
               alt="user-image"
             />
             <span>{row?.user?.fullName}</span>
           </span>
         ),
       },
   
       {
         name: 'الجوال',
         selector: (row) => row?.user?.phoneNumber,
         cell: (row) => (
           <span
             style={{
               textOverflow: 'ellipsis',
               whiteSpace: 'nowrap',
               display: 'flex',
               flexDirection: 'column',
               gap: '10px',
             }}
           >
             {' '}
             {row?.user?.phoneNumber}
             <a
               style={{ fontSize: '20px', color: '#075E54' }}
               href={`whatsapp://send?phone=${row?.user?.phoneNumber}`}
               target="_blank"
               rel="noopener noreferrer"
             >
               <FaWhatsapp />
             </a>
           </span>
         ),
       },
       ,
       {
         name: 'نوع العملية',
         selector: (row) => row?.type || 'غير متوفر',
       },
   
       {
         name: 'العملة',
         selector: (row) => row?.curenccy || 'غير متوفر',
       },
  {
    name: 'إجمالى المبلغ',
    selector: (row) => row?.total
  }
  ,
       {
         name: 'ملاحظات',
         selector: (row) => row?.notes || 'غير متوفر',
       },
       {
         name: 'تاريخ الإنشاء',
         selector: (row) => row.createdAt,
         cell: (row) => (
           <span
             style={{
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               whiteSpace: 'wrap',
             }}
           >
             {format(new Date(row.createdAt), 'dd MMMM, yyyy')}
           </span>
         ),
       },
   
     ];  
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className=" w-full flex justify-between">
        <Breadcrumb pageName="المصاريف" />
        {isAdmin || CanAdd ? (
          <button
            onClick={() => setExpensesmodule(true)}
            className="block text-white bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800"
          >
            {' '}
            إضافة حالة جديد
          </button>
        ) : null}
      </div>{' '}
      <FiltertionHook
        filteredData={filteredData}
        columns={columnsfile}
        filters={filters}
        params={params}
        setParams={setParams}
      />
      <CustomeTabel data={filteredData} columns={columns} />
      <AddExpenssModule />
      <EditExpensess />
    </div>
  );
};

export default Expensess;
