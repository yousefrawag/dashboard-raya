import React from "react";
import { useParams } from "react-router-dom";
import useQuerygetSpacficIteam from "../../../services/QuerygetSpacficIteam";
import Loader from "../../../components/common/Loader";
import { Link } from "react-router-dom";
import CustomeTabel from "../../../components/common/CustomeTabel";
const GetcompainByid = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuerygetSpacficIteam("compain", "compain", id);

  if (isLoading) return <Loader />;

  const campaign = data?.data || {};
 const columns = [
      {
        name: "الاسم",
        selector: (row) => row?.name,
        cell: (row) => (
                  <span  >{row.name}</span>
        )
      },
 
            {
        name: "الجوال",
        selector: (row) => row?.phoneNumber,
        cell: (row) => (
                  <span  >{row.phoneNumber}</span>
        )
      },
 

      
       
      ];
  return (
    <div className="p-6 space-y-8">
              <Link to="/whatsap-boarding" className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  عوده
                </Link>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "إجمالي العملاء", value: campaign.totalCount },
          { label: "تم الإرسال", value: campaign.sentCount },
          { label: "فشل الإرسال", value: campaign.failedCount },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-4 text-center"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stat.value ?? 0}
            </h3>
          </div>
        ))}
      </div>
      {/* 🟣 Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-24 h-24 rounded-xl object-cover shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {campaign.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-300">
              تم إنشاؤها بواسطة:{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {campaign.user?.name || "غير محدد"}
              </span>
            </p>
            <p className="text-sm text-gray-400">
              {new Date(campaign.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* الحالة */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            campaign.status === "sent"
              ? "bg-green-100 text-green-700"
              : campaign.status === "failed"
              ? "bg-red-100 text-red-700"
              : campaign.status === "sending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {campaign.status === "draft"
            ? "مسودة"
            : campaign.status === "sending"
            ? "جارى الإرسال"
            : campaign.status === "sent"
            ? "تم الإرسال"
            : "فشل"}
        </span>
      </div>

      {/* 🧾 تفاصيل الحملة */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
          تفاصيل الحملة
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">الرسالة:</span> {campaign.message}
        </p>
        {campaign.link && (
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">الرابط:</span>{" "}
            <a
              href={campaign.link}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {campaign.link}
            </a>
          </p>
        )}
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-medium">نوع العملاء:</span>{" "}
          {campaign.customerType || "غير محدد"}
        </p>
      </div>

      {/* 📊 إحصائيات */}
    

      {/* 👥 العملاء الذين تم الإرسال إليهم */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          العملاء الذين تم الإرسال إليهم
        </h2>
        {campaign.customers?.length ? (
        <CustomeTabel  data={campaign.customers} columns={columns}/>
        ) : (
          <p className="text-gray-500">لا يوجد عملاء تم الإرسال لهم بعد.</p>
        )}
      </div>

      {/* ❌ العملاء الذين فشل الإرسال إليهم */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          العملاء الذين فشل الإرسال إليهم
        </h2>
        {campaign.failedNumbers?.length ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-3">الاسم</th>
                <th className="py-2 px-3">رقم الجوال</th>
              </tr>
            </thead>
            <tbody>
              {campaign.failedNumbers.map((f, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="py-2 px-3">{f.name}</td>
                  <td className="py-2 px-3">{f.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">لا يوجد عملاء فشل الإرسال إليهم.</p>
        )}
      </div>
    </div>
  );
};

export default GetcompainByid;
