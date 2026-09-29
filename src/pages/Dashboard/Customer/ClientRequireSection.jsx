import React, { useState } from "react";
import useQuerygetiteams from "../../../services/Querygetiteams";
import toast from "react-hot-toast";

const INITIAL_FORM = {
  rquireLocation: "",
  requireRegion: "",
  require: "",
  requireType: "",
  currency: "",
  cashOption: "",
  firstPayment: "",
  Paymentpermonth: "",
  requireDetails: "",
};

const ClientRequireSection = ({ setClientRequiremnts, clientRequirements }) => {
  const { data } = useQuerygetiteams("requirements", "requirements");
  const { data: locations } = useQuerygetiteams("location", "location");
  const { data: FirsPaymentData } = useQuerygetiteams("firstpayment", "firstpayment");
  const { data: currencyData } = useQuerygetiteams("currency", "currency");

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [relatedRegions, setRelatedRegions] = useState([]);
  const [Typesy, setTypes] = useState([]);

  // index الطلب اللي بنعدله — null يعني وضع إضافة
  const [editingIndex, setEditingIndex] = useState(null);

  const isCash = formData.cashOption === "كاش";
  const isEditing = editingIndex !== null;

  // تحميل الـ regions/types من قيمة موجودة مسبقاً (وقت التعديل)
  const loadRelatedData = (locationName, requireName) => {
    const selectedRegion = locations?.data?.data?.find(
      (item) => item.name === locationName
    );
    setRelatedRegions(selectedRegion?.relatedRegions || []);

    const selectedType = data?.data?.data?.find(
      (item) => item.name === requireName
    );
    setTypes(selectedType?.relatedRegions || []);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "cashOption" && value === "كاش") {
        updated.firstPayment = "";
        updated.Paymentpermonth = "";
      }
      return updated;
    });

    if (name === "rquireLocation") {
      const selectedRegion = locations?.data?.data?.find(
        (item) => item.name === value
      );
      setRelatedRegions(selectedRegion?.relatedRegions || []);
      setFormData((prev) => ({ ...prev, requireRegion: "" }));
    }

    if (name === "require") {
      const selectedType = data?.data?.data?.find(
        (item) => item.name === value
      );
      setTypes(selectedType?.relatedRegions || []);
      setFormData((prev) => ({ ...prev, requireType: "" }));
    }
  };

  // إضافة أو حفظ التعديل
  const handleSubmit = () => {
    const requiredFields = [
      "rquireLocation",
      "requireRegion",
      "require",
      "requireType",
      "currency",
      "cashOption",
    ];

    if (!isCash) requiredFields.push("firstPayment");

    const missing = requiredFields.find((field) => !formData[field]);
    if (missing) {
      toast.error("يرجى ملء جميع الحقول المطلوبة قبل الإضافة");
      return;
    }

    const payload = isCash
      ? {
          rquireLocation: formData.rquireLocation,
          requireRegion: formData.requireRegion,
          require: formData.require,
          requireType: formData.requireType,
          currency: formData.currency,
          cashOption: formData.cashOption,
          requireDetails: formData.requireDetails,
        }
      : { ...formData };

    if (isEditing) {
      // تعديل
      setClientRequiremnts((prev) =>
        prev.map((item, i) => (i === editingIndex ? payload : item))
      );
      toast.success("تم تعديل الطلب بنجاح");
    } else {
      // إضافة
      setClientRequiremnts((prev) => [...prev, payload]);
      toast.success("تم إضافة الطلب بنجاح");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setRelatedRegions([]);
    setTypes([]);
    setEditingIndex(null);
  };

  // بدء التعديل
  const handleEdit = (index) => {
    const req = clientRequirements[index];
    setFormData({
      rquireLocation: req.rquireLocation || "",
      requireRegion: req.requireRegion || "",
      require: req.require || "",
      requireType: req.requireType || "",
      currency: req.currency || "",
      cashOption: req.cashOption || "",
      firstPayment: req.firstPayment || "",
      Paymentpermonth: req.Paymentpermonth || "",
      requireDetails: req.requireDetails || "",
    });
    loadRelatedData(req.rquireLocation, req.require);
    setEditingIndex(index);

    // scroll للفورم
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد الحذف؟");
    if (!confirmed) {
      toast.error("تم إلغاء الحذف");
      return;
    }
    setClientRequiremnts((prev) => prev.filter((_, i) => i !== index));
    toast.success("تم الحذف بنجاح");

    // لو بنحذف الطلب اللي بنعدله → اقفل الفورم
    if (editingIndex === index) resetForm();
    else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* ===== فورم إضافة / تعديل الطلب ===== */}
      <div
        className={`border rounded-xl p-6 shadow-sm bg-white transition-colors ${
          isEditing ? "border-main/60 ring-2 ring-main/10" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-main">
            {isEditing ? `تعديل الطلب رقم ${editingIndex + 1}` : "إضافة طلب جديد"}
          </h3>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-red-500 underline"
            >
              إلغاء التعديل
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-medium">موقع العقار *</label>
            <select
              name="rquireLocation"
              value={formData.rquireLocation}
              onChange={handleFormChange}
              className="border rounded-md p-2 focus:border-primary outline-0"
            >
              <option value="">قم بالإختيار</option>
              {locations?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">منطقة العقار *</label>
            <select
              name="requireRegion"
              value={formData.requireRegion}
              onChange={handleFormChange}
              disabled={!relatedRegions.length}
              className="border rounded-md p-2 focus:border-primary outline-0 disabled:bg-gray-100"
            >
              <option value="">قم بالإختيار</option>
              {relatedRegions?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">نوع العقار *</label>
            <select
              name="require"
              value={formData.require}
              onChange={handleFormChange}
              className="border rounded-md p-2 focus:border-primary outline-0"
            >
              <option value="">قم بالإختيار</option>
              {data?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">وصف العقار *</label>
            <select
              name="requireType"
              value={formData.requireType}
              onChange={handleFormChange}
              disabled={!Typesy.length}
              className="border rounded-md p-2 focus:border-primary outline-0 disabled:bg-gray-100"
            >
              <option value="">قم بالإختيار</option>
              {Typesy?.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">نوع العملة *</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleFormChange}
              className="border rounded-md p-2 focus:border-primary outline-0"
            >
              <option value="">قم بالإختيار</option>
              {currencyData?.data?.data?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">ألية الدفع *</label>
            <select
              name="cashOption"
              value={formData.cashOption}
              onChange={handleFormChange}
              className="border rounded-md p-2 focus:border-primary outline-0"
            >
              <option value="">قم بالإختيار</option>
              <option value="كاش">كاش</option>
              <option value="تقسيط">تقسيط</option>
              <option value="معاملة بنكية">معاملة بنكية</option>
            </select>
          </div>

          {!isCash && (
            <div className="flex flex-col gap-2">
              <label className="font-medium">الدفعة الأولى *</label>
              <select
                name="firstPayment"
                value={formData.firstPayment}
                onChange={handleFormChange}
                className="border rounded-md p-2 focus:border-primary outline-0"
              >
                <option value="">اختر الدفعة الأولى</option>
                {FirsPaymentData?.data?.data?.map((item) => (
                  <option key={item?._id} value={item?.name}>
                    {item?.name?.toLocaleString("en-US")}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isCash && (
            <div className="flex flex-col gap-2">
              <label className="font-medium">الدفعة الشهرية</label>
              <input
                type="number"
                name="Paymentpermonth"
                value={formData.Paymentpermonth}
                onChange={handleFormChange}
                placeholder="أدخل قيمة الدفعة الشهرية"
                className="border rounded-md p-2 focus:border-primary outline-0"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium">تفاصيل الطلب</label>
          <textarea
            name="requireDetails"
            value={formData.requireDetails}
            onChange={handleFormChange}
            placeholder="اكتب تفاصيل إضافية عن الطلب..."
            className="min-h-[140px] border rounded-md p-3 focus:border-primary outline-0"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            >
              إلغاء
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-main text-white px-6 py-2 rounded-md hover:bg-main/90 transition-all"
          >
            {isEditing ? "حفظ التعديل" : "+ إضافة الطلب"}
          </button>
        </div>
      </div>

      {/* ===== عرض الطلبات ===== */}
      <div className="flex flex-col gap-5">
        {clientRequirements.length === 0 ? (
          <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            لا توجد طلبات حالياً
          </p>
        ) : (
          clientRequirements.map((req, index) => {
            const reqIsCash = req.cashOption === "كاش";

            return (
              <div
                key={index}
                className={`w-full bg-white border rounded-2xl shadow-sm transition-all ${
                  editingIndex === index
                    ? "border-main ring-2 ring-main/20"
                    : "border-gray-200 hover:border-main/40"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-main text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-main">
                        طلب رقم {index + 1}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {req.rquireLocation} - {req.requireRegion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(index)}
                      type="button"
                      className="px-4 py-1.5 text-sm rounded-md border border-main text-main hover:bg-main hover:text-white transition-all"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      type="button"
                      className="px-4 py-1.5 text-sm rounded-md border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* بيانات العقار */}
                  <section>
                    <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                      بيانات العقار
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoItem label="موقع العقار" value={req.rquireLocation} />
                      <InfoItem label="منطقة العقار" value={req.requireRegion} />
                      <InfoItem label="نوع العقار" value={req.require} />
                      <InfoItem label="وصف العقار" value={req.requireType} />
                    </div>
                  </section>

                  {/* بيانات الدفع */}
                  <section>
                    <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                      بيانات الدفع
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoItem label="العملة" value={req.currency} />
                      <InfoItem
                        label="آلية الدفع"
                        value={req.cashOption}
                        highlight
                      />

                      {!reqIsCash && (
                        <>
                          <InfoItem
                            label="الدفعة الأولى"
                            value={req.firstPayment ? 
                              Number(req.firstPayment).toLocaleString(
                                    "en-US"
                                  )
                                : ""
                            } 
                          />
                          <InfoItem
                            label="الدفعة الشهرية"
                            value={
                              req.Paymentpermonth
                                ? Number(req.Paymentpermonth).toLocaleString(
                                    "en-US"
                                  )
                                : ""
                            }
                          />
                        </>
                      )}
                    </div>
                  </section>

                  {/* تفاصيل الطلب */}
                  {req.requireDetails && (
                    <section>
                      <h5 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                        تفاصيل الطلب
                      </h5>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 border border-gray-100 whitespace-pre-wrap leading-relaxed">
                        {req.requireDetails}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* مكوّن صغير لعرض معلومة */
const InfoItem = ({ label, value, highlight }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span
      className={`text-sm font-semibold break-words ${
        highlight ? "text-main" : "text-gray-800"
      }`}
    >
      {value || "-"}
    </span>
  </div>
);

export default ClientRequireSection;