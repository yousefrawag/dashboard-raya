import React, { useEffect, useState } from 'react';
import { useDashboardContext } from '../../../context/DashboardProviedr';
import useQueryadditeam from "../../../services/Queryadditeam";
import toast from 'react-hot-toast';

const AddLocationRegions = ({ fetshkey, titale }) => {
  const { module, setmodule } = useDashboardContext();
  const [requerFiled, setRequirefiled] = useState("");
  const { addIteam } = useQueryadditeam(fetshkey, fetshkey);
  const [Region, setRegion] = useState("");
  const [AllRelatedRegion, setAllRelatedRegion] = useState([]);

  const handelsubmit = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      if (!data.name) {
        return setRequirefiled("هذا الحقل مطلوب");
      }
      if(AllRelatedRegion  === 0){
        return toast.error("يجب اضافه تابع ")
      }
  data.relatedRegions = AllRelatedRegion;
      if (AllRelatedRegion.length > 0) {
        data.relatedRegions = AllRelatedRegion;
      }

      addIteam(data, {
        onSuccess: () => {
          setRequirefiled("");
          setmodule(false);
          setAllRelatedRegion([]);
          toast.success("تم إضافة مستوى جديد");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handelAddnewRegion = () => {
    const trimmed = Region.trim();
    if (trimmed && !AllRelatedRegion.includes(trimmed)) {
      setAllRelatedRegion((prev) => [...prev, trimmed]);
      setRegion("");
    }
  };

  const delateRegion = (regionToDelete) => {
    const updated = AllRelatedRegion.filter((item) => item !== regionToDelete);
    setAllRelatedRegion(updated);
  };

  useEffect(() => {
    if (module) {
      setRequirefiled("");
    }
  }, [module]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${module ? "flex" : "hidden"} items-center justify-center`}>
      <form
        onSubmit={handelsubmit}
        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90%] overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setmodule(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {titale}
        </h2>

        {/* Main Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
        {titale}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={`قم بكتابة ${titale}`}
            className="text-main p-3 w-full outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-main"
          />
          {requerFiled && <p className="text-red-500 text-sm mt-1">{requerFiled}</p>}
        </div>

        {/* Region Input and Add Button */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={Region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="قم بكتابة المشتقات"
            className="text-main p-3 flex-1 outline-0 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-main"
          />
          <button
            type="button"
            onClick={handelAddnewRegion}
            className="text-white bg-main hover:bg-main2 transition rounded-md px-4 py-2"
          >
            + إضافة تابع
          </button>
        </div>

        {/* Render Regions */}
        {AllRelatedRegion.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {AllRelatedRegion.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 border border-gray-300 px-3 py-2 rounded-md"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  type="button"
                  onClick={() => delateRegion(item)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="text-end">
          <button
            type="submit"
            className="bg-main hover:bg-main2 text-white px-6 py-2 rounded-md transition"
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLocationRegions;
