import React, { useState } from 'react'
import SelectoptionHook from '../../../hooks/SelectoptionHook'
import useQuerygetiteams from '../../../services/Querygetiteams'
import useQueryupdate from '../../../services/useQueryupdate'
import toast from 'react-hot-toast'
import { NavLink, useParams , useNavigate} from 'react-router-dom'
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam'
import Loader from '../../../components/common/Loader'

const AddContact = () => {
    const {id} = useParams()
      const { data, isLoading:loadingGet } = useQuerygetSpacficIteam('customers', 'customers', id);
const {data:callStatus , isLoading:loadingCallstauts} = useQuerygetiteams("callcenterCustomerstauts" , "callcenterCustomerstauts")

   const { isError, isLoading, updateiteam } = useQueryupdate(
    'customers',
    'customers',
  );
    const navigate = useNavigate();
    const customer = data?.data;
const [formdata , setFormdata] = useState({
  details:"" ,
  detailsDate:"" ,
  prefers:"" ,
  CustomerDealsatuts:"" ,
  customerDate:"",
  ReportType:"" ,
  nextReminderDate:null



})
const handelInputschage = (e) => {
  const name = e.target.name
  const value = e.target.value
  setFormdata((prev) => ({
    ...prev,
    [name]:value
  }))
}

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("log-submit");
    
    try {
    

      const data = {
    
       customerDate: formdata.customerDate ,
   
          
        SectionFollow: {
          details: formdata.details,
          detailsDate: formdata.detailsDate ,
          prefers :formdata.prefers ,
          CustomerDealsatuts:formdata.CustomerDealsatuts ,
          ReportType:formdata.ReportType ,
          nextReminderDate:formdata.nextReminderDate
        }
      } ;

      updateiteam({data ,id}, {
        onSuccess: () => {
          toast.success("تم إضافة  إتصال , وتقرير يومى بخصوص العميل");
          setFormdata({
              details:"" ,
  detailsDate:"" ,
  prefers:"" ,
  CustomerDealsatuts:"" ,
  customerDate:"" ,
  nextReminderDate:null
          })
         navigate('/cutomers');
   
        },
        onError: (error) => {
          if (error.response && error.response.status === 404) {
            return toast.error("تم إضافة هذا العميل من قبل");
          }
          toast.error("حدث خطأ أثناء إضافة العميل - يرجى مراجعة البيانات");
        },
      });
    } catch (error) {
      console.log("erro"  ,  error);
      
    }
  };
  if(loadingGet){
    return <Loader />
  }
return (
    <form onSubmit={handleSubmit} className='w-full border-[1px] border-[#eee] p-4'>
   
    <div className='w-full border-[1px] border-[#eee] p-4'>
   
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4  '>
  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="details"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
         أخر ما تم مع العميل

            </label>
            <textarea
            value={formdata.details}
            onChange={handelInputschage}
              name="details"
              required
              className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            ></textarea>
          </div>
{
  isLoading ? "loadding ..." : <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="CustomerDealsatuts"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
        حاله العميل مع المتابعة

            </label>
            <select 
            value={formdata.CustomerDealsatuts}
            onChange={handelInputschage}
            required
            name='CustomerDealsatuts'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالإختيار</option>
{
  callStatus?.data?.data?.map((item) => {
    return <option key={item?._id} value={item?.name}>{item?.name}</option>
  })
}
</select>
          </div>
}

  <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="customerDate"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
تحديد موعد(اختياري)

    </label>
    <input
      type="date"
      id="customerDate"
      onChange={handelInputschage}
      value={formdata.customerDate}
     name="customerDate"
     
  
   
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
  </div>
          <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="ContactDate"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
         تاريخ التواصل

            </label>
            <input
              type="date"
              id="ContactDate"
              name="ContactDate"
              value={formdata.ContactDate}
              required
              onChange={handelInputschage}
           
              className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            />
          </div>
         
          <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="ReportType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
       نوع التقرير *

    </label>
    <select
      name="ReportType"
      id="ReportType"
   value={formdata.ReportType}
   onChange={handelInputschage}
      required
    
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    >
  <option value="">اختر نوع التقرير</option>
<option value="إضافة عميل">إضافة عميل</option>
<option value="متابعة مع عميل">متابعة مع عميل</option>
<option value="اجتماع مع عميل">اجتماع مع عميل</option>
<option value="مكالمة هاتفية">مكالمة هاتفية</option>
<option value="إرسال عرض سعر">إرسال عرض سعر</option>
<option value="استلام دفعة">استلام دفعة</option>
<option value="تحديث بيانات عميل">تحديث بيانات عميل</option>
<option value="زيارة ميدانية">زيارة ميدانية</option>
<option value="أخرى">أخرى</option>
 
    </select>
  </div>
      <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="nextReminderDate"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
 موعد التنبية  (اختياري)

    </label>
    <input
      type="date"
      id="nextReminderDate"
      onChange={handelInputschage}
      value={formdata.nextReminderDate}
     name="nextReminderDate"
     
  
   
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
  </div>
    </div>
    
    </div>
     <div className="add_return flex justify-between items-center mt-4 shadow-lg p-4 bg-white dark:bg-form-input">
              <div className="add_btn">
                <button
                  type="submit"
                  className={` py-2 px-6 rounded-md bg-main text-white hover:bg-transparent hover:border hover:border-blue-600 hover:text-blue-600`}
                >
                  حفظ
                </button>
              </div>
              <div className="return_btn">
                <NavLink
                  to="/cutomers"
                  className="bg-gray-300 text-gray-700 py-2 px-6 rounded-md"
                >
                  عوده
                </NavLink>
              </div>
            </div>
    </form>
  )
}

export default AddContact