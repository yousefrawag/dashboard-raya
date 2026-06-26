import React, { useMemo, useState } from 'react';
import HeadPagestyle from '../../../components/common/HeadPagestyle';
import CustomeTabel from '../../../components/common/CustomeTabel';
import { Link } from 'react-router-dom';
import { FiFilter, FiX, FiHome } from 'react-icons/fi';
import { MdOutlineEditNote } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { GrFormView } from "react-icons/gr";
import useQuerygetiteams from '../../../services/Querygetiteams';
import useQueryDelete from '../../../services/useQueryDelete';
import FiltertionHook from '../../../hooks/FiltertionHook';
import Loader from '../../../components/common/Loader';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import authFetch from '../../../utils/axiosAuthfetch';
import toast from 'react-hot-toast';
import { format } from "date-fns";

const GetProperties = () => {
  const { data, isLoading  , refetch} = useQuerygetiteams(
    'projects/properties',
    'projects/properties',
  );
    const { data: propertySatuts } = useQuerygetiteams('propertySatuts', 'propertySatuts');

console.log("properties" , data);


  const { CanDelte, CanEdit, isAdmin, CanAdd } =
    useGetUserAuthentications('Projects');

  const [openFilter, setOpenFilter] = useState(false);

  const [params, setParams] = useState({
    field: '',
    searchTerm: '',
    startDate: '',
    endDate: '',
  });

  const properties = data?.data?.data || [];

  const filters = [
    {
      value: 'projectName',
      name: 'اسم المشروع',
    },

    {
      value: 'propertyStatus',
      name: 'حالة الشقة',
    },

    {
      value: 'floorType',
      name: 'نوع العقار',
    },

    {
      value: 'floorTypeFlow',
      name: 'التابع',
    },

    {
      value: 'city',
      name: 'المدينة',
    },

    {
      value: 'governorate',
      name: 'المحافظة',
    },

    {
      value: 'floorNumber',
      name: 'رقم الشقة',
    },
  ];

  const filteredData = useMemo(() => {
    return properties.filter((item) => {
      if (!params.searchTerm || !params.field) return true;

      const value = params.field
        .split('.')
        .reduce((obj, key) => obj?.[key], item);

      return String(value || '')
        .toLowerCase()
        .includes(params.searchTerm.toLowerCase());
    });
  }, [properties, params]);

  const getImage = (row) => {
    if (row?.imagesURLs?.[0]?.fileURL) return row.imagesURLs[0].fileURL;

    return 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0';
  };
  const removeProperty = async(proertyId , projectId) => {
   try {
     const confirmed = window.confirm("هل أنت متأكد أنك تريد الحذف؟");
     if(confirmed) {
    const res =  await authFetch.delete(`/projects/${projectId}/${proertyId}`)
    if(res.status === 200){
      refetch()
      toast.success("تم الحذف بنجاح")
      
    } else {
      toast.success("تم الغاء الحذف")
    }
     }

    } catch (error) {
      console.log("eroro" , error);
      
      toast.error("هناك خطاء اثناء الحذف")
    }
  };
  const columns = [
    {
      name: 'الصورة',

      width: '100px',

      cell: (row) => (
        <Link 
          to={`/project/property/${row?.projectId}/${row._id}`}
        >
              <img
          src={getImage(row)}
          className="w-16 h-16 rounded-2xl object-cover"
        />
        </Link>
  
      ),
    },

  {
  name: 'حالة الشقة',
  width: '120px',
  cell: (row, index, updatePropertyStatus) => (
    <span
 
      // onChange={(e) => updatePropertyStatus(index, e.target.value)}
      className={`px-3 py-2 rounded-xl border-2 outline-none transition-all ${
        row.propertyStatus === 'متاحة' 
          ? 'border-green-400 bg-green-50 text-green-700' 
          : row.propertyStatus === 'محجوزه' 
          ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
          : row.propertyStatus === 'مباعة' 
          ? 'border-red-400 bg-red-50 text-red-700'
          : row.propertyStatus === 'قيد التعاقد'
          ? 'border-blue-400 bg-blue-50 text-blue-700'
          : 'border-gray-300 bg-gray-50 text-gray-700'
      }`}
    >
{
  row.propertyStatus
}
    
    </span>
  ),
},
{
  name: 'عملاء معنيون بالشقه',
  width: '200px',
  cell: (row) => {
    // التحقق من وجود عملاء
    if (!row.customers || row.customers.length === 0) {
      return <span className="text-gray-400 text-sm">لا يوجد عملاء</span>;
    }

    // عرض العملاء كأسماء قابلة للنقر
    return (
      <div className="flex flex-wrap gap-1">
        {row.customers.map((customer, index) => (
          <Link
            key={customer.id || index}
            to={`/cutomers/${customer.id}`} // رابط الملف الشخصي للعميل
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm whitespace-nowrap bg-blue-50 px-2 py-1 rounded-full"
          >
            {customer.fullName}
          </Link>
        ))}
      </div>
    );
  },
},

    {
      name: 'المشروع',

      width: '120px',

      cell: (row) => (
        <Link
          to={`/projects-main/${row.projectId}`}
          className="text-blue-600 font-bold"
        >
          {row.projectName}
        </Link>
      ),
    },

    {
      name: 'نوع العقار',
      selector: (row) => row.floorType,
    },

    {
      name: 'التابع',
      selector: (row) => row.floorTypeFlow,
    },

    {
      name: 'الطابق',
      selector: (row) => row.floor,
    },

    {
      name: 'رقم الشقة',
      selector: (row) => row.floorNumber,
    },

    {
      name: 'الغرف',
      selector: (row) => row.rooms,
    },

    {
      name: 'الحمامات',
      selector: (row) => row.bathrooms,
    },

    {
      name: 'المساحة',

      cell: (row) => `${row.area || 0} م²`,
    },

    {
      name: 'السعر',
      width:"150px",
   sortable: true,
      cell: (row) => (
        <span className="text-main font-bold">
          {Number(row.price || 0).toLocaleString()}
        </span>
      ),
    },

    {
      name: 'الدفعة الأولى',
        width:"150px",
   sortable: true,
      cell: (row) => Number(row.downPayment || 0).toLocaleString(),
    },

    {
      name: 'القسط الشهرى',
        width:"150px",
           sortable: true,

      cell: (row) => Number(row.monthlyInstallment || 0).toLocaleString(),
    },

    {
      name: 'المدينة',
      selector: (row) => row.city,
    },
   {
  name: "تاريخ الإنشاء",
  width: "150px",
  cell: (row) => {
    // التحقق من وجود createdAt وقيمتها صالحة
    if (!row.createdAt) {
      return <span className="text-gray-400">-</span>;
    }
    
    try {
      const date = new Date(row.createdAt);
      // التحقق من أن التاريخ صالح
      if (isNaN(date.getTime())) {
        return <span className="text-gray-400">تاريخ غير صالح</span>;
      }
      return (
        <div
          style={{
            whiteSpace: "wrap",
          }}
          title={format(date, "dd MMMM, yyyy")}
        >
          {format(date, "dd MMMM, yyyy")}
        </div>
      );
    } catch (error) {
      return <span className="text-gray-400">-</span>;
    }
  },
},
    {
      name: 'الإجراءات',

      width: '180px',

      cell: (row) => (
        <div className="flex gap-2">
                    {
          (isAdmin || CanView) && (

          <Link
          to={`/project/property/${row?.projectId}/${row._id}`}
          className="bg-green-50 text-green-600 p-2 rounded-xl"
          >

          <GrFormView size={22}/>

          </Link>

          )
          }
          {(isAdmin || CanEdit) && (
            <Link 
                to={`/project/property/edit/${row?.projectId}/${row._id}`}
            className="bg-blue-50 text-blue-600 p-2 rounded-xl">
              <MdOutlineEditNote size={22} />
            </Link>
          )}
 
          {(isAdmin || CanDelte) && (
            <button
              onClick={() => removeProperty(row._id , row?.projectId)}
              className="bg-red-50 text-red-600 p-2 rounded-xl"
            >
              <AiTwotoneDelete size={22} />
            </button>
          )}
        </div>
      ),
    },
  ];
    const columnsfile = [

           {
        name: "المشروع",
        selector: (row) => row?.projectName || "",
      },
          {
        name: "حالة الشقة",
        selector: (row) => row?.propertyStatus || "",
      },
      {
        name: "نوع العقار",
        selector: (row) => row?.floorType || "",
      },
     {
        name: "التابع",
        selector: (row) => row?.floorTypeFlow || "",
      },
         {
        name: "الطابق",
        selector: (row) => row?.floor || "",
      },
        {
        name: "رقم الشقة",
        selector: (row) => row?.floorNumber || "",
      },
            {
        name: "عدد الغرف",
        selector: (row) => row?.rooms || "",
      },
      {
        name: "عدد حمامات",
        selector: (row) => row?.bathrooms || "",
      },
      {
        name: "المساحه",
        selector: (row) => row?.area || "",
      },
         {
        name: "المساحه الخارجيه",
        selector: (row) => row?.areaOutside || "",
      },
          {
        name: "مساحه التراس",
        selector: (row) => row?.areaTarth || "",
      },
          {
        name: "مساحه البركه",
        selector: (row) => row?.areaBark || "",
      },
   {
    name: "سعر الشقه الإجمالي",
    selector: (row) => row?.price ? Number(row.price).toLocaleString() : "-",
    sortable: true,
    exportSelector: (row) => row?.price || 0,
  },
  {
    name: "الدفعه الأولى",
    selector: (row) => row?.downPayment ? Number(row.downPayment).toLocaleString() : "-",
    sortable: true,
    exportSelector: (row) => row?.downPayment || 0,
  },
  {
    name: "القسط الشهري",
    selector: (row) => row?.monthlyInstallment ? Number(row.monthlyInstallment).toLocaleString() : "-",
    sortable: true,
    exportSelector: (row) => row?.monthlyInstallment || 0,
  },
  {
    name: "العملاء",
    selector: (row) => row?.customers?.map(c => c.fullName || c.name).join(", ") || "-",
    sortable: true,
  },
  
         {
        name: "تفاصيل الشقه",
        selector: (row) => row?.FloorDetails,
      },
      {
        name: "ملاحظات",
        selector: (row) => row?.propertyNote,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => format(new Date(row.createdAt ), "dd MMMM, yyyy"),
     
      },
  
    
    ];

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <HeadPagestyle
        pageName="الشقق"
        isAdmin={isAdmin}
        CanAdd={CanAdd}
        to="/Add-property"
        title="إضافة شقة"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">عدد الشقق</p>

              <h2 className="text-3xl font-bold">{properties.length}</h2>
            </div>

            <FiHome size={40} />
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpenFilter(!openFilter)}
        className="bg-main text-white px-5 py-3 rounded-2xl flex items-center gap-2"
      >
        {openFilter ? <FiX /> : <FiFilter />}
        الفلاتر
      </button>

      {openFilter && (
        <FiltertionHook
          filteredData={filteredData}
          columns={columnsfile}
          filters={filters}
          params={params}
          setParams={setParams}
        />
      )}

      <div className="bg-white rounded-[30px] border shadow-sm overflow-hidden">
        <CustomeTabel data={filteredData} columns={columns} />
      </div>

      <div className="xl:hidden grid gap-5">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow border overflow-hidden"
          >
            <img src={getImage(item)} className="w-full h-56 object-cover" />

            <div className="p-5 space-y-4">
              <h2 className="text-2xl font-bold">{item.unitName}</h2>

              <p>
                المشروع:
                <span className="font-bold"> {item.projectName}</span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl">
                  الغرف
                  <b>{item.rooms}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  الحمامات
                  <b>{item.bathrooms}</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  المساحة
                  <b>{item.area} م²</b>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  الطابق
                  <b>{item.floor}</b>
                </div>
              </div>

              <h3 className="text-main text-xl font-bold">
                {Number(item.price || 0).toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetProperties;
