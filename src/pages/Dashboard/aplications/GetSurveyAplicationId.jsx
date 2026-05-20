import React from 'react';
import QuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const GetSurveyAplicationId = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = QuerygetSpacficIteam("survey", "survey", id);
    const currentItem = data?.data;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!currentItem) {
        return <div className="text-center py-20 text-gray-500 font-bold">لم يتم العثور على بيانات هذا الطلب.</div>;
    }

    // مكون فرعي لعرض كل قسم بشكل منظم
    const InfoSection = ({ title, icon, children }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4 border-b pb-3 border-gray-50">
                <span className="text-xl">{icon}</span>
                <h3 className="text-lg font-black text-gray-800">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );

    // مكون فرعي لعرض الحقل والقيمة
    const DataField = ({ label, value, fullWidth = false }) => (
        <div className={`${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
            <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wider">{label}</p>
            <div className="text-gray-700 font-medium">
                {Array.isArray(value) ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                        {value.map((item, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs border border-blue-100">
                                {item}
                            </span>
                        ))}
                    </div>
                ) : (
                    value || <span className="text-gray-300 italic">لا يوجد</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen" dir="rtl">
            <div className="max-w-5xl mx-auto">
                
                {/* Header / Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <span>⬅️</span>
                        <span className="font-bold">الرجوع للطلبات</span>
                    </button>
                    <div className="text-left">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
                            currentItem.applicationStatus === 'جديد' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}>
                            {currentItem.applicationStatus}
                        </span>
                    </div>
                </div>

                {/* Main Identity Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8 shadow-lg shadow-blue-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black mb-2">{currentItem.name}</h1>
                            <p className="opacity-90 flex items-center gap-2">
                                📍 {currentItem.country}, {currentItem.city}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                            <p className="text-xs opacity-70 mb-1 font-bold">تاريخ التقديم</p>
                            <p className="font-mono">{format(new Date(currentItem.createdAt), "dd/MM/yyyy - hh:mm a")}</p>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                
                <InfoSection title="البيانات الشخصية والأساسية" icon="🧾">
                    <DataField label="رقم الهاتف" value={currentItem.phone} />
                    <DataField label="العمر" value={`${currentItem.age} سنة`} />
                    <DataField label="ساعات العمل المتاحة" value={`${currentItem.workHours} ساعة`} />
                    <DataField label="يعمل حالياً؟" value={currentItem.currentlyWorking} />
                    <DataField label="خبرة في التسويق؟" value={currentItem.marketingExperience} />
                    <DataField label="التخصص الأساسي" value={currentItem.mainSpecialization} />
                </InfoSection>

                <InfoSection title="الخبرة العملية" icon="💼">
                    <DataField label="سنوات الخبرة" value={currentItem.experienceYears} />
                    <DataField label="مشاريع سابقة؟" value={currentItem.previousProjects} />
                    <DataField label="نتائج محققة؟" value={currentItem.achievedResults} />
                    <DataField label="نوع المشاريع" value={currentItem.projectTypes} fullWidth />
                </InfoSection>

                <InfoSection title="القدرات التقنية والمنصات" icon="🌐">
                    <DataField label="المنصات" value={currentItem.platforms} />
                    <DataField label="أقوى منصة" value={currentItem.strongestPlatform} />
                    <DataField label="نوع النتائج" value={currentItem.resultTypes} />
                    <DataField label="المهارات" value={currentItem.bestSkills} />
                    <DataField label="نوع المحتوى" value={currentItem.contentType} />
                    <DataField label="المستوى" value={currentItem.skillLevel} />
                </InfoSection>

                <InfoSection title="الأدوات والتحليل" icon="🧠">
                    <DataField label="الأدوات المستخدمة" value={currentItem.tools} />
                    <DataField label="خبرة تحليل بيانات؟" value={currentItem.analyticsExperience} />
                    <DataField label="المؤشرات المتابعة" value={currentItem.trackingMetrics} />
                    <DataField label="مصادر البيانات" value={currentItem.dataSources} />
                    <DataField label="إجراءات التحليل" value={currentItem.analysisAction} />
                    <DataField label="اختيار الجمهور" value={currentItem.audienceSelection} />
                </InfoSection>

                <InfoSection title="الإجابات التفصيلية" icon="✍️">
                    <DataField label="لماذا هذا التخصص؟" value={currentItem.whySpecialization} fullWidth />
                    <DataField label="طريقة العمل" value={currentItem.howYouWork} fullWidth />
                    <DataField label="أمثلة على نتائج" value={currentItem.resultExample || currentItem.personalResults} fullWidth />
                    <DataField label="الهدف من الانضمام" value={currentItem.goal} fullWidth />
                </InfoSection>

                <InfoSection title="أسلوب العمل والالتزام" icon="⚙️">
                    <DataField label="تفضيل العمل" value={currentItem.workPreference === 'individual' ? 'فردي' : 'فريق'} />
                    <DataField label="الالتزام بالمواعيد" value={currentItem.punctuality} />
                    <DataField label="تحمل الضغط" value={currentItem.pressureTolerance} />
                    <DataField label="الاستعداد للتعلم" value={currentItem.willingToLearn} />
                </InfoSection>

            </div>
        </div>
    );
};

export default GetSurveyAplicationId;