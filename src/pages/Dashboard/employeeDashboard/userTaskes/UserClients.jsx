import React from 'react'
import { useSelector } from 'react-redux'
import useQuerygetiteams from '../../../../services/Querygetiteams'
import { useState } from 'react'
import { useMemo } from 'react'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import Loader from '../../../../components/common/Loader'
import GetClientsCashoption from '../../../../components/common/GetClientsCashoption'
import GetProjectStatusChart from '../../../../components/common/GetProjectStatusChart'
import GetclientMostReqions from '../../../../components/common/GetclientMostReqions'
import GetclientsFirstpayments from '../../../../components/common/GetclientsFirstpayments'
import GetclientsWithviedtyes from '../../../../components/common/GetclientsWithviedtyes'
import GetclientsTypes from '../../../../components/common/GetclientsTypes'
import MostPorjectRequestsBycustomers from '../../../../components/common/MostPorjectRequestsBycustomers'
const UserClients = () => {
    const user = useSelector((state) => state.userState.userinfo)
    const { isError, isLoading, data } = useQuerygetiteams("customers/userCustomer", "customers/userCustomer");
console.log("user clients" , data);

    const filtersDays = ["الكل" , "يومى", "أسبوعى", "شهرى" ];
  
    const [params, setParams] = useState({
      field: "",
      searchTerm: "",
      startDate: "",
      endDate: "",
      dateFilter: "الكل",
    });
  

  
    const filteredData = useMemo(() => {
      if (!data?.data?.data) return [];
  
      return data.data?.data.filter(item => {
        if (params.searchTerm && params.field) {
          const fieldValue = params.field.split('.').reduce((obj, key) => obj?.[key], item);
          if (!fieldValue?.toLowerCase().includes(params.searchTerm.toLowerCase())) {
            return false;
          }
        }
  
        if (params.startDate && params.endDate) {
          const itemDate = new Date(item.createdAt);
          const startDate = new Date(params.startDate);
          const endDate = new Date(params.endDate);
  
          if (!isWithinInterval(itemDate, { start: startDate, end: endDate })) {
            return false;
          }
        }
  
        if (params.dateFilter) {
          const itemDate = new Date(item.createdAt);
          const now = new Date();
  
          switch (params.dateFilter) {
            case "يومى":
              if (!isWithinInterval(itemDate, { start: startOfDay(now), end: endOfDay(now) })) {
                return false;
              }
              break;
            case "أسبوعى":
              if (!isWithinInterval(itemDate, { start: startOfWeek(now), end: endOfWeek(now) })) {
                return false;
              }
              break;
            case "شهرى":
              if (!isWithinInterval(itemDate, { start: startOfMonth(now), end: endOfMonth(now) })) {
                return false;
              }
              break;
              case "الكل":
               return true ;
               
            default:
              break;
          }
        }
  
        return true;
      });
    }, [data, params]);
    const handelStringLength = (text) =>{
      if(text?.length > 20) {
        return `${text.substring(0 , 20)}...`
      } 
      return text
    }
   const columns = [
        {
          name: "إسم المشترى",
          selector: (row) => row?.fullName,
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
      
              }}
            >
              {" "}
             { row?.fullName }
            </span>
          )
        },
        {
          name: "جوال 1",
       
          cell: (row) => (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display:"flex",
                flexDirection:"column",
                gap:"10px"
              }}
            >
              {" "}
             { row.phoneNumber}
        
              <a style={{fontSize:"20px" , color:"#075E54"}}  href={`whatsapp://send?phone=${row.phoneNumber}`} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
              </a>
           
            </span>
          ),
        },
        {
          name: "إسم المسوق /ة",
          selector: (row) => row?.addBy,
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
      
              }}
            >
              {" "}
             { row?.addBy }
            </span>
          )
        },
        {
          name: "المشروع المهتم به",
      
          cell: (row) => (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                overflow: "hidden",
              }}
            >
              {" "}
             { row?.project}
            </span>
          )
        },
        {
          name: "الدفعة الإولى",
     
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
              width:"40%",
              margin:"0 auto",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
              }}
            >
              {" "}
             { row?.firstPayment}
            </span>
          )
          
        },
        {
          name: "تاريخ أخر تواصل",
          selector: (row) => row.endContactDate,
          cell: (row) => {
            const date = new Date(row.endContactDate);
            return isNaN(date) ? (
              "غير معروف"
            ) : (
              <span
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                  overflow: "hidden",
                }}
                title ={format(date, "dd MMMM, yyyy")}
              >
    
                { row.endContactDate  ? format(date, "dd MMMM, yyyy") :"غير مضاف"}
              </span>
            );
          },
        },
        {
          name: " اخر ماتم التواصل",
          selector: (row) => row.clientendRequr,
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
      
              }}
              title={row?.clientendRequr}
            >
              {" "}
             {handelStringLength (row?.clientendRequr)}
            </span>
          )
        },
        {
          name: "هل تمت المعاينة",
          selector: (row) => row.isViwed,
          cell: (row) => (
            <span
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                
              }}
            >
              {" "}
             { row.isViwed}
            </span>
          ),
        },
        {
          name: "متطلبات العميل",
          selector: (row) => row?.clientRequire,
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
      
              }}
              title={row?.clientRequire}
            >
              {" "}
             { handelStringLength(row?.clientRequire) }
            </span>
          )
        },
        {
          name: "ملاحظات",
          selector: (row) => row?.notes,
          cell: (row) => (
            <span
              style={{
            
                whiteSpace: "wrap",
             
      
              }}
              title={row?.notes}
            >
              {" "}
             { handelStringLength(row?.notes) }
            </span>
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
             
              <div className="flex items-center justify-center space-x-3.5">
           {
            isAdmin || CanEdit ? 
            <Link to={`/Edit-Customer/${row._id}`} className="hover:text-primary">
            <MdOutlineEditNote size={20}/>
          </Link>
             : null
           }
           {
            isAdmin || CanDelte ? 
            <button className="hover:text-red-500" onClick={() => deleteIteam(row._id)}>
            <AiTwotoneDelete size={20}/>
          </button>
             : null
           }
          
            </div>
            ),
          },
        ];
  
    if (isLoading) {
      return <Loader />;
    }
  
    const handleDateFilterChange = (filter) => {
      setParams(prevParams => ({
        ...prevParams,
        dateFilter: filter,
      }));
    };
  
    return (
      <div>
        <span className='text-lg mb-3 '>إحصائيات العملاء المضافين من قبلى</span>
        <div>
          {filtersDays.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleDateFilterChange(filter)}
              className={ params.dateFilter === filter ? `bg-main text-white `: "text-white bg-main2 "}
              style={{ margin: '5px', padding: '10px' , borderRadius:"5px"}}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        
      <GetclientsTypes  data={filteredData}/>
      <GetclientsWithviedtyes  data={filteredData}/>
      <GetclientMostReqions  data={filteredData}/>
     
      <GetClientsCashoption  data={filteredData}/>
      <GetclientsFirstpayments  data={filteredData}/>
      <MostPorjectRequestsBycustomers data={filteredData}/>
        </div>

   
      </div>
    );
}

export default UserClients