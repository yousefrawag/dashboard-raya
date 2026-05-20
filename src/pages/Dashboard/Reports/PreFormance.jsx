import React, { useState } from "react";
import useQuerygetiteams from "../../../services/Querygetiteams";
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown, 
  HiOutlineUsers, 
  HiOutlinePhoneOutgoing,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineArrowNarrowLeft,
  HiOutlineUserCircle,
  HiOutlinePresentationChartBar,
  HiOutlineX,
  HiOutlineClipboardList,
  HiOutlineShieldCheck
} from "react-icons/hi";
import { MdOutlineAssignmentInd, MdOutlineAssignment } from "react-icons/md";
import { FaCrown } from "react-icons/fa";

const PreFormance = () => {
  const [params, setParams] = useState({ dateFilter: "monthly" });
  const [selectedEmpDetails, setSelectedEmpDetails] = useState(null);

  const { data, isLoading } = useQuerygetiteams(
    "customers/employee-customers-preforance",
    "customers/employee-customers-preforance",
    params
  );

  const employees = data?.data?.data || [];

  const getTrendData = (current = 0, previous = 0) => {
    const diff = current - previous;
    if (!previous) {
      return { percent: current > 0 ? 100 : 0, diff, status: current > 0 ? "up" : "stable" };
    }
    const percent = Math.round((diff / previous) * 100);
    return { percent, diff, status: percent > 0 ? "up" : percent < 0 ? "down" : "stable" };
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-16 w-16 bg-blue-600 rounded-2xl mb-4 animate-bounce"></div>
        <p className="text-slate-500 font-black">جاري جلب بيانات الأداء والمقارنات...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans" dir="rtl">
      
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <HiOutlinePresentationChartBar className="text-blue-600" size={35} />
          تحليل إنتاجية الموظفين
        </h1>
        
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1">
          {["daily", "weekly", "monthly"].map((f) => (
            <button
              key={f}
              onClick={() => setParams({ ...params, dateFilter: f })}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                params.dateFilter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {f === "daily" ? "اليوم" : f === "weekly" ? "الأسبوع" : "الشهر"}
            </button>
          ))}
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {employees.map((emp, index) => {
          const totalMissionsCurrent = (emp.missions?.assigned?.current || 0) + (emp.missions?.created?.current || 0);
          const totalMissionsPrevious = (emp.missions?.assigned?.previous || 0) + (emp.missions?.created?.previous || 0);
          
          return (
            <div key={emp._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
              
              {/* Profile Header */}
              <div className="p-8 flex items-center justify-between bg-gradient-to-l from-slate-50 to-transparent">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-white shadow-inner flex items-center justify-center overflow-hidden border-4 border-white ring-1 ring-slate-100">
                      {emp.imageURL ? <img src={emp.imageURL} className="w-full h-full object-cover" /> : <HiOutlineUserCircle size={50} className="text-slate-300"/>}
                    </div>
                    {index === 0 && <div className="absolute -top-3 -right-3 bg-amber-500 text-white p-2 rounded-xl shadow-lg shadow-amber-200"><FaCrown size={14}/></div>}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{emp.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase">ID: {emp._id}</span>
                      <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-md">Score: {Math.round(emp.performanceScore || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 border-y border-slate-50">
                  <StatCard 
                    icon={<HiOutlineUsers className="text-orange-500" />} 
                    label="إضافة عملاء" 
                    current={emp.clients?.current} 
                    previous={emp.clients?.previous} 
                    getTrend={getTrendData}
                  />
                  <StatCard 
                    icon={<HiOutlinePhoneOutgoing className="text-cyan-500" />} 
                    label="الاتصالات" 
                    current={emp.followups?.totalCalls?.current} 
                    previous={emp.followups?.totalCalls?.previous} 
                    getTrend={getTrendData}
                  />
                    <StatCard 
                    icon={<HiOutlinePhoneOutgoing className="text-cyan-500" />} 
                    label="عملاء  الاتصالات والمتابعه" 
                    current={emp.followups?.uniqueClients?.current} 
                    previous={emp.followups?.uniqueClients?.previous} 
                    getTrend={getTrendData}
                  />
                  <StatCard 
                    icon={<HiOutlineCalendar className="text-indigo-500" />} 
                    label="الاجتماعات" 
                    current={emp.followups?.meetings?.current} 
                    previous={emp.followups?.meetings?.previous} 
                    getTrend={getTrendData}
                  />
                  <StatCard 
                    icon={<HiOutlinePresentationChartBar className="text-purple-500" />} 
                    label="التقارير" 
                    current={emp.reports?.current} 
                    previous={emp.reports?.previous} 
                    getTrend={getTrendData}
                  />
                       <StatCard 
                    icon={<HiOutlinePresentationChartBar className="text-purple-500" />} 
                    label="بند متابعه" 
                    current={emp.followups?.requestedFollowups?.current} 
                    previous={emp.followups?.requestedFollowups?.previous} 
                    getTrend={getTrendData}
                  />
                  <StatCard 
                    icon={<HiOutlineClipboardList className="text-emerald-500" />} 
                    label="المهام" 
                    current={totalMissionsCurrent} 
                    previous={totalMissionsPrevious} 
                    getTrend={getTrendData}
                  />
              </div>

              {/* Action Footer */}
              {/* <div className="px-8 py-5 mt-auto bg-white flex justify-end items-center">
                <button 
                  onClick={() => setSelectedEmpDetails(emp)}
                  className="group flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all active:scale-95"
                >
                  عرض التفاصيل الكاملة <HiOutlineArrowNarrowLeft className="group-hover:-translate-x-1 transition-transform" size={18}/>
                </button>
              </div> */}
            </div>
          );
        })}
      </div>

      {/* Full Details Drawer */}
      {selectedEmpDetails && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedEmpDetails(null)}></div>
            <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl overflow-y-auto p-8 animate-in slide-in-from-left duration-300">
                
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200">
                            {selectedEmpDetails.fullName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{selectedEmpDetails.fullName}</h2>
                            <p className="text-slate-400 text-xs font-bold">تقرير تفصيلي لفترة: {params.dateFilter}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedEmpDetails(null)} className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><HiOutlineX size={22}/></button>
                </div>

                {/* Missions Detail */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <DetailBox 
                      icon={<MdOutlineAssignmentInd/>} 
                      label="مهام مسندة إليه" 
                      value={selectedEmpDetails.missions?.assigned?.current} 
                      diff={selectedEmpDetails.missions?.assigned?.current - selectedEmpDetails.missions?.assigned?.previous}
                      color="blue"
                    />
                    <DetailBox 
                      icon={<MdOutlineAssignment/>} 
                      label="مهام قام بإنشائها" 
                      value={selectedEmpDetails.missions?.created?.current} 
                      diff={selectedEmpDetails.missions?.created?.current - selectedEmpDetails.missions?.created?.previous}
                      color="indigo"
                    />
                </div>

                {/* Reports Breakdown */}
                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-8">
                    <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
                        <HiOutlineClipboardCheck className="text-purple-600"/> توزيع أنواع التقارير
                    </h3>
                    <div className="space-y-3">
                        {selectedEmpDetails.reports?.types?.length > 0 ? selectedEmpDetails.reports.types.map((type, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                                <span className="text-xs font-bold text-slate-600">{type.label}</span>
                                <span className="bg-purple-50 text-purple-700 px-4 py-1 rounded-xl font-black text-sm">{type.count}</span>
                            </div>
                        )) : <p className="text-center text-xs text-slate-400 py-4 font-bold">لم يتم تسجيل تقارير بهذا التصنيف</p>}
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-4">ملخص الإنتاجية العام</p>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-3xl font-black">{selectedEmpDetails.followups?.current + selectedEmpDetails.meetings?.current}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1">إجمالي التفاعلات مع العملاء</div>
                        </div>
                        <div className="border-r border-slate-700 pr-6">
                            <div className="text-3xl font-black text-green-400">
                                {Math.round((selectedEmpDetails.meetings?.current / (selectedEmpDetails.followups?.current || 1)) * 100)}%
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1">نسبة تحويل الاتصال لاجتماع</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      )}
    </div>
  );
};

// --- Sub Components ---
const StatCard = ({ icon, label, current, previous, getTrend }) => {
  const trend = getTrend(current, previous);
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center border-l border-slate-50 last:border-l-0 group hover:bg-slate-50/50 transition-all">
      <div className="mb-4 p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-[10px] text-slate-400 font-black mb-1 uppercase tracking-tighter">{label}</p>
      <p className="text-2xl font-black text-slate-900 mb-2">{current}</p>
      <div className={`flex flex-col items-center gap-1`}>
        <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${
            trend.status === "up" ? "text-green-600 bg-green-50" : 
            trend.status === "down" ? "text-red-600 bg-red-50" : "text-slate-400 bg-slate-100"
        }`}>
            {trend.status === "up" ? <HiOutlineTrendingUp className="ml-1"/> : trend.status === "down" ? <HiOutlineTrendingDown className="ml-1"/> : null}
            %{Math.abs(trend.percent)}
        </div>
        <p className="text-[9px] font-bold text-slate-400">
            {trend.diff > 0 ? `زاد بمقدار ${trend.diff}` : trend.diff < 0 ? `نقص بمقدار ${Math.abs(trend.diff)}` : "مستقر"}
        </p>
      </div>
    </div>
  );
};

const DetailBox = ({ icon, label, value, diff, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center text-xl shadow-inner`}>
          {icon}
      </div>
      <div>
          <div className="text-xl font-black text-slate-900">{value || 0}</div>
          <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
              <span className={`text-[9px] font-black ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({diff >= 0 ? '+' : ''}{diff})
              </span>
          </div>
      </div>
  </div>
);

export default PreFormance;