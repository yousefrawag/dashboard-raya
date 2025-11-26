import React, { useState } from "react";
import Breadcrumb from "../../../components/common/Breadcrumbs/Breadcrumb";
import { Link } from "react-router-dom";

const WhatsAppFilterCampaign = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [message, setMessage] = useState("");

  const filters = [
    { id: "less-follow", label: "عملاء أقل متابعة" },
    { id: "most-follow", label: "عملاء أكثر متابعة" },
    { id: "low-payment", label: "عملاء أقل دفعة أولى" },
    { id: "high-payment", label: "عملاء أعلى دفعة أولى" },
    { id: "by-project", label: "عملاء مهتمين بمشروع معين" },
  ];

  const projects = [
    "مشروع الرياض الجديد",
    "كمبوند الحياة",
    "أبراج النيل",
    "قرية الساحل الأزرق",
  ];

  const handleSend = () => {
    if (!selectedFilter) return alert("من فضلك اختر نوع الفلترة");
    if (selectedFilter === "by-project" && !selectedProject)
      return alert("من فضلك اختر المشروع");
    if (!message.trim()) return alert("من فضلك اكتب رسالة الحملة");

    // هنا هتربط الـ API بتاع إرسال الرسائل
    console.log({
      selectedFilter,
      selectedProject,
      message,
    });
    alert("✅ تم إرسال الحملة بنجاح!");
  };

  return (
    <div>
<div className="flex w-full items-center justify-between mb-6">
  <Breadcrumb pageName="واتساب / إرسال حملة عن طريق الفلترة" />

  <Link
    to="/whatsap-boarding"
    className="text-sm md:text-base font-medium text-white bg-[#25D366] hover:bg-[#1EBE5D] transition-colors px-4 py-2 rounded-xl shadow-md"
  >
    عودة
  </Link>
</div>

    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
   
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        إرسال حملة تسويقية عبر الفلاتر الذكية
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`border-2 rounded-xl p-6 text-lg font-semibold transition-all duration-300 
              ${
                selectedFilter === filter.id
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-white border-gray-200 hover:border-green-400 hover:bg-gray-50"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {selectedFilter === "by-project" && (
        <div className="mt-6 w-full max-w-md">
          <label className="block mb-2 font-medium text-gray-700">
            اختر المشروع
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">اختر مشروعًا</option>
            {projects.map((proj, index) => (
              <option key={index} value={proj}>
                {proj}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 w-full max-w-2xl">
        <label className="block mb-2 font-medium text-gray-700">
          رسالة الحملة
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالة الحملة هنا..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
        />
      </div>

      <button
        onClick={handleSend}
        className="mt-8 bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition"
      >
        🚀 إرسال الحملة الآن
      </button>
    </div>
    </div>
  );
};

export default WhatsAppFilterCampaign;
