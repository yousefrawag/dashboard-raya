import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useQuerygetiteams from "../../../services/Querygetiteams";
import CustomeTabel from '../../../components/common/CustomeTabel';
import toast from 'react-hot-toast';
import useQueryupdate from '../../../services/useQueryupdate';
import Loader from '../../../components/common/Loader';

// دالة حساب نسبة اكتمال الملف بناءً على الحقول الموجودة في السكيما الجديدة
const calculateProgress = (row) => {
  const fields = [
    row?.basicInfo?.name,
    row?.basicInfo?.phone,
    row?.basicInfo?.department,
    row?.basicInfo?.platforms?.length > 0,

    row?.generalIdeas?.hasIdea,
    row?.generalIdeas?.ideaDetails,

    row?.ideaAnalysis?.goal,

    row?.currentEvaluation?.overallRating,

    row?.marketingSection?.hasMarketingIdea,
    row?.marketingSection?.marketingIdeaDetails,

    row?.marketingEvaluation?.rating,

    row?.contentPlatforms?.mainPlatform,
  ];

  const completed = fields.filter(Boolean).length;

  return Math.round((completed / fields.length) * 100);
};

const GetAllimprovmentAplications = () => {
    const [copied, setCopied] = useState(false);
    const surveyUrl = "https://raya-ideaspark.netlify.app/";

    const { data, isLoading, refetch } = useQuerygetiteams("improve", "improve");
    const { updateiteam } = useQueryupdate("improve", "improve");

    // دالة نسخ الرابط المباشر
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(surveyUrl);
            setCopied(true);
            toast.success("تم نسخ رابط استبيان الأفكار بنجاح!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("فشل في نسخ الرابط: ", err);
            toast.error("عذراً، فشل نسخ الرابط تلقائياً");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const updateData = { applicationStatus: newStatus };
        try {
            updateiteam({ id, data: updateData }, {
                onSuccess: () => {
                    toast.success(`تم تغيير حالة الطلب إلى ${newStatus}`);
                    refetch();
                }
            });
        } catch (error) {
            console.error("خطأ في تحديث الحالة", error);
        }
    };

const columns = [
  {
    name: "المتقدم",
    selector: (row) => row?.basicInfo?.name,
    sortable: true,
    grow: 2,
    cell: (row) => (
      <div className="flex flex-col py-2">
        <Link
          to={`/raya-improve/${row._id}`}
          className="font-bold text-blue-600 hover:text-blue-800 transition-colors text-base"
        >
          {row?.basicInfo?.name}
        </Link>
        <span className="text-xs text-gray-500">
          {row?.basicInfo?.phone}
        </span>
      </div>
    ),
  },

  {
    name: "اكتمال الاستبيان",
    width: "160px",
    cell: (row) => {
      const percentage = calculateProgress(row);
      return (
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-medium text-gray-700">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                percentage > 80
                  ? "bg-green-500"
                  : percentage > 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      );
    },
  },

  {
    name: "القسم",
    selector: (row) => row?.basicInfo?.department,
    sortable: true,
    cell: (row) => (
      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
        {row?.basicInfo?.department || "غير محدد"}
      </span>
    ),
  },

  {
    name: "المنصات",
    hide: "md",
    cell: (row) => (
      <div className="flex flex-wrap gap-1">
        {row?.basicInfo?.platforms?.length > 0 ? (
          row.basicInfo.platforms.map((p, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 bg-gray-100 rounded-full"
            >
              {p}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">لا يوجد</span>
        )}
      </div>
    ),
  },

  {
    name: "تقييم العمل",
    selector: (row) => row?.currentEvaluation?.overallRating,
    sortable: true,
    cell: (row) => (
      <span className="text-xs font-medium">
        {row?.currentEvaluation?.overallRating || "غير محدد"}
      </span>
    ),
  },

  {
    name: "الحالة",
    width: "170px",
    cell: (row) => (
      <select
        value={row.applicationStatus}
        onChange={(e) =>
          handleStatusChange(row._id, e.target.value)
        }
        className={`text-xs font-medium rounded-full block w-full p-2 border-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          row.applicationStatus === "جديد"
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : row.applicationStatus === "قيد المراجعة"
            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
            : row.applicationStatus === "قيد التحليل"
            ? "border-purple-200 bg-purple-50 text-purple-700"
            : row.applicationStatus === "يحتاج متابعة"
            ? "border-orange-200 bg-orange-50 text-orange-700"
            : row.applicationStatus === "تم التواصل"
            ? "border-green-200 bg-green-50 text-green-700"
            : row.applicationStatus === "مقبول"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : row.applicationStatus === "مؤجل"
            ? "border-gray-300 bg-gray-100 text-gray-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        <option value="جديد">جديد</option>
        <option value="قيد التحليل">قيد التحليل</option>
        <option value="مقبول">مقبول</option>
        <option value="مؤجل">مؤجل</option>
        <option value="مرفوض">مرفوض</option>
      </select>
    ),
  },

  {
    name: "تاريخ التقديم",
    selector: (row) => row.createdAt,
    sortable: true,
    width: "120px",
    cell: (row) => (
      <div className="flex flex-col text-[11px] text-gray-500">
        <span>
          {format(new Date(row.createdAt), "dd MMM yyyy")}
        </span>
        <span>
          {format(new Date(row.createdAt), "hh:mm a")}
        </span>
      </div>
    ),
  },
];

if(isLoading) {
  return <Loader />
}
    return (
        <div className="p-2 pt-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">إدارة طلبات الاستبيان</h1>
                        <p className="text-gray-500 text-sm mt-1">عرض وتحليل طلبات الموظفين فى تطوير الافكار</p>
                    </div>
                    
                    {/* أزرار الهيدر والإحصائيات */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* إجمالي الطلبات */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 h-[46px]">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                                إجمالي الطلبات: {data?.data?.data?.length || 0}
                            </span>
                        </div>

                        {/* زر فتح استبيان الأفكار */}
                        <a 
                            href={surveyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 text-xs bg-white hover:bg-gray-50 text-gray-700 font-bold px-3.5 rounded-xl border border-gray-200 shadow-sm transition-colors cursor-pointer h-[46px]"
                        >
                            <span>فتح الاستبيان</span>
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        {/* زر نسخ رابط الأفكار */}
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 rounded-xl border shadow-sm transition-all cursor-pointer h-[46px] ${
                                copied 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <span>تم النسخ!</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </>
                            ) : (
                                <>
                                    <span>نسخ الرابط</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <CustomeTabel 
                        data={data?.data?.data} 
                        columns={columns} 
                        loading={isLoading} 
                        noDataComponent={
                            <div className="p-20 text-center">
                                <div className="text-5xl mb-4">📂</div>
                                <h3 className="text-gray-400 font-medium">لا توجد طلبات استبيان حالياً</h3>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default GetAllimprovmentAplications;