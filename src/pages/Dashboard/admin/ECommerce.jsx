import React from 'react';
import CardDataStats from '../../../components/common/CardDataStats';
import ChartOne from '../../../components/common/Charts/ChartOne';
import ChatCard from '../../../components/common/Chat/ChatCard';
import { FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { FaUsers } from "react-icons/fa";
import { GrTask } from "react-icons/gr";
import useQuerygetiteams from '../../../services/Querygetiteams';
import Loader from '../../../components/common/Loader';
import Cutomestatict from '../../../hooks/Cutomestatict';
import TopUsersChart from './TopUsersChart';
import ExpensessCard from '../../../components/common/ExpensessCard';
const ECommerce = () => {
  const {isLoading , data} = useQuerygetiteams("Systemstatistics" , "Systemstatistics")
  const {data:customers} = useQuerygetiteams("customers" , "customers")
  console.log("hello" , data);
  const missionStats = data?.data?.missionStats
  const generalStats = data?.data?.generalStats
  const topUsers = data?.data?.topUsers || []
  const TotalClientSections = data?.data?.sectionCustomerCounts
  const financialStats = data?.data?.financialStats
  const complated = "مكتملة"
  const Inproses = "فى تقدم"
  const closed = "ملغية"
  const formatNumber = (num) => {
    if (!num) return "0.00"; // Show 0.00 if no value
  
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"; // Convert 2000 -> 2.0K
    }
  
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  if(isLoading){
    return <Loader />
  }
  return (
    <>
 <div className='w-full h-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
          
                 <CardDataStats title="إجمالى المهام" to={"/Taskes"} total={missionStats?.totalMissions} >
                 <GrTask />

                 </CardDataStats>
                 <CardDataStats title="مهام متكملة" to={`/Taskes-status/${complated}`} levelUp total={missionStats?.completedTasks}  >
                 <FaCheckCircle className="text-green-500" />

                </CardDataStats>
                <CardDataStats title="فى تقدم" levelUp  to={`/Taskes-status/${Inproses}`} total={missionStats?.inProgressTasks}  >
                <FaSpinner className="text-blue-500 animate-spin" />
                </CardDataStats>
                <CardDataStats title="ملغية" total={missionStats?.closedTasks} to={`/Taskes-status/${closed}`}  >
                <FaTimesCircle className="text-red-500" />
                </CardDataStats>
                <CardDataStats title="إجمالى العملاء" total={generalStats?.totalCustomers}  to={`/cutomers`} >
                <FaUsers className="text-green-500" />
                </CardDataStats>
                <CardDataStats title="إجمالى الموظفين" to={`/All-users/employee`} total={generalStats?.totalEmployees}  >
                <FaUsers className="text-green-500" />
                </CardDataStats>
                <CardDataStats title="إجمالى الإدمن" to={`/All-users/admin`} total={generalStats?.totalAdmins}  >
                <FaUsers className="text-green-500" />
                </CardDataStats>
                <CardDataStats title="إجمالى المشاريع العامة"  to={`/privte-projects`}   total={generalStats?.totlaProjects}  >
                <FaUsers className="text-green-500" />
                </CardDataStats>
                <CardDataStats title="إجمالى المشاريع الخاصة" to={`/projects-main`}  total={generalStats?.totalPrivetproject}  >
                <FaUsers className="text-green-500" />
                </CardDataStats>


        </div>
          
    
      <div className="mt-4 w-full">
      <span  className='
      
      text-xl
      mt-5
      mb-10
      '>  إحصائيات إجمالى العملاء</span>
        <Cutomestatict chartType={"area"} data={customers?.data?.data || []} seriesName="إجمالى العملاء" />
     

  
   
   <TopUsersChart topUsers={topUsers} />
     
      
      
      </div>
    </>
  );
};

export default ECommerce;
