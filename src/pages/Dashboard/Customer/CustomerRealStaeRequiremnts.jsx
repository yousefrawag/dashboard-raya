
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

import {
  FiFilter,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiExternalLink,
} from "react-icons/fi";

import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineApartment } from "react-icons/md";
import { HiOutlineCash } from "react-icons/hi";

import useQuerygetiteams from "../../../services/Querygetiteams";
import CustomeTabel from "../../../components/common/CustomeTabel";
import Loader from "../../../components/common/Loader";

const CustomerRealStaeRequiremnts = () => {
  const { isError, isLoading, data, refetch } = useQuerygetiteams(
    "customers/requiremnts",
    "customers/requiremnts"
  );

  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    location: "",
    region: "",
    propertyType: "",
    propertyStatus: "",
    currency: "",
    paymentType: "",
  });

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return "0";
    }

    return Number(value).toLocaleString("en-US");
  };

  const formatDate = (date) => {
    if (!date) return "غير محدد";

    const parsedDate =
      typeof date === "string" ? parseISO(date) : new Date(date);

    if (!isValid(parsedDate)) return "غير محدد";

    return format(parsedDate, "dd MMM yyyy", { locale: ar });
  };

  // دعم أكثر من شكل لاستجابة الـ API
  const requirements = useMemo(() => {
    const possibleData =
      data?.data?.data ??
      data?.data ??
      data?.data?.data?.data ??
      [];

    if (!Array.isArray(possibleData)) return [];

    return possibleData;
  }, [data]);

  // استخراج قيم الفلاتر تلقائيًا من الطلبات الموجودة
  const filterOptions = useMemo(() => {
    const uniqueValues = (getter) => [
      ...new Set(
        requirements
          .map(getter)
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              String(value).trim() !== ""
          )
          .map(String)
      ),
    ].sort((a, b) => a.localeCompare(b, "ar"));

    return {
      locations: uniqueValues((item) => item?.requirement?.rquireLocation),
      regions: uniqueValues((item) => item?.requirement?.requireRegion),
      propertyTypes: uniqueValues((item) => item?.requirement?.require),
      propertyStatuses: uniqueValues(
        (item) => item?.requirement?.requireType
      ),
      currencies: uniqueValues((item) => item?.requirement?.currency),
    };
  }, [requirements]);

  const filteredData = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return requirements
      .filter((item) => {
        const requirement = item?.requirement || {};

        const customerName = String(item?.customerName || "").toLowerCase();
        const phone = String(item?.customerPhone || "").toLowerCase();
        const secondaryPhone = String(
          item?.customerSecondaryPhone || ""
        ).toLowerCase();
        const customerId = String(item?.customerId || "").toLowerCase();

        const searchMatch =
          !search ||
          customerName.includes(search) ||
          phone.includes(search) ||
          secondaryPhone.includes(search) ||
          customerId.includes(search);

        const requirementDate = requirement.createdAt
          ? new Date(requirement.createdAt)
          : null;

        let dateMatch = true;

        if (filters.startDate) {
          if (!requirementDate || !isValid(requirementDate)) {
            dateMatch = false;
          } else {
            const start = new Date(`${filters.startDate}T00:00:00`);
            dateMatch =
              dateMatch && requirementDate.getTime() >= start.getTime();
          }
        }

        if (filters.endDate) {
          if (!requirementDate || !isValid(requirementDate)) {
            dateMatch = false;
          } else {
            const end = new Date(`${filters.endDate}T23:59:59.999`);
            dateMatch =
              dateMatch && requirementDate.getTime() <= end.getTime();
          }
        }

        const locationMatch =
          !filters.location ||
          requirement.rquireLocation === filters.location;

        const regionMatch =
          !filters.region ||
          requirement.requireRegion === filters.region;

        const propertyTypeMatch =
          !filters.propertyType ||
          requirement.require === filters.propertyType;

        const propertyStatusMatch =
          !filters.propertyStatus ||
          requirement.requireType === filters.propertyStatus;

        const currencyMatch =
          !filters.currency || requirement.currency === filters.currency;

        const firstPayment = Number(requirement.firstPayment) || 0;
        const monthlyPayment = Number(requirement.Paymentpermonth) || 0;

        const paymentMatch =
          !filters.paymentType ||
          (filters.paymentType === "first" && firstPayment > 0) ||
          (filters.paymentType === "monthly" && monthlyPayment > 0) ||
          (filters.paymentType === "both" &&
            firstPayment > 0 &&
            monthlyPayment > 0) ||
          (filters.paymentType === "cash" &&
            /كاش|نقد|cash/i.test(requirement.cashOption || ""));

        return (
          searchMatch &&
          dateMatch &&
          locationMatch &&
          regionMatch &&
          propertyTypeMatch &&
          propertyStatusMatch &&
          currencyMatch &&
          paymentMatch
        );
      })
      .sort((a, b) => {
        const dateA = a?.requirement?.createdAt
          ? new Date(a.requirement.createdAt).getTime()
          : 0;

        const dateB = b?.requirement?.createdAt
          ? new Date(b.requirement.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });
  }, [requirements, filters]);

  const stats = useMemo(() => {
    const uniqueCustomers = new Set(
      requirements.map((item) => String(item?.customerId || ""))
    );

    const firstPayments = requirements.filter(
      (item) => Number(item?.requirement?.firstPayment) > 0
    ).length;

    const monthlyPayments = requirements.filter(
      (item) => Number(item?.requirement?.Paymentpermonth) > 0
    ).length;

    return [
      {
        title: "إجمالي الطلبات",
        value: requirements.length,
        icon: <MdOutlineApartment size={24} />,
        color: "blue",
        description: "جميع طلبات العقارات",
      },
      {
        title: "العملاء أصحاب الطلبات",
        value: uniqueCustomers.size,
        icon: <FiUsers size={23} />,
        color: "purple",
        description: "عدد العملاء بدون تكرار",
      },
      {
        title: "طلبات بدفعة أولى",
        value: firstPayments,
        icon: <HiOutlineCash size={25} />,
        color: "green",
        description: "طلبات لها ميزانية مقدمة",
      },
      {
        title: "طلبات بقسط شهري",
        value: monthlyPayments,
        icon: <FiDollarSign size={23} />,
        color: "orange",
        description: "طلبات لها دفعة شهرية",
      },
    ];
  }, [requirements]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      startDate: "",
      endDate: "",
      location: "",
      region: "",
      propertyType: "",
      propertyStatus: "",
      currency: "",
      paymentType: "",
    });
  };

  const columns = [
    {
      name: "العميل",
      width: "190px",
      selector: (row) => row?.customerName,
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col gap-1 py-3">
          <Link
            to={`/cutomers/${row?.customerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            {row?.customerName || "بدون اسم"}
          </Link>

          <span
            className="max-w-[170px] truncate text-[11px] text-gray-400"
            title={String(row?.customerId || "")}
          >
            ID: {String(row?.customerId || "غير متوفر")}
          </span>
        </div>
      ),
    },
    {
      name: "رقم الهاتف",
      width: "155px",
      selector: (row) => row?.customerPhone,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span dir="ltr" className="text-sm font-medium">
            {row?.customerPhone || "غير متوفر"}
          </span>

          {row?.customerPhone && (
            <a
              href={`https://wa.me/${String(
                row.customerPhone
              ).replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              title="التواصل عبر واتساب"
              className="text-lg text-green-600 hover:text-green-800"
            >
              <FaWhatsapp />
            </a>
          )}
        </div>
      ),
    },
    {
      name: "المنطقة",
      selector: (row) => row?.requirement?.rquireLocation,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="font-medium">
          {row?.requirement?.rquireLocation || "غير محدد"}
        </span>
      ),
    },
    {
      name: "الموقع",
      selector: (row) => row?.requirement?.requireRegion,
      sortable: true,
      width: "130px",
      cell: (row) => (
        <span>{row?.requirement?.requireRegion || "غير محدد"}</span>
      ),
    },
    {
      name: "نوع العقار",
      selector: (row) => row?.requirement?.require,
      sortable: true,
      width: "115px",
      cell: (row) => (
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
          {row?.requirement?.require || "غير محدد"}
        </span>
      ),
    },
    {
      name: "حالة العقار",
      selector: (row) => row?.requirement?.requireType,
      sortable: true,
      width: "145px",
      cell: (row) => (
        <span className="text-sm">
          {row?.requirement?.requireType || "غير محدد"}
        </span>
      ),
    },
    {
      name: "الدفعة الأولى",
      selector: (row) => Number(row?.requirement?.firstPayment) || 0,
      sortable: true,
      width: "135px",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-800">
            {formatNumber(row?.requirement?.firstPayment)}
          </span>
          <span className="text-[11px] text-gray-500">
            {row?.requirement?.currency || ""}
          </span>
        </div>
      ),
    },
    {
      name: "القسط الشهري",
      selector: (row) => Number(row?.requirement?.Paymentpermonth) || 0,
      sortable: true,
      width: "135px",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-gray-800">
            {formatNumber(row?.requirement?.Paymentpermonth)}
          </span>
          <span className="text-[11px] text-gray-500">
            {row?.requirement?.currency || ""}
          </span>
        </div>
      ),
    },
    {
      name: "طريقة الدفع",
      selector: (row) => row?.requirement?.cashOption,
      width: "115px",
      cell: (row) => (
        <span>{row?.requirement?.cashOption || "غير محدد"}</span>
      ),
    },
    {
      name: "التفاصيل",
      selector: (row) => row?.requirement?.requireDetails,
      width: "230px",
      cell: (row) => (
        <div
          className="max-w-[210px] whitespace-normal py-2 text-sm leading-6 text-gray-600"
          title={row?.requirement?.requireDetails || ""}
        >
          {row?.requirement?.requireDetails || "لا توجد تفاصيل"}
        </div>
      ),
    },
    {
      name: "تاريخ الطلب",
      selector: (row) => row?.requirement?.createdAt,
      sortable: true,
      width: "145px",
      cell: (row) => (
        <span className="text-xs text-gray-600">
          {formatDate(row?.requirement?.createdAt)}
        </span>
      ),
    },
    {
      name: "عرض العميل",
      width: "105px",
      cell: (row) => (
        <Link
          to={`/cutomers/${row?.customerId}`}
          target="_blank"
          rel="noopener noreferrer"
          title="فتح ملف العميل"
          className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-blue-100 hover:text-blue-700"
        >
          <FiExternalLink size={15} />
          عرض
        </Link>
      ),
    },
  ];

  const selectClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm"
      >
        <div className="mb-3 text-lg font-bold text-red-600">
          تعذر تحميل طلبات العملاء
        </div>

        <p className="mb-5 text-sm text-gray-500">
          حدثت مشكلة أثناء الاتصال بالخادم. حاول تحديث البيانات.
        </p>

        <button
          onClick={() => refetch?.()}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          <FiRefreshCw />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <FiHome size={16} />
            <span>إدارة العملاء</span>
            <span>/</span>
            <span className="text-blue-600">طلبات العقارات</span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-800">
            جميع طلبات العقارات
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            متابعة احتياجات العملاء وميزانياتهم وطلبات الشراء في مكان واحد.
          </p>
        </div>

        <button
          onClick={() => refetch?.()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
        >
          <FiRefreshCw size={16} />
          تحديث البيانات
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const colors = {
            blue: {
              icon: "bg-blue-50 text-blue-600",
              border: "border-blue-100",
            },
            purple: {
              icon: "bg-purple-50 text-purple-600",
              border: "border-purple-100",
            },
            green: {
              icon: "bg-green-50 text-green-600",
              border: "border-green-100",
            },
            orange: {
              icon: "bg-orange-50 text-orange-600",
              border: "border-orange-100",
            },
          };

          return (
            <div
              key={stat.title}
              className={`rounded-2xl border ${colors[stat.color].border} bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800">
                    {formatNumber(stat.value)}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors[stat.color].icon}`}
                >
                  {stat.icon}
                </div>
              </div>

              <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex w-full items-center justify-between gap-3 p-5 text-right transition hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiFilter size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">البحث والفلاتر</h2>
              <p className="mt-1 text-xs text-gray-400">
                حدد الفترة والمنطقة ومواصفات العقار
              </p>
            </div>
          </div>

          {showFilters ? (
            <FiX size={21} className="text-gray-500" />
          ) : (
            <FiFilter size={21} className="text-gray-500" />
          )}
        </button>

        {showFilters && (
          <div className="border-t border-gray-100 p-5">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                البحث باسم العميل أو رقم الهاتف أو ID العميل
              </label>

              <div className="relative">
                <FiSearch
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  placeholder="اكتب اسم العميل أو رقم الهاتف..."
                  className={`${inputClass} pr-10`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiCalendar className="text-blue-500" />
                  من تاريخ
                </label>

                <input
                  type="date"
                  value={filters.startDate}
                  max={filters.endDate || undefined}
                  onChange={(e) => updateFilter("startDate", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiCalendar className="text-blue-500" />
                  إلى تاريخ
                </label>

                <input
                  type="date"
                  value={filters.endDate}
                  min={filters.startDate || undefined}
                  onChange={(e) => updateFilter("endDate", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FiMapPin className="text-blue-500" />
                  المنطقة
                </label>

                <select
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                  className={selectClass}
                >
                  <option value="">كل المناطق</option>
                  {filterOptions.locations.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  الموقع
                </label>

                <select
                  value={filters.region}
                  onChange={(e) => updateFilter("region", e.target.value)}
                  className={selectClass}
                >
                  <option value="">كل المواقع</option>
                  {filterOptions.regions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  نوع العقار
                </label>

                <select
                  value={filters.propertyType}
                  onChange={(e) =>
                    updateFilter("propertyType", e.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">كل أنواع العقارات</option>
                  {filterOptions.propertyTypes.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  حالة العقار
                </label>

                <select
                  value={filters.propertyStatus}
                  onChange={(e) =>
                    updateFilter("propertyStatus", e.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">كل الحالات</option>
                  {filterOptions.propertyStatuses.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  العملة
                </label>

                <select
                  value={filters.currency}
                  onChange={(e) => updateFilter("currency", e.target.value)}
                  className={selectClass}
                >
                  <option value="">كل العملات</option>
                  {filterOptions.currencies.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  طريقة / نظام الدفع
                </label>

                <select
                  value={filters.paymentType}
                  onChange={(e) =>
                    updateFilter("paymentType", e.target.value)
                  }
                  className={selectClass}
                >
                  <option value="">كل الطلبات</option>
                  <option value="first">لها دفعة أولى</option>
                  <option value="monthly">لها قسط شهري</option>
                  <option value="both">دفعة أولى وقسط شهري</option>
                  <option value="cash">كاش حسب بيانات الطلب</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">
                نتائج البحث:{" "}
                <span className="font-extrabold text-blue-600">
                  {formatNumber(filteredData.length)}
                </span>{" "}
                طلب من أصل {formatNumber(requirements.length)}
              </p>

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <FiX size={17} />
                مسح الفلاتر
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Requirements Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-gray-800">
              قائمة طلبات العملاء
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              كل صف يمثل طلبًا مستقلًا حتى لو كان للعميل أكثر من طلب.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 sm:self-auto">
            <MdOutlineApartment size={19} />
            {formatNumber(filteredData.length)} طلب
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="p-3 sm:p-5">
            <CustomeTabel
              data={filteredData}
              columns={columns}
              defaultSortField="requirement.createdAt"
              defaultSortAsc={false}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <FiSearch size={28} />
            </div>

            <h3 className="font-bold text-gray-700">
              لا توجد طلبات مطابقة
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
              لا توجد طلبات تطابق الفلاتر الحالية، جرّب تغيير فترة البحث أو
              مسح الفلاتر لعرض جميع الطلبات.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              عرض جميع الطلبات
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerRealStaeRequiremnts;
