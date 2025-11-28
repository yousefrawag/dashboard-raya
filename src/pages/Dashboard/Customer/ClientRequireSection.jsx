import React, { useState } from "react";
import useQuerygetiteams from "../../../services/Querygetiteams";
import toast from "react-hot-toast";

const ClientRequireSection = ({ setClientRequiremnts, clientRequirements }) => {
  const { data } = useQuerygetiteams("requirements", "requirements");
  const { data: locations } = useQuerygetiteams("location", "location");

  const [formData, setFormData] = useState({
    rquireLocation: "",
    requireRegion: "",
    require: "",
    requireType: "",
  });

  const [relatedRegions, setRelatedRegions] = useState([]);
  const [Typesy, setTypes] = useState([]);

  // تحديث فورم الإضافة
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "rquireLocation") {
      const selectedRegion = locations?.data?.data?.find(
        (item) => item.name === value
      );
      setRelatedRegions(selectedRegion?.relatedRegions || []);
    }

    if (name === "require") {
      const selectedType = data?.data?.data?.find(
        (item) => item.name === value
      );
      setTypes(selectedType?.relatedRegions || []);
    }
  };

  // إضافة الطلب
  const handleAddRequest = () => {
    if (
      !formData.rquireLocation ||
      !formData.requireRegion ||
      !formData.require ||
      !formData.requireType
    ) {
      alert("يرجى ملء جميع الحقول قبل الإضافة");
      return;
    }
    setClientRequiremnts((prev) => [...prev, formData]);
    setFormData({
      rquireLocation: "",
      requireRegion: "",
      require: "",
      requireType: "",
    });
    setRelatedRegions([]);
    setTypes([]);
  };

  // حذف الطلب
  const handleDelete = (index) => {
    new Promise((resolve , reject) => {
       const confirmed = window.confirm("هل أنت متأكد أنك تريد الحذف؟");
       if(!confirmed) return toast.error("تم الغاء الحذف")
            setClientRequiremnts((prev) => prev.filter((_, i) => i !== index));
 return   toast.success("تم الحذف بنجاح")
    })

  };

  return (
    <div className="w-full space-y-8">
      {/* ===== فورم إضافة الطلب ===== */}
      <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
        <h3 className="text-xl font-semibold mb-4 text-main">
          إضافة طلب جديد
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* موقع العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">موقع العقار*</label>
            <select
              name="rquireLocation"
              value={formData.rquireLocation}
              onChange={handleFormChange}
              className="border rounded-md p-2"
            >
              <option value="">قم بالإختيار</option>
              {locations?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* منطقة العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">منطقة العقار*</label>
            <select
              name="requireRegion"
              value={formData.requireRegion}
              onChange={handleFormChange}
              className="border rounded-md p-2"
            >
              <option value="">قم بالإختيار</option>
              {relatedRegions?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* نوع العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">نوع العقار*</label>
            <select
              name="require"
              value={formData.require}
              onChange={handleFormChange}
              className="border rounded-md p-2"
            >
              <option value="">قم بالإختيار</option>
              {data?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* وصف العقار */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">وصف العقار*</label>
            <select
              name="requireType"
              value={formData.requireType}
              onChange={handleFormChange}
              className="border rounded-md p-2"
            >
              <option value="">قم بالإختيار</option>
              {Typesy?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleAddRequest}
            className="bg-main text-white px-6 py-2 rounded-md hover:bg-main/90 transition-all"
          >
            + إضافة الطلب
          </button>
        </div>
      </div>

      {/* ===== عرض الطلبات ===== */}
      <div className="space-y-4 overflow-y-auto">
        {clientRequirements.length === 0 ? (
          <p className="text-center text-gray-500">لا توجد طلبات حالياً</p>
        ) : (
          clientRequirements.map((req, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm flex flex-col gap-2 relative"
            >
              <button
                onClick={() => handleDelete(index)}
                type="button"
                className="absolute top-2 left-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              <h4 className="text-lg font-semibold text-main mb-2">
                طلب رقم {index + 1}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <p>
                  <span className="font-medium">📍 موقع العقار:</span>{" "}
                  {req.rquireLocation}
                </p>
                <p>
                  <span className="font-medium">🏙 منطقة العقار:</span>{" "}
                  {req.requireRegion}
                </p>
                <p>
                  <span className="font-medium">🏠 نوع العقار:</span>{" "}
                  {req.require}
                </p>
                <p>
                  <span className="font-medium">📝 وصف العقار:</span>{" "}
                  {req.requireType}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientRequireSection;
