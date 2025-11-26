import React from 'react'
import CardDataStats from "../../../components/common/CardDataStats"
import { GrTask } from "react-icons/gr";
import { FaUsers } from "react-icons/fa";
const BoardingReports = () => {
  return (
    <div className='w-full h-full grid dark:bg-boxdark dark:drop-shadow-none grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-5'>

        <CardDataStats  to="/missions-repoart" title="تقارير المهام "  >
          <GrTask />
        </CardDataStats>

        <CardDataStats to="/cutomer-reports" title=" تقارير العملاء" >
          <FaUsers className="text-green-500" />
        </CardDataStats>
        <CardDataStats to="/employee-reports" title=" تقارير دوام الموظفين" >
          <FaUsers className="text-green-500" />
        </CardDataStats>
               <CardDataStats to="/all-dealyReport" title="التقرير اليومى" >
          <FaUsers className="text-green-500" />
        </CardDataStats>

     

    

      </div>
  )
}

export default BoardingReports