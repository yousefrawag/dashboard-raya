import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import useQuerygetiteams from "../../../services/Querygetiteams";
import CustomeTabel from '../../../components/common/CustomeTabel';
import axios from 'axios';
import authFetch from '../../../utils/axiosAuthfetch';
import toast from 'react-hot-toast';
import useQueryupdate from '../../../services/useQueryupdate';
import sortBy from 'sort-by';

const JopAplication = () => {
    const [copied, setCopied] = useState(false);
    const surveyUrl = "https://raya-jops.netlify.app/";

    // تأكد أن الـ data هنا هي المصفوفة مباشرة، إذا كانت Object استخدم data.applicants مثلاً
    const { data, isLoading, refetch } = useQuerygetiteams("jop", "jop");
    const { updateiteam } = useQueryupdate("jop", "jop");

    // دالة نسخ الرابط
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(surveyUrl);
            setCopied(true);
            toast.success("تم نسخ رابط الاستبيان بنجاح!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("فشل في نسخ الرابط: ", err);
            toast.error("عذراً، فشل نسخ الرابط تلقائياً");
        }
    };

    // دالة حساب اكتمال الملف
    const calculateProgress = (row) => {
        let score = 0;
        const fields = [
            row?.personalInfo?.fullName,
            row?.experience?.technicalSkills?.length > 0,
            row?.experience?.hasRealEstateExp,
            row?.techAndAI?.ownsLaptop,
            row?.education?.lastDegree,
            row?.practicalEvaluation?.uniqueValue,
            row?.readiness?.acceptsTargets,
            row?.personalInfo?.email
        ];
        fields.forEach(field => field ? score++ : null);
        return Math.round((score / fields.length) * 100);
    };

    const handleStatusChange = async (id, newStatus) => {
        console.log("id" , id , " stauts", newStatus);
        
        const data = {
            applicationStatus: newStatus
        }
        try {
            updateiteam({id , data  } , {
                onSuccess:()=>{
                    toast.success(`تم تغير حاله الطلب الى ${newStatus}`)
                }
            })
        } catch (error) {
            console.error("خطأ في تحديث الحالة", error);
        }
    };

    const columns = [
        {
            name: "الاسم",
            selector: (row) => row?.personalInfo?.fullName,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <Link 
                    to={`/raya-jops/${row._id}`}
                    className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {row?.personalInfo?.fullName}
                </Link>
            )
        },
        {
            name: "اكتمال الملف",
            width: "180px",
            cell: (row) => {
                const percentage = calculateProgress(row);
                return (
                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                    percentage > 70 ? 'bg-green-500' : percentage > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            }
        },
        {
            name: "الوظيفة",
            selector: (row) => row?.jobDetails?.appliedPosition,
            sortable: true,
            hide: 'sm',
        },
        {
            name: "الدولة",
            selector: (row) => row?.personalInfo?.country,
            sortable: true,
            hide: 'sm',
        },
        {
            name: "الحالة",
            width: "160px",
            cell: (row) => (
                <select 
                    value={row.applicationStatus} 
                    onChange={(e) => handleStatusChange(row._id, e.target.value)}
                    className={`text-sm rounded-lg block w-full p-1.5 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 ${
                        row.applicationStatus === 'جديد' ? 'bg-blue-50' : 'bg-gray-50'
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
            name: "التاريخ",
            selector: (row) => row.createdAt,
            sortable: true,
            width: "120px",
            cell: (row) => <span className="text-gray-600 text-sm">{format(new Date(row.createdAt), "dd/MM/yyyy")}</span>
        }
    ];

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="mt-10 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* الهيدر المعدل */}
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800">طلبات التوظيف - منصة الراية</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            إجمالي الطلبات: {data?.data?.data?.length || 0}
                        </span>
                    </div>

                    {/* أزرار التحكم بالاستبيان */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {/* زر فتح الاستبيان مباشر */}
                        <a 
                            href={surveyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                        >
                            <span>فتح الاستبيان</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>

                        {/* زر نسخ الرابط */}
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                copied 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white border-transparent'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <span>تم النسخ!</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </>
                            ) : (
                                <>
                                    <span>نسخ الرابط</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                <div className="p-4">
                    <CustomeTabel 
                        columns={columns} 
                        data={data?.data?.data || []} 
                    />
                </div>
            </div>
        </div>
    );
};

export default JopAplication;