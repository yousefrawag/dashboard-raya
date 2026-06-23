import React from 'react'
import SelectoptionHook from '../../../hooks/SelectoptionHook'
import useQuerygetiteams from '../../../services/Querygetiteams'

const EmployeeCustomerContactnotes = ({details ,data ,  retlatedReportType ,retlatedCustomerDealStauts,formsData , setDeatils , ContactDate  , setContactDate ,CustomerDealsatuts ,handelInputschage } ) => {
        const { data:ReportTypes, isLoading } = useQuerygetiteams('ReportType', 'ReportType');

  return (
    <div className='w-full border-[1px] border-[#eee] p-4'>
   
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4  '>
  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="details"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
            
         أخر تواصل مع العميل

            </label>
            <textarea
            value={details}
            onChange={(e) => setDeatils(e.target.value)}
              name="details"
              required
              className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            ></textarea>
          </div>

  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="CustomerDealsatuts"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
        حاله العميل مع المتابعة

            </label>
            <select 
            value={CustomerDealsatuts}
            onChange={handelInputschage}
            required
            name='CustomerDealsatuts'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالاختيار</option>
{
  data?.data?.data?.map((item) => {
    return <option key={item?._id} value={item?.name}>{item?.name}</option>
  })
}
</select>
          </div>

  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="CustomerDealsatutsDescrep"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
       وصف حاله العميل مع المتابعة 

            </label>
            <select 
            value={formsData.CustomerDealsatutsDescrep}
            onChange={handelInputschage}
            required
            name='CustomerDealsatutsDescrep'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالاختيار</option>
{
  retlatedCustomerDealStauts?.map((item) => {
    return <option key={item} value={item}>{item}</option>
  })
}
</select>
          </div>
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
      value={formsData.customerDate}
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
              value={ContactDate}
              required
              onChange={(e) => setContactDate(e.target.value)}
           
              className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            />
          </div>






          {
  isLoading ? "loadding ..." : <div className="mb-6 flex flex-col  gap-2 w-full">
        <label
      htmlFor="ReportType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
       نوع التقرير *

    </label>
            <select 
                 name="ReportType"
      id="ReportType"
     value={formsData.ReportType}
   onChange={handelInputschage}
            required
            
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالإختيار</option>
{
  ReportTypes?.data?.data?.map((item) => {
    return <option key={item?._id} value={item?.name}>{item?.name}</option>
  })
}
</select>
          </div>
}
  <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="ReportTypeDescriep"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
       وصف التقرير 

            </label>
            <select 
            value={formsData.ReportTypeDescriep}
            onChange={handelInputschage}
            required
            name='ReportTypeDescriep'
               className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"


>
<option value="">قم بالاختيار</option>
{
  retlatedReportType?.map((item) => {
    return <option key={item} value={item}>{item}</option>
  })
}
</select>
          </div>
          {/* <div className="mb-6 flex flex-col  gap-2">
    <label
      htmlFor="ReportType"
      className="w-full text-lg font-medium text-black dark:text-white"
    >
       نوع التقرير *

    </label>
    <select
      name="ReportType"
      id="ReportType"
     value={formsData.ReportType}
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
  </div> */}

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
      value={formsData.nextReminderDate}
     name="nextReminderDate"
     
  
   
      className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
    />
  </div>
      <div className="mb-6 flex flex-col  gap-2 w-full">
            <label
              htmlFor="contactNotes"
              className="w-full text-lg font-medium text-black dark:text-white"
            >
     ملاحظات

            </label>
            <textarea
             onChange={handelInputschage}
      value={formsData.contactNotes}
              name="contactNotes"
           
              className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
            ></textarea>
          </div>
    </div>
 
    </div>
  )
}

export default EmployeeCustomerContactnotes