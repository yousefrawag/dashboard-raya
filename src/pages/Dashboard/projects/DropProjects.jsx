import React, { useState } from 'react';
import authFetch from '../../../utils/axiosAuthfetch';
import * as XLSX from 'xlsx';
// استيراد الأيقونات من باقة Feather
import { FiUploadCloud, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const DropProjects = () => {
    const [fileData, setFileData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    // هندلة اختيار الملف وقراءة بياناته
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();

        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            // تحويل البيانات لـ JSON
            const data = XLSX.utils.sheet_to_json(ws);
            setFileData(data);
            setStatus({ type: 'info', message: `تم قراءة ${data.length} مشروع بنجاح. جاهز للرفع!` });
        };

        reader.readAsBinaryString(file);
    };

    // إرسال البيانات للباك إيند
    const handleDropCustomer = async () => {
        if (fileData.length === 0) {
            setStatus({ type: 'error', message: 'يرجى اختيار ملف إكسيل أولاً!' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // إرسال البيانات كـ JSON في الـ Body
            const res = await authFetch.post("/projects/drop", {
                projects: fileData
            });

            setStatus({ type: 'success', message: 'تم استيراد جميع المشاريع بنجاح!' });
            setFileData([]);
            setFileName("");
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'حدث خطأ أثناء رفع البيانات، حاول مرة أخرى.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-full  mt-10 p-6 bg-white rounded-xl shadow-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">استيراد المشاريع من إكسيل</h1>
                <p className="text-gray-500 mt-2">ارفع ملف الإكسيل لنقل بيانات مشاريعك إلى الـ CRM الجديد</p>
            </div>

            {/* منطقة إسقاط واختيار الملف */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center justify-center space-y-3">
                    <FiUploadCloud className="w-12 h-12 text-blue-500" />
                    <p className="text-gray-600 font-medium">
                        {fileName ? fileName : "اسحب ملف الإكسيل هنا أو اضغط للاختيار"}
                    </p>
                    <p className="text-xs text-gray-400">يدعم ملفات XLSX, XLS فقط</p>
                </div>
            </div>

            {/* رسائل الحالة */}
            {status.message && (
                <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' : 
                    status.type === 'error' ? 'bg-red-50 text-red-700' : 
                    'bg-blue-50 text-blue-700'
                }`}>
                    {status.type === 'success' && <FiCheckCircle className="w-5 h-5" />}
                    {status.type === 'error' && <FiXCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}

            {/* زر الرفع */}
            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleDropCustomer}
                    disabled={loading || fileData.length === 0}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
                        loading || fileData.length === 0 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {loading ? (
                        <>
                            <FiLoader className="w-5 h-5 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        'ابدأ الاستيراد الآن'
                    )}
                </button>
            </div>
        </div>
    );
};

export default DropProjects;