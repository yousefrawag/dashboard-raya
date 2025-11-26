import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import useQueryadditeam from '../../../services/Queryadditeam';
import toast from 'react-hot-toast';
import SelectoptionHook from '../../../hooks/SelectoptionHook';
import useQuerygetiteams from '../../../services/Querygetiteams';
import useQueryupdate from '../../../services/useQueryupdate';
const EditExpensess = () => {
  const {
    expenseemoduleEdit,
    setExpensesmoduleedit,
    expenssEidt,
    setExpensesEdit,
  } = useDashboardContext();
  const [requerFiled, setRequirefiled] = useState('');
  const { data } = useQuerygetiteams('users', 'users');
  const { isError, isLoading, updateiteam } = useQueryupdate(
    'expenss',
    'expenss',
  );
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('');
  const [type, setType] = useState('');
  // handel add new main category
  const handelsubmit = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const data = Object.fromEntries(formData);
      data.user = value;
      if (!data.type) {
        return toast.error('يجب إضافة نوع المصروف');
      }
      if (!data.user) {
        return toast.error('يجب إضافة  الموظف المستفيد');
      }
      if (!data.curenccy) {
        return toast.error('يجب إضافة   نوع العملة');
      }
      if (!data.total) {
        return toast.error('يجب إضافة    إجمالى المبلغ');
      }

      updateiteam(
        { data, id: expenssEidt?._id },
        {
          onSuccess: () => {
            setRequirefiled('');
            setExpensesmoduleedit(false);
            toast.success('تم إضافه مستوى جديد');
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (expenssEidt) {
        console.log("expense eidt" , expenssEidt);
        
      setValue(expenssEidt?.user?._id);
      setCurrency(expenssEidt?.curenccy);
      setType(expenssEidt?.type);
    }
  }, [expenssEidt]);
  // end handel add new main category
  useEffect(() => {
    if (expenseemoduleEdit) {
      return setRequirefiled('');
    }
  }, [expenseemoduleEdit]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center top-0 right-0 bottom-0  ${
        expenseemoduleEdit ? 'flex' : 'hidden'
      }`}
    >
      <form
        onSubmit={handelsubmit}
        className="relative bg-white p-6 rounded-md shadow-lg w-full max-w-[500px] max-h-[400px] min-h-[200px]  mt-5 p-4 overflow-auto	"
      >
        {/* Close Button */}
        <button
          onClick={() => setExpensesmoduleedit(false)}
          className="absolute top-3 mb-10 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
          type="button"
        >
          ✕
        </button>
        {/* Content of the popup */}
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="user"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            الموظف
          </label>
          <select
            required
            name="user"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            id="user"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر</option>
            {data?.data?.data?.map((item) => {
              return (
                <option key={item._id} value={item?._id}>
                  {item?.fullName}
                </option>
              );
            })}
          </select>
        </div>{' '}
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="type"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            نوع المصروف
          </label>
          <select
            required
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            id="type"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر</option>
            <option value="راتب">راتب</option>
            <option value="عمولة">عمولة</option>
            <option value="تحفيز">تحفيز</option>
          </select>
        </div>
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="curenccy"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            العملة
          </label>
          <select
            required
            name="curenccy"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            id="curenccy"
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          >
            <option value="">أختر</option>
            <option value="شيكل">شيكل</option>
            <option value="دولار">دولار</option>
            <option value="دينار">دينار</option>
          </select>
        </div>
        <div className="mb-6 flex flex-col  gap-2">
          <label
            htmlFor="total"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            إجمالى المبلغ
          </label>
          <input
            type="number"
            name="total"
            defaultValue={expenssEidt?.total}
            className="focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 flex flex-col  gap-2 mt-5">
          <label
            htmlFor="notes"
            className="w-full text-lg font-medium text-black dark:text-white"
          >
            ملاحظات
          </label>
          <textarea
            name="notes"
            defaultValue={expenssEidt?.notes}
            className="min-h-[200px] focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary text-main p-3 w-full  outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="block text-white bg-main hover:bg-main2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:focus:ring-blue-800"
        >
          حفظ
        </button>
      </form>
    </div>
  );
};

export default EditExpensess;
