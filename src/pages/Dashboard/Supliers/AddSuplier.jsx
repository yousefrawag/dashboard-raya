
import React, { useState } from "react";
import useQueryadditeam from "../../../services/Queryadditeam";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const AddSuplier = () => {
  const { isLoading, isError, addIteam } = useQueryadditeam(
    "supliers",
    "supliers"
  );

  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    phones: [""],
    emails: [""],
    products: [],
    notes: "",
    isActive: true,
  });

  const [product, setProduct] = useState({
    productName: "",
    category: "",
    wholesalePrice: "",
    currency: "USD",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (index, value) => {
    setFormData((prev) => {
      const phones = [...prev.phones];
      phones[index] = value;

      return {
        ...prev,
        phones,
      };
    });
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      phones: [...prev.phones, ""],
    }));
  };

  const removePhone = (index) => {
    setFormData((prev) => {
      const phones = prev.phones.filter((_, i) => i !== index);

      return {
        ...prev,
        phones: phones.length ? phones : [""],
      };
    });
  };

  const handleEmailChange = (index, value) => {
    setFormData((prev) => {
      const emails = [...prev.emails];
      emails[index] = value;

      return {
        ...prev,
        emails,
      };
    });
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const removeEmail = (index) => {
    setFormData((prev) => {
      const emails = prev.emails.filter((_, i) => i !== index);

      return {
        ...prev,
        emails: emails.length ? emails : [""],
      };
    });
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProduct = () => {
    if (!product.productName.trim()) return;

    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          ...product,
          wholesalePrice: Number(product.wholesalePrice) || 0,
        },
      ],
    }));

    setProduct({
      productName: "",
      category: "",
      wholesalePrice: "",
      currency: "USD",
    });
  };

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      alert("برجاء إدخال اسم الشركة");
      return;
    }

    if (!formData.country.trim()) {
      alert("برجاء إدخال الدولة");
      return;
    }

    const data = {
      ...formData,
      phones: formData.phones.filter((phone) => phone.trim() !== ""),
      emails: formData.emails.filter((email) => email.trim() !== ""),
      products: formData.products.map((item) => ({
        ...item,
        wholesalePrice: Number(item.wholesalePrice) || 0,
      })),
    };

     addIteam(data , {
        onSuccess:() => {
            toast.success("تم إضافه مورد جديد")
        }
     });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              إضافة شركة / مورد جديد
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              أضف بيانات الشركة ووسائل التواصل والمنتجات التي توفرها
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-medium text-slate-600">
              مورد نشط
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Company Information */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">
                بيانات الشركة
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                البيانات الأساسية الخاصة بالمورد
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  اسم الشركة
                  <span className="mr-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="مثال: ABC Trading Company"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  الدولة
                  <span className="mr-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="مثال: تركيا"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">
                بيانات التواصل
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                يمكنك إضافة أكثر من رقم هاتف وأكثر من بريد إلكتروني
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">

              {/* Phones */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    أرقام الهاتف
                  </label>

                  <button
                    type="button"
                    onClick={addPhone}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    + إضافة رقم
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        placeholder="رقم الهاتف"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      {formData.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index)}
                          className="w-11 rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emails */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    البريد الإلكتروني
                  </label>

                  <button
                    type="button"
                    onClick={addEmail}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    + إضافة بريد
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        placeholder="example@company.com"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                      />

                      {formData.emails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmail(index)}
                          className="w-11 rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* Products */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    منتجات المورد
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    أضف المنتجات التي توفرها الشركة وأسعار الجملة الخاصة بها
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  {formData.products.length} منتج
                </div>
              </div>
            </div>

            {/* Add Product */}
            <div className="m-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">

              <h3 className="mb-4 text-sm font-bold text-slate-700">
                إضافة منتج
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    اسم المنتج
                  </label>

                  <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={handleProductChange}
                    placeholder="اسم المنتج"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    فئة المنتج
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleProductChange}
                    placeholder="مثال: مواد غذائية"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    سعر الجملة
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="wholesalePrice"
                    value={product.wholesalePrice}
                    onChange={handleProductChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    العملة
                  </label>

                  <select
                    name="currency"
                    value={product.currency}
                    onChange={handleProductChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="USD">USD - دولار أمريكي</option>
                    <option value="EUR">EUR - يورو</option>
                    <option value="EGP">EGP - جنيه مصري</option>
                    <option value="SAR">SAR - ريال سعودي</option>
                    <option value="AED">AED - درهم إماراتي</option>
                    <option value="CNY">CNY - يوان صيني</option>
                    <option value="TRY">TRY - ليرة تركية</option>
                  </select>
                </div>

              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={addProduct}
                  disabled={!product.productName.trim()}
                  className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + إضافة المنتج
                </button>
              </div>

            </div>

            {/* Products Table */}
            {formData.products.length > 0 ? (
              <div className="px-6 pb-6">

                <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                  <table className="w-full text-right">

                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-xs font-bold text-slate-500">
                          #
                        </th>

                        <th className="px-4 py-3 text-xs font-bold text-slate-500">
                          المنتج
                        </th>

                        <th className="px-4 py-3 text-xs font-bold text-slate-500">
                          الفئة
                        </th>

                        <th className="px-4 py-3 text-xs font-bold text-slate-500">
                          سعر الجملة
                        </th>

                        <th className="px-4 py-3 text-xs font-bold text-slate-500">
                          العملة
                        </th>

                        <th className="w-20 px-4 py-3" />
                      </tr>
                    </thead>

                    <tbody>
                      {formData.products.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-4 text-sm text-slate-400">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-800">
                              {item.productName}
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {item.category || "-"}
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                            {Number(
                              item.wholesalePrice || 0
                            ).toLocaleString()}
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-600">
                              {item.currency}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => removeProduct(index)}
                              className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                {/* Mobile Products */}
                <div className="space-y-3 md:hidden">
                  {formData.products.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between">

                        <div>
                          <p className="font-bold text-slate-800">
                            {item.productName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.category || "بدون فئة"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeProduct(index)}
                          className="text-xs font-semibold text-red-500"
                        >
                          حذف
                        </button>

                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-500">
                          سعر الجملة
                        </span>

                        <span className="font-bold text-slate-800">
                          {Number(
                            item.wholesalePrice || 0
                          ).toLocaleString()}{" "}
                          {item.currency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="mx-6 mb-6 rounded-xl border border-dashed border-slate-200 py-10 text-center">

                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  📦
                </div>

                <p className="text-sm font-semibold text-slate-600">
                  لم تتم إضافة منتجات بعد
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  أضف المنتجات التي يوفرها هذا المورد من النموذج بالأعلى
                </p>

              </div>
            )}

          </section>

          {/* Notes */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">
                ملاحظات
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                أضف أي معلومات إضافية عن المورد
              </p>
            </div>

            <div className="p-6">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={5}
                placeholder="أضف ملاحظات عن الشركة أو المورد..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

          </section>

          {/* Footer */}
          <div className="sticky bottom-4 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

           

          <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ الشركة"}
                </button>
                <Link
                 to="/supliers"
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  إلغاء
                </Link>

      

              </div>

           

          </div>

          {isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              حدث خطأ أثناء حفظ بيانات الشركة، برجاء المحاولة مرة أخرى.
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default AddSuplier;
