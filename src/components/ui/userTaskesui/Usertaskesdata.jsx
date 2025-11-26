import React from 'react'
import CustomeTabel from '../../common/CustomeTabel'
import { Link  } from 'react-router-dom';
import { GrFormView } from "react-icons/gr";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { IoChatboxEllipses } from "react-icons/io5";
import FiltertionHook from '../../../hooks/FiltertionHook';
import { useState } from 'react';
import { useMemo } from 'react';
const Usertaskesdata = ({data}) => {
      const [params, setParams] = useState({
        field: "",
        searchTerm: "",
        startDate: "",
        endDate: "",
      });
    
      const filters = [
  
        {
          value: "missionType",
          name: " نوع المشروع"
        },
        {
          value: "assignedBy.name",
          name: " مضاف من قبل"
        },
        {
          value: "status",
          name: " حالة المهمة "
        },
        {
          value: "project.name",
          name: "مشروع عام"
        },
        {
          value: "Privetproject.name",
          name: "مشروع خاص"
        },
      ];
   const columns = [
   
        {
          name: "نوع المشروع",
          selector: (row) => row?.missionType ,
        },
        {
          name: "المشروع",
          selector: (row) =>  row?.project?.projectName ? row?.project?.projectName : row?.Privetproject?.projectName || "غير متعارف عليه",
          cell: (row) => <div   
          style={{
           
           whiteSpace: "wrap",
        
    
         }}
         >{ row?.project?.projectName ? row?.project?.projectName : row?.Privetproject?.projectName || "غير معروف"}</div>,
        },

        {
            name: "الموظفين",
            selector: (row) => row.name,
            cell: (row) => (
              <div
                style={{
                  whiteSpace: "wrap",
                }}
                className='flex  items-center w-full h-full'
              >
                <div className='w-full h-full grid items-center grid-cols-2 lg:grid-cols-2'>
                  {row?.assignedTo?.slice(0, 2).map((item, index) => (
                    <img
                      key={index}
                      className='w-[30px] h-[30px] object-cover rounded-full border-[1px] border-main'
                      src={item?.imageURL}
                      alt='user-image'
                      style={{borderRadius:"50%"}}
                      title={item?.name} // Show user name on hover
                    />
                  ))}
                </div>
                {row.assignedTo?.length > 2 && (
                  <span style={{borderRadius:"50%"}} className='w-[30px] h-[30px] bg-main text-white flex items-center justify-center text-xs'>
                    +{row?.assignedTo?.length - 2}
                  </span>
                )}
              </div>
            ),
          },
          {
            name: "حالة مهمة",
            selector: (row) => row.status ,
            cell:(row) => <span style={{color:row.status === "فى تقدم" ? "red " :"green"}}>{row.status}</span>
          },
          {
            name: "متطلبات",
            selector: (row) => row?.requirements,
            cell: (row) => {
              const totalRequirements = row?.requirements?.length || 0;
              const completedRequirements = row?.requirements?.filter(req => req.complated)?.length || 0;
              const progress = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0;
              const isFullyCompleted = completedRequirements === totalRequirements;
          
              return (
                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className={`h-2.5 rounded-full ${
                        isFullyCompleted ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 text-main">
                    {completedRequirements}/{totalRequirements} مكتمل
                  </div>
                </div>
              );
            },
          },
        {
          name: "مضافه من قبل",
          selector: (row) => <span className='text-wrap'>{row?.assignedBy?.name}</span> ,
        },
        {
            name: "تاريخ التسليم",
            selector: (row) => row.deadline,
            cell: (row) => {
              const deadline = new Date(row.deadline);
              const now = new Date();
              const daysLeft = differenceInDays(deadline, now);
              const hoursLeft = differenceInHours(deadline, now) % 24; // Remaining hours
              const minutesLeft = differenceInMinutes(deadline, now) % 60; // Remaining minutes
          
              let remainingTime = "";
              if (daysLeft > 0) {
                remainingTime = `باقى ${daysLeft} ${daysLeft > 1 ? "أيام" : "يوم"}`;
              } else if (hoursLeft > 0) {
                remainingTime = `باقى ${hoursLeft} ساعة`;
              } else if (minutesLeft > 0) {
                remainingTime = `باقى ${minutesLeft} دقيقة`;
              } else {
                remainingTime = "انتهى الموعد النهائي"; // Deadline passed
              }
          
              return (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
                  {remainingTime}
                </span>
              );
            }},
       
      
        {
          name:"تاريخ الإنشاء",
          selector: (row) => row.createdAt,
          cell: (row) => <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace:"wrap"}}>{format(new Date(row.createdAt), "dd MMMM, yyyy")}</span>
        },
      
        {
          name: "اجراء",
          selector: (row) => row.procedure,
          cell: (row) => (
           
            
            <div className="flex items-center gap-3 justify-center space-x-3.5">
            <Link to={`/Taskes/${row._id}`} className="hover:text-primary">
            <GrFormView size={20} />
            </Link>
            <Link to={`/team-chat/${row._id}/${row?.chatID}`}  className="hover:text-primary">
              <IoChatboxEllipses size={20}/>
            </Link>
        
          </div>
          ),
        },
      ];
  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter(item => {
      if (params.searchTerm && params.field) {
        const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);
        return fieldValue?.toLowerCase().includes(params.searchTerm.toLowerCase());
      }
      return true;
    });
  }, [data, params]);
  
  return (
    <div className='w-full h-full mt-10'>
      <FiltertionHook filteredData={filteredData} columns={columns} key="المشاريع العامه.xlsx" filters={filters} params={params} setParams={setParams}/>
        <CustomeTabel data={filteredData} columns={columns} />
    </div>
  )
}

export default Usertaskesdata