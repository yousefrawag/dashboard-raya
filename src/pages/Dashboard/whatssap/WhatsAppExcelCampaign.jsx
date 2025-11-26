import React, { useState } from "react";
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import useQueryadditeam from "../../../services/Queryadditeam";
import AddnewCompain from "../../../components/ui/whatsaap/AddnewCompain";
import AddCustomerForm from "../../../components/ui/whatsaap/AddCustomerform";
import SendNotfire from "../../../components/ui/whatsaap/SendNotfire";
import { Link } from "react-router-dom";
const WhatsAppExcelCampaign = () => {
  const {isError , isLoading , addIteam} =  useQueryadditeam("" , "")
  const [step, setStep] = useState(1);
  const [compainId , setCompainId] = useState(null)
  const [campaign, setCampaign] = useState({
    name: "",
    customerType: "",
    file: null,
    message: "",
    link: "",
    image: null,
    CustomerNumber:0
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleFileChange = (e) => {
    setCampaign({ ...campaign, file: e.target.files[0] });
  };

  const handleImageChange = (e) => {
    setCampaign({ ...campaign, image: e.target.files[0] });
  };

  const handleSend = () => {
    if (!campaign.file || !campaign.message)
      return alert("يرجى إدخال جميع البيانات المطلوبة");

    console.log("🚀 Campaign Sent:", campaign);
    alert("✅ تم إرسال الحملة بنجاح!");
  };

  const steps = [
    "تفاصيل الحملة",
    "رفع ملف العملاء",
    "محتوى الحملة",
  
  ];

const handelAddNewcompain = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  
    const data = Object.fromEntries(formData);
    formData.append("image" , image.file)
    if(!data.title){
      toast.error("يجب إضافه  عنوان الحملة")
        return ;
    }

    if(!data.email){
      toast.error("يجب إضافه الإيميل الخاص بالمستخدم")
      return ;
    }
    if(!data.phoneNumber){
        toast.error("يجب إضافه الجوال الخاص بالمستخدم")
        return ;
      }
      if(!data.job){
        toast.error("يجب إضافه وظيفة مستخدم")
        return ;
      }
      if(!data.type){
        toast.error("يجب إضافه نوع حساب مستخدم")
        return ;
      }
      if(!data.password){
        toast.error("يجب إضافه كلمة مرور الى حساب مستخدم")
        return ;
      }
      // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
      
    try {
    
        
        addIteam(formData, {
            onSuccess:() =>{
             
                e.target.reset()
                
                toast.success("تم إضافه مستخدم جديد")
                navigate("/All-users")
            },  
             onError: (error) => {
              if (error.response && error.response.data && error.response.data.mesg) {
                toast.error(error.response.data.mesg);
              } else {
                toast.error("An error occurred. Please try again.");
              }
            }
        })
    } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.mesg)
    }
   }
  return (
    <div className="min-h-screen  py-10 px-4 ">
      <div className="flex flex-col sm:flex-row justify-between  sm:items-center mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        إنشاء حملة واتساب جديدة 📢
      </h1>
      <Link to="/whatsap-boarding" className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
عوده
      </Link>
</div>
      {/* ======= مؤشر الخطوات ======= */}
      <div className="flex justify-between w-full w-full mb-8">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step > index + 1
                  ? "bg-green-500"
                  : step === index + 1
                  ? "bg-green-600"
                  : "bg-gray-300"
              }`}
            >
              {step > index + 1 ? <FaCheckCircle /> : index + 1}
            </div>
            <p
              className={`mt-2 text-sm ${
                step === index + 1 ? "text-green-600 font-semibold" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ======= الخطوة 1 ======= */}
      {step === 1 && (
   <AddnewCompain nextStep={setStep} setCompainId={setCompainId}/>
      )}

      {/* ======= الخطوة 2 ======= */}
      {step === 2 && (
    <AddCustomerForm  nextStep={setStep} prevStep={prevStep} compainid={compainId}/>
      )}

      {/* ======= الخطوة 3 ======= */}
      {step === 3 && (
    <SendNotfire nextStep={setStep} prevStep={prevStep} compainid={compainId}/>
      )}

  
    </div>
  );
};

export default WhatsAppExcelCampaign;
