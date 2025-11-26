import React from "react";
import useQuerygetiteams from "../../../services/Querygetiteams";
import Loader from "../../../components/common/Loader";
import { Link } from "react-router-dom";

const CompaiginPage = () => {
  const { isLoading, data } = useQuerygetiteams("compain", "compain");

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 min-h-screen ">
      <div className="flex flex-col sm:flex-row justify-between  sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📢 الحملات التسويقية</h1>
          <p className="text-gray-500">إدارة وعرض جميع الحملات التسويقية</p>
        </div>
        <div className="flex gap-4">
     <Link to="/whatsap-ExcelCampaign" className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          إنشاء حملة جديدة
        </Link>
          <Link to="/whatsap-boarding" className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          عوده
        </Link>
        </div>
   
        
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data?.data?.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            {/* صورة الحملة */}
            {campaign.imageUrl ? (
              <div className="h-48 overflow-hidden">
                <img
                  src={campaign.imageUrl}
                  alt="Campaign"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            )}

            {/* محتوى البطاقة */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{campaign.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaign.status === "sent" 
                    ? "bg-green-100 text-green-800" 
                    : campaign.status === "sending" 
                    ? "bg-blue-100 text-blue-800" 
                    : campaign.status === "failed" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {campaign.status === "draft" ? "مسودة" : 
                   campaign.status === "sending" ? "جار الإرسال" : 
                   campaign.status === "sent" ? "تم الإرسال" : "فشل"}
                </span>
              </div>

              {/* نوع العملاء */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">نوع العملاء</p>
                  <p className="text-sm font-medium text-gray-700">{campaign.customerType}</p>
                </div>
              </div>

              {/* تقدم الإرسال */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>الإرسال</span>
                  <span>{campaign.sentCount} / {campaign.totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      campaign.status === "sent" 
                        ? "bg-green-500" 
                        : campaign.status === "sending" 
                        ? "bg-blue-500" 
                        : campaign.status === "failed" 
                        ? "bg-red-500" 
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${(campaign.sentCount / campaign.totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* نص الرسالة */}
              {campaign.message && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-2 bg-gray-50 p-3 rounded-lg">
                    {campaign.message}
                  </p>
                </div>
              )}

              {/* رابط الحملة */}
              {campaign.link && (
                <div className="mb-4">
                  <a 
                    href={campaign.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    رابط الحملة
                  </a>
                </div>
              )}

              {/* تاريخ الإنشاء والأزرار */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {new Date(campaign.createdAt).toLocaleDateString("ar-EG", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <div>
                    مضافه من قبل
                    <span>
                        {
                            campaign?.user?.fullName
                        }
                    </span>

                </div>
                <Link to={`/whatsap-allcompaigins/${campaign?._id}`} className="px-4 py-2 text-sm font-medium bg-white text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* حالة عدم وجود حملات */}
      {(!data?.data?.data || data.data.data.length === 0) && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">لا توجد حملات</h3>
          <p className="text-gray-500 mb-6">لم تقم بإنشاء أي حملات تسويقية بعد</p>
          <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            إنشاء أول حملة
          </button>
        </div>
      )}
    </div>
  );
};

export default CompaiginPage;