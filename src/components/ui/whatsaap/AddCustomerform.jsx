import React, { useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import useQueryadditeam from "../../../services/Queryadditeam";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const AddCustomerForm = ({ nextStep, compainid, prevStep }) => {
  const { isLoading, addIteam } = useQueryadditeam("compain/addcustomer", "compain");

  const [compain, setCompain] = useState({
    campaignId: compainid,
    customers: [],
  });

  // عند اختيار ملف Excel
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // تنسيق البيانات
      const formatted = jsonData.map((row, index) => ({
        name: row.name || `عميل ${index + 1}`,
phoneNumber: row.phonenumber?.toString().trim().includes("+")
  ? row.phonenumber.toString().trim()
  : `+${row.phonenumber.toString().trim()}`
      }));

      setCompain((prev) => ({
        ...prev,
        customers: formatted,
      }));
      console.log("formatted" , formatted);
console.log("customers" , compain.customers);

      toast.success(`✅ تم قراءة ${formatted.length} رقم من الملف`);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء قراءة الملف");
    }
  };

  // عند الإرسال
  const handleAddCustomer = (e) => {
    e.preventDefault();

    if (compain.customers.length === 0) {
      toast.error("من فضلك اختر ملف Excel أولًا");
      return;
    }
console.log("customer-submit" , compain.customers);

    addIteam(compain, {
      onSuccess: (response) => {
        toast.success("تم حفظ العملاء بنجاح");
        nextStep((prev) => prev + 1);
      },
      onError: (error) => {
        toast.error(error.response?.data?.mesg || "حدث خطأ أثناء الحفظ");
      },
    });
  };

  return (
    <form
      onSubmit={handleAddCustomer}
      className="bg-white w-full p-8 rounded-2xl shadow"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        📁 رفع ملف Excel
      </h2>

      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
        <p className="text-gray-600">اسحب أو اختر ملف Excel (.xls / .xlsx)</p>
        <input
          type="file"
          accept=".xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {compain.customers.length > 0 && (
        <p className="mt-4 text-green-600 text-center">
          ✅ تم تحميل {compain.customers.length} رقم بنجاح
        </p>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 py-2 px-6 rounded-xl flex items-center gap-2"
        >
          <FaArrowLeft /> السابق
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white py-2 px-6 rounded-xl flex items-center gap-2"
        >
          التالي <FaArrowRight />
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
