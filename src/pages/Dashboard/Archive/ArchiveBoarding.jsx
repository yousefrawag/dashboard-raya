
import React from "react"
import { useNavigate } from "react-router-dom"
import { FaUsers, FaTasks, FaFolder, FaProjectDiagram } from "react-icons/fa"

const archives = [
  {
    title: "أرشيف العملاء",
    icon: <FaUsers className="w-10 h-10 text-indigo-600" />,
    description: "كل العملاء المؤرشفين في النظام بما فيهم عملاء المسوقين",
    link: "/archive/customers",
  },
  {
    title: "أرشيف المشاريع",
    icon: <FaProjectDiagram className="w-10 h-10 text-green-600" />,
    description: "جميع المشاريع السابقة والملغاة",
    link: "/archive/projects",
  },
  {
    title: "أرشيف المهام الخاصة",
    icon: <FaTasks className="w-10 h-10 text-orange-600" />,
    description: "مهام منتهية أو مؤرشفة",
    link: "/archive/prievt-tasks",
  },
  {
    title: "أرشيف المهام",
    icon: <FaFolder className="w-10 h-10 text-blue-600" />,
  
    link: "/archive/missions",
  },
    {
    title: "أرشيف الموظفين",
    icon: <FaFolder className="w-10 h-10 text-blue-600" />,
  
    link: "/archive/users",
  },
      {
    title: "أرشيف نوع العقار",
    icon: <FaFolder className="w-10 h-10 text-blue-600" />,
  
    link: "/archive/projectType",
  },
        {
    title: "أرشيف المناطق",
    icon: <FaFolder className="w-10 h-10 text-blue-600" />,
  
    link: "/archive/locations",
  },
]

const ArchiveBoarding = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          لوحة الأرشيف
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {archives.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              className="cursor-pointer bg-white shadow-sm rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ArchiveBoarding
