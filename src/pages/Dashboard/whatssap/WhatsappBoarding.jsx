import React from "react"
import { FaWhatsapp, FaRobot, FaPaperPlane } from "react-icons/fa"
import { MdOutlinePeople, MdOutlineTimer, MdOutlineTrendingUp } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const WhatsappBoarding = () => {
  const navigate = useNavigate()

  const stats = [
    {
      label: "عدد الرسائل المرسلة",
      value: "1,100",
      icon: <MdOutlinePeople className="w-12 h-12 text-white/30 absolute top-3 right-3" />,
      bg: "bg-gradient-to-r from-green-500 to-green-400",
    },
    {
      label: "متوسط الرد",
      value: "2.5 دقيقة",
      icon: <MdOutlineTimer className="w-12 h-12 text-white/30 absolute top-3 right-3" />,
      bg: "bg-gradient-to-r from-blue-500 to-blue-400",
    },
    {
      label: "نسبة التفاعل",
      value: "68%",
      icon: <MdOutlineTrendingUp className="w-12 h-12 text-white/30 absolute top-3 right-3" />,
      bg: "bg-gradient-to-r from-purple-500 to-purple-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* العنوان */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <FaWhatsapp className="text-green-500 w-10 h-10" />
          <h1 className="text-3xl font-bold text-gray-800">
            لوحة واتساب التسويقية
          </h1>
        </div>

        {/* قسم الإحصائيات */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-6 shadow-md text-white ${item.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              {item.icon}
              <p className="text-3xl font-bold mb-2">{item.value}</p>
              <p className="text-sm opacity-90">{item.label}</p>
            </div>
          ))}
        </div>

        {/* قسم الكروت (إرسال يدوي / ذكاء اصطناعي) */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* إرسال يدوي */}
          {/* <div
            onClick={() => navigate("/whatsap-FilterCampaign")}
            className="cursor-pointer bg-white shadow rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <FaPaperPlane className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              إرسال رسائل تسويقية مع فلتره مخصصة للعملاء
            </h2>
            <p className="text-gray-500 text-sm">
              أرسل حملات تسويقية مخصصة لعملائك عبر الواتساب بسهولة
            </p>
          </div> */}

          {/* إرسال بالذكاء الاصطناعي */}
          <div
            onClick={() => navigate("/whatsap-ExcelCampaign")}
            className="cursor-pointer bg-gradient-to-br from-green-50 to-white shadow rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <FaRobot className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              رسائل تسويقية  عن طريق ملف اكسيل
            </h2>
            <p className="text-gray-500 text-sm">
              دع النظام يقترح رسائل جذابة وذكية لتعزيز نجاح حملاتك التسويقية
            </p>
          </div>
             <div
            onClick={() => navigate("/whatsap-allcompaigins")}
            className="cursor-pointer bg-gradient-to-br from-green-50 to-white shadow rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <FaRobot className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
            جميع الحملات
            </h2>
            <p className="text-gray-500 text-sm">
             جميع الحملات التى تم العمل عليها من قبل الموظفين
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsappBoarding
