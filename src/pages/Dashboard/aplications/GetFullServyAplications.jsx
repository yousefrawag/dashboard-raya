import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useQuerygetiteams from "../../../services/Querygetiteams";
import CustomeTabel from '../../../components/common/CustomeTabel';
import toast from 'react-hot-toast';
import useQueryupdate from '../../../services/useQueryupdate';

// دالة حساب نسبة اكتمال الملف بناءً على الحقول الموجودة في السكيما الجديدة
const calculateProgress = (row) => {
    const fields = ['name', 'phone', 'country', 'city', 'age', 'mainSpecialization', 'platforms', 'goal'];
    let completed = 0;
    fields.forEach(field => {
        if (row[field] && (Array.isArray(row[field]) ? row[field].length > 0 : true)) {
            completed++;
        }
    });
    return Math.round((completed / fields.length) * 100);
};

const GetFullServyAplications = () => {
    const { data, isLoading, refetch } = useQuerygetiteams("survey", "survey");
    const { updateiteam } = useQueryupdate("survey", "survey");

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
            selector: (row) => row?.name,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <Link 
                        to={`/raya-Survey/${row._id}`}
                        className="font-bold text-blue-600 hover:text-blue-800 transition-colors text-base"
                    >
                        {row?.name}
                    </Link>
                    <span className="text-xs text-gray-500">{row?.phone}</span>
                </div>
            )
        },
        {
            name: "اكتمال الملف",
            width: "160px",
            cell: (row) => {
                const percentage = calculateProgress(row);
                return (
                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className="text-[10px] font-medium text-gray-700">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    percentage > 80 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            }
        },
        {
            name: "التخصص",
            selector: (row) => row?.mainSpecialization,
            sortable: true,
            hide: 'sm',
            cell: (row) => (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                    {row?.mainSpecialization || "غير محدد"}
                </span>
            )
        },
        {
            name: "الدولة/المدينة",
            selector: (row) => `${row?.country} - ${row?.city}`,
            sortable: true,
            hide: 'md',
            cell: (row) => (
                <div className="text-sm text-gray-600">
                    {row?.country} <span className="text-gray-300 mx-1">|</span> {row?.city}
                </div>
            )
        },
        {
            name: "الحالة",
            width: "150px",
            cell: (row) => (
                <select 
                    value={row.applicationStatus} 
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
                    className={`text-xs font-medium rounded-full block w-full p-2 border-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        row.applicationStatus === 'جديد' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                        row.applicationStatus === 'قيد المراجعة' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                        row.applicationStatus === 'تم التواصل' ? 'border-green-200 bg-green-50 text-green-700' :
                        'border-red-200 bg-red-50 text-red-700'
                    }`}
                >
                    <option value="جديد">جديد</option>
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="تم التواصل">تم التواصل</option>
                    <option value="مرفوض">مرفوض</option>
                </select>
            )
        },
        {
            name: "تاريخ التقديم",
            selector: (row) => row.createdAt,
            sortable: true,
            width: "120px",
            cell: (row) => (
                <div className="flex flex-col text-[11px] text-gray-500 uppercase tracking-tighter">
                    <span>{format(new Date(row.createdAt), "dd MMM yyyy")}</span>
                    <span>{format(new Date(row.createdAt), "hh:mm a")}</span>
                </div>
            )
        }
    ];

    return (
        <div className="p-2 pt-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">إدارة طلبات الاستبيان</h1>
                        <p className="text-gray-500 text-sm mt-1">عرض وتحليل طلبات المتقدمين لطلبات التوظيف/التدريب</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                            <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-gray-700">إجمالي الطلبات: {data?.data?.data?.length || 0}</span>
                        </div>
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

export default GetFullServyAplications;