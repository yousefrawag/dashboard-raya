import React, { useEffect, useState } from 'react';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import useQueryupdate from '../../../services/useQueryupdate';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import * as XLSX from "xlsx";

const MissaionUpdateRequires = ({ id }) => {
    const { data, isLoading } = useQuerygetSpacficIteam("missions", "missions", id);
    const CurrentMission = data?.data;
    const Sections = CurrentMission?.requirements || [];

    // استخدام chatID من المهمة الحالية لتحميل الرسائل
    const { data: messages, isLoading: isMessagesLoading } = useQuerygetSpacficIteam(
        "messages",
        "messages",
        CurrentMission?.chatID
    );

    const currentMessages = messages?.data?.messages || messages?.messages || [];
    const { updateiteam } = useQueryupdate("missions", "missions");

    const [requirements, setRequirements] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        if (Sections) {
            setRequirements(Sections);
        }
    }, [Sections]);

    // دالة إيجاد الرسالة المرتبطة بالمتطلب
    const getRelatedMessage = (req) => {
        if (req?.messageID) {
            return currentMessages.find(
                (msg) => msg._id === req.messageID || msg.id === req.messageID
            );
        }
        if (req?.message) {
            return typeof req.message === 'object'
                ? req.message
                : { content: req.message };
        }
        return null;
    };

    // دالة لتحويل النصوص اللي فيها لينكات إلى عناصر قابلة للضغط
    const renderTextWithLinks = (text) => {
        if (!text) return null;

        // regex لكشف الروابط
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, i) => {
            if (/^https?:\/\//.test(part)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 break-all"
                        title={part}
                    >
                        {part}
                    </a>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    const handelCangereqstauts = (req) => {
        const updatedRequirements = requirements.map((requirement) =>
            requirement === req
                ? { ...requirement, complated: !requirement.complated }
                : requirement
        );

        setRequirements(updatedRequirements);

        updateiteam(
            { data: { requirements: updatedRequirements }, id },
            {
                onSuccess: () => {
                    toast.success("تم تحديث المهمة بنجاح ✅");
                },
                onError: (error) => {
                    toast.error(error.response?.data?.mesg || "حدث خطأ، حاول مرة أخرى ❌");
                },
            }
        );
    };

    const downloadExcel = async () => {
        setIsExporting(true);

        try {
            if (!CurrentMission) {
                toast.error("لا توجد بيانات للمهمة ❌");
                return;
            }

            // إنشاء مصنف Excel
            const workbook = XLSX.utils.book_new();

            // 1. ورقة المتطلبات
            const requirementsData = requirements.length > 0
                ? requirements.map((req, index) => ({
                    "#": index + 1,
                    "النوع": req.type || "غير محدد",
                    "تم الإنجاز": req.complated ? "✔️" : "❌",
                }))
                : [{ "#": 1, "النوع": "لا يوجد متطلبات", "تم الإنجاز": "" }];

            const requirementsSheet = XLSX.utils.json_to_sheet(requirementsData);
            XLSX.utils.book_append_sheet(workbook, requirementsSheet, "المتطلبات");

            // 2. ورقة الرسائل
            let messagesData = [{ "#": 1, "المرسل": "لا يوجد رسائل", "الرسالة": "", "التاريخ": "" }];

            if (currentMessages && currentMessages.length > 0) {
                messagesData = currentMessages.map((msg, index) => {
                    let senderName = "غير معروف";

                    if (msg.senderID && typeof msg.senderID === 'object') {
                        senderName = msg.senderID.fullName || msg.senderID.name || "غير معروف";
                    }

                    return {
                        "#": index + 1,
                        "المرسل": senderName,
                        "الرسالة": msg.content || "",
                        "التاريخ": msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString("ar-EG")
                            : "غير محدد",
                    };
                });
            }

            const messagesSheet = XLSX.utils.json_to_sheet(messagesData);
            XLSX.utils.book_append_sheet(workbook, messagesSheet, "الرسائل");

            // 3. ورقة الفريق
            const teamField = CurrentMission?.assignedTo || [];
            let teamData = [{ "#": 1, "الإسم": "لا يوجد فريق مكلف", "البريد": "", "الدور": "" }];

            if (teamField.length > 0) {
                teamData = teamField.map((member, index) => ({
                    "#": index + 1,
                    "الإسم": member.fullName || "غير معروف",
                    "البريد": member.email || "غير متوفر",
                    "الدور": member.job || "غير محدد",
                }));
            }

            const teamSheet = XLSX.utils.json_to_sheet(teamData);
            XLSX.utils.book_append_sheet(workbook, teamSheet, "الفريق");

            // 4. ورقة معلومات المهمة
            const missionInfoData = [
                { "المعلومة": "اسم المهمة", "القيمة": CurrentMission.description || "غير محدد" },
                { "المعلومة": "النوع", "القيمة": CurrentMission.missionType || "غير محدد" },
                { "المعلومة": "الحالة", "القيمة": CurrentMission.status || "غير محدد" },
                {
                    "المعلومة": "تاريخ الإنشاء",
                    "القيمة": CurrentMission.createdAt
                        ? new Date(CurrentMission.createdAt).toLocaleDateString("ar-EG")
                        : "غير محدد"
                },
                {
                    "المعلومة": "تاريخ الانتهاء",
                    "القيمة": CurrentMission.deadline
                        ? new Date(CurrentMission.deadline).toLocaleDateString("ar-EG")
                        : "غير محدد"
                },
                {
                    "المعلومة": "آخر تحديث",
                    "القيمة": CurrentMission.updatedAt
                        ? new Date(CurrentMission.updatedAt).toLocaleDateString("ar-EG")
                        : "غير محدد"
                },
            ];

            const missionInfoSheet = XLSX.utils.json_to_sheet(missionInfoData);
            XLSX.utils.book_append_sheet(workbook, missionInfoSheet, "معلومات المهمة");

            // تصدير الملف
            XLSX.writeFile(
                workbook,
                `mission_${CurrentMission.project?.projectName || CurrentMission.Privetproject?.projectName}_data.xlsx`
            );
            toast.success("تم تصدير البيانات بنجاح ✅");

        } catch (error) {
            console.error("خطأ في التصدير:", error);
            toast.error("فشل في تصدير الملف ❌");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className='mt-5 mb-5 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
            <div className='flex gap-5 items-center flex-col lg:flex-row'>
                <Link to="/missions-repoart" className='w-50 mb-4 p-2 text-center bg-main text-white rounded-md'>
                    عوده
                </Link>
                <button
                    onClick={downloadExcel}
                    disabled={isLoading || isMessagesLoading || isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {isExporting ? "جاري التصدير..." : "تصدير البيانات"}
                </button>
            </div>

            <h1 className='mt-10 text-xl font-bold text-gray-800 dark:text-white'>متطلبات المهمة</h1>

            {isLoading ? (
                <div className="mt-7 text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">جاري تحميل المتطلبات...</p>
                </div>
            ) : requirements.length === 0 ? (
                <div className="mt-7 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                    <p className="text-gray-500 dark:text-gray-400">لا توجد متطلبات لهذه المهمة</p>
                </div>
            ) : (
                <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {requirements.map((req, index) => {
                        const relatedMessage = getRelatedMessage(req);

                        return (
                            <li
                                key={index}
                                className="flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm border border-gray-200 dark:border-gray-700 p-3 rounded-lg text-sm"
                            >
                                {/* الصف العلوي: checkbox + النص (مع اللينكات) + الحالة */}
                                <div className="flex items-start justify-between gap-2">
                                    <span className="flex items-start gap-2 min-w-0 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={req.complated || false}
                                            onChange={() => handelCangereqstauts(req)}
                                            className="accent-main h-4 w-4 shrink-0 mt-0.5"
                                        />
                                        <span className="text-sm font-medium break-words">
                                            {renderTextWithLinks(req.type)}
                                        </span>
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                                            req.complated
                                                ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                                                : "bg-red-100 text-red-600 dark:bg-red-900/30"
                                        }`}
                                    >
                                        {req.complated ? "مكتمل" : "غير مكتمل"}
                                    </span>
                                </div>

                                {/* لو فيه رسالة مرتبطة تظهر تحت */}
                                {relatedMessage && (
                                    <div className="mt-2 flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <span>{relatedMessage.content || "رسالة مرتبطة"}</span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MissaionUpdateRequires;