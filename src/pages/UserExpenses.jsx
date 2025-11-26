import React from 'react'
import { useParams } from 'react-router-dom'
import useQuerygetSpacficIteam from '../services/QuerygetSpacficIteam'
import ExpenseCard from '../components/common/ExpensessCard'
import { useMemo } from 'react'
import { FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { useState } from 'react'
import FiltertionHook from '../hooks/FiltertionHook'
import CustomeTabel from '../components/common/CustomeTabel'
const UserExpenses = () => {
    const {id} = useParams()
      const { data:userexpenses } = useQuerygetSpacficIteam("expenss", "expenss",id)
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
    if (!userexpenses?.allExpenses) return [];

    return userexpenses?.allExpenses.filter((item) => {
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
  }, [userexpenses, params]);

   const columns = [
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
  return (
    <>
        <div className='w-full h-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-10'>

            {
          userexpenses?.data?.map((item) => {
            return <ExpenseCard key={item?._id} currency={item?.currency}  currentMonthExpense={item?.monthly} title='expenses' total={item.total}/>
          })
        }
    </div>
    
        <FiltertionHook
        filteredData={filteredData}
        columns={columnsfile}
        filters={filters}
        params={params}
        setParams={setParams}
      />
      <CustomeTabel data={filteredData} columns={columns} />
    </>

  )
}

export default UserExpenses