import React, { useState } from 'react'
import CustomeTabel from '../../components/common/CustomeTabel'
import useQuerygetiteams from '../../services/Querygetiteams'
import useGetUserAuthentications from '../../middleware/GetuserAuthencations'
import Breadcrumb from '../../components/common/Breadcrumbs/Breadcrumb'
import MdouleAddCategoray from "../../components/common/popupmdules/MdouleAddCategoray"
import { useDashboardContext } from '../../context/DashboardProviedr'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdOutlineEditNote } from 'react-icons/md'
import { FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi'
import { format } from 'date-fns'
import useQueryDelete from '../../services/useQueryDelete'
import EditmainCategory from "../../components/common/popupmdules/EditmainCategory"
import Loader from '../../components/common/Loader'

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const LinkCell = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-[300px]">

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={url}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline flex-1 min-w-0"
      >
        <span className="truncate">
          {getDomain(url)}
        </span>

        <FiExternalLink size={14} />
      </a>

      <button
        onClick={handleCopy}
        title={copied ? "تم النسخ" : "نسخ الرابط"}
        className="text-gray-500 hover:text-main transition"
      >
        {copied ? (
          <FiCheck className="text-green-600" size={17} />
        ) : (
          <FiCopy size={17} />
        )}
      </button>

    </div>
  );
};

const Links = () => {
  const { data, isLoading } = useQuerygetiteams("link", "link")
  const { deleteIteam } = useQueryDelete("link", "link")
  const { setmodule, setmainCategory, setEditmaincategory } = useDashboardContext()

  const { CanAdd, CanDelte, CanEdit, isAdmin } =
    useGetUserAuthentications("appCurency")

  const handelEdit = (item) => {
    setmainCategory(item)
    setEditmaincategory(true)
  }

  const columns = [
    {
      name: "وصف الرابط",
      selector: (row) => row?.name,
      cell: (row) => (
        <span className="font-medium">
          {row.name}
        </span>
      )
    },

    {
      name: "الرابط",
      selector: (row) => row?.url,
      grow: 2,
      cell: (row) => <LinkCell url={row.url} />
    },

    {
      name: "تاريخ الإنشاء",
      selector: (row) => row.createdAt,
      cell: (row) => (
        <span>
          {format(new Date(row.createdAt), "dd MMMM, yyyy")}
        </span>
      )
    },

    {
      name: "إجراء",
      selector: (row) => row.procedure,
      cell: (row) => (
        <div className="flex items-center justify-center gap-4">

          {(isAdmin || CanEdit) && (
            <button
              onClick={() => handelEdit(row)}
              className="hover:text-primary"
            >
              <MdOutlineEditNote size={20} />
            </button>
          )}

          {(isAdmin || CanDelte) && (
            <button
              className="hover:text-red-500"
              onClick={() => deleteIteam(row._id)}
            >
              <AiTwotoneDelete size={20} />
            </button>
          )}

        </div>
      )
    }
  ]

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>

      <div className="w-full flex justify-between">

        <Breadcrumb pageName="الروابط" />

        {(isAdmin || CanAdd) && (
          <button
            onClick={() => setmodule(true)}
            className="block text-white bg-main hover:bg-main2 rounded-lg text-sm px-5 py-2.5"
          >
            إضافة رابط جديد
          </button>
        )}

      </div>

      <div className="shadow-md p-3 mt-10">
        <CustomeTabel
          data={data?.data?.data}
          columns={columns}
        />
      </div>

      <MdouleAddCategoray
        fetshkey="link"
        titale="وصف الرابط"
      />

      <EditmainCategory
        fetshkey="link"
        titale="وصف الرابط"
      />

    </div>
  )
}

export default Links