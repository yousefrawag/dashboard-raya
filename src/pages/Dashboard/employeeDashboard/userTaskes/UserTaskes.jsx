import React from 'react'
import Breadcrumb from '../../../../components/common/Breadcrumbs/Breadcrumb'
import CardDataStats from '../../../../components/common/CardDataStats'
import { GrTask } from "react-icons/gr";
import { MdOutlineDoneOutline } from "react-icons/md";
import { FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { FaUsers } from "react-icons/fa";
import Usertaskesdata from '../../../../components/ui/userTaskesui/Usertaskesdata';
import Cutomestatict from '../../../../hooks/Cutomestatict';
import useQuerygetiteams from '../../../../services/Querygetiteams';
import useQuerygetSpacficIteam from '../../../../services/QuerygetSpacficIteam';
import { useSelector } from 'react-redux';
import Loader from '../../../../components/common/Loader';
import UserClients from './UserClients';
import ExpenseCard from '../../../../components/common/ExpensessCard';
const UserTaskes = () => {
  const user = useSelector((state) => state.userState.userinfo)
  const { data, isLoading } = useQuerygetSpacficIteam("missions/users", "missions/users", user?._id)
    const { data:userexpenses } = useQuerygetSpacficIteam("expenss", "expenss", user?._id)
  const { data:customerusers } = useQuerygetiteams("customers/userCustomer", "customers/userCustomer");
  const { data: allTaskes } = useQuerygetiteams("missions", "missions")
  const { data: AllCustomers } = useQuerygetiteams("customers", "customers")
console.log("expenses" ,userexpenses );

  if (isLoading) {
    return <Loader />
  }

  const totalTasks = data?.data?.length || 0;
  const completedTasks = data?.data?.filter((item) => item?.status === "مكتملة").length || 0;
  const inProcessTasks = data?.data?.filter((item) => item?.status === "فى تقدم").length || 0;
  const canceledTasks = data?.data?.filter((item) => item?.status === "مغلقة").length || 0;
  const userClientCount = customerusers?.data?.data.length || 0;
  const allCustomersCount = AllCustomers?.data.length || 1; // Prevent division by zero

  // Calculate percentages
  const completedPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";
  const inProcessPercentage = totalTasks > 0 ? ((inProcessTasks / totalTasks) * 100).toFixed(1) : "0";
  const canceledPercentage = totalTasks > 0 ? ((canceledTasks / totalTasks) * 100).toFixed(1) : "0";
  const userClientPercentage = allCustomersCount > 0 ? ((userClientCount / allCustomersCount) * 100).toFixed(1) : "0";

  return (
    <div className='w-full h-full'>
      <Breadcrumb pageName="المهام التى حصلت عليها" />
      <div className='w-full h-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4'>

        <CardDataStats title="إجمالى المهام" total={totalTasks} >
          <GrTask />
        </CardDataStats>

        <CardDataStats title="مهام متكملة" levelUp total={completedTasks} rate={`${completedPercentage}%`}>
          <FaCheckCircle className="text-green-500" />
        </CardDataStats>

        <CardDataStats title="فى تقدم" levelUp total={inProcessTasks} rate={`${inProcessPercentage}%`}>
          <FaSpinner className="text-blue-500 animate-spin" />
        </CardDataStats>

        <CardDataStats title="ملغية" total={canceledTasks} levelDown rate={`${canceledPercentage}%`}>
          <FaTimesCircle className="text-red-500" />
        </CardDataStats>

        <CardDataStats title="عملاء مضافين من قبلى" total={userClientCount} levelDown rate={`${userClientPercentage}%`}>
          <FaUsers className="text-green-500" />
        </CardDataStats>
        {
          userexpenses?.data?.map((item) => {
            return <ExpenseCard key={item?._id} currency={item?.currency}  currentMonthExpense={item?.monthly} title='expenses' total={item.total}/>
          })
        }
                        
           {/* <ExpenseCard currentMonthExpense={100}   title='expenses' currency='EUR' total={2500}/>
               <ExpenseCard  currentMonthExpense={10}  title='expenses' currency='dolar' total={2500}/> */}

      </div>

      <h2 className='text-balck dark:text-white text-2xl mt-5 text-bold'> عملاء مضافين من قبلى </h2>
      <Cutomestatict chartType={"line"} data={customerusers?.data?.data || []} seriesName="إجمالى العملاء هذا الوقت" />
      <UserClients />
      <span className='text-2xl text-black dark:text-white'>المهام التى حصلت عليها</span>
      <Cutomestatict chartType={"area"} data={data?.data || []} seriesName=" المهام التى حصلت عليها " />
      <Usertaskesdata data={data} />
    </div>
  )
}
export default UserTaskes