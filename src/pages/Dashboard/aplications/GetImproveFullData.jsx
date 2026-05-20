import React from "react";
import QuerygetSpacficIteam from "../../../services/QuerygetSpacficIteam";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border p-5">
    <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="flex justify-between text-sm border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">
      {value || "—"}
    </span>
  </div>
);

const BadgeList = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items?.length > 0 ? (
      items.map((item, i) => (
        <span
          key={i}
          className="px-2 py-1 text-xs bg-gray-100 rounded-full"
        >
          {item}
        </span>
      ))
    ) : (
      <span className="text-xs text-gray-400">لا يوجد</span>
    )}
  </div>
);

const GetImproveFullData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = QuerygetSpacficIteam(
    "improve",
    "improve",
    id
  );

  const item = data?.data

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  if (!item) {
    return <div className="p-6 text-red-500">لا يوجد بيانات</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {item?.basicInfo?.name}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-sm px-4 py-2 bg-gray-100 rounded-lg"
        >
          رجوع
        </button>
      </div>

      {/* Basic Info */}
      <Section title="البيانات الأساسية">
        <Field label="الاسم" value={item?.basicInfo?.name} />
        <Field label="القسم" value={item?.basicInfo?.department} />
        <Field label="سنوات الخبرة" value={item?.basicInfo?.experienceYears} />
        <Field label="المسمى الوظيفي" value={item?.basicInfo?.jobTitle} />
        <Field label="رقم التواصل" value={item?.basicInfo?.phone} />

        <div>
          <span className="text-gray-500 text-sm">المنصات</span>
          <BadgeList items={item?.basicInfo?.platforms} />
        </div>
      </Section>

      {/* General Idea */}
      <Section title="الأفكار العامة">
        <Field label="هل لديه فكرة" value={item?.generalIdeas?.hasIdea} />
        <Field label="مجال الفكرة" value={item?.generalIdeas?.ideaField} />
        <Field label="تفاصيل الفكرة" value={item?.generalIdeas?.ideaDetails} />
      </Section>

      {/* Idea Analysis */}
      <Section title="تحليل الفكرة">
        <Field label="الهدف" value={item?.ideaAnalysis?.goal} />
        <Field label="طريقة التنفيذ" value={item?.ideaAnalysis?.executionMethod} />

        <div>
          <span className="text-gray-500 text-sm">الموارد المطلوبة</span>
          <BadgeList items={item?.ideaAnalysis?.requiredResources} />
        </div>
      </Section>

      {/* Current Evaluation */}
      <Section title="تقييم الوضع الحالي">
        <Field label="التقييم العام" value={item?.currentEvaluation?.overallRating} />

        <div>
          <span className="text-gray-500 text-sm">المشاكل</span>
          <BadgeList items={item?.currentEvaluation?.mainProblems} />
        </div>
      </Section>

      {/* Marketing Section */}
      <Section title="القسم التسويقي">
        <Field label="هل لديه فكرة" value={item?.marketingSection?.hasMarketingIdea} />
        <Field label="نوع الفكرة" value={item?.marketingSection?.ideaType} />
        <Field label="تفاصيل الفكرة" value={item?.marketingSection?.marketingIdeaDetails} />
      </Section>

      {/* Marketing Analysis */}
      <Section title="تحليل الفكرة التسويقية">
        <Field label="الهدف" value={item?.marketingAnalysis?.goal} />
        <Field label="خطوات التنفيذ" value={item?.marketingAnalysis?.executionSteps} />

        <div>
          <span className="text-gray-500 text-sm">الأدوات</span>
          <BadgeList items={item?.marketingAnalysis?.tools} />
        </div>
      </Section>

      {/* Marketing Evaluation */}
      <Section title="تقييم التسويق الحالي">
        <Field label="التقييم" value={item?.marketingEvaluation?.rating} />

        <div>
          <span className="text-gray-500 text-sm">نقاط الضعف</span>
          <BadgeList items={item?.marketingEvaluation?.weaknesses} />
        </div>
      </Section>

      {/* Extra Ideas */}
      <Section title="أفكار إضافية">
        <div>
          <span className="text-gray-500 text-sm">طرق جذب العملاء</span>
          <BadgeList items={item?.extraMarketingIdeas?.customerAttraction} />
        </div>

        <Field label="أفكار الترويج" value={item?.extraMarketingIdeas?.promotionIdeas} />
        <Field label="زيادة التفاعل" value={item?.extraMarketingIdeas?.engagementIdeas} />
      </Section>

      {/* Content */}
      <Section title="المحتوى والمنصات">
        <Field label="المنصة الأساسية" value={item?.contentPlatforms?.mainPlatform} />
        <Field label="فكرة محتوى" value={item?.contentPlatforms?.newContentIdea} />
      </Section>

      {/* Creativity */}
      <Section title="الإبداع">
        <Field label="بميزانية مفتوحة" value={item?.creativity?.unlimitedBudgetIdea} />
        <Field label="فكرة مجنونة" value={item?.creativity?.crazyIdea} />
      </Section>

      {/* Motivation */}
      <Section title="التحفيز">
        <div>
          <span className="text-gray-500 text-sm">ما يحفزه</span>
          <BadgeList items={item?.motivation?.motivators} />
        </div>

        <Field label="هل يحب التنفيذ" value={item?.motivation?.likesToImplement} />
      </Section>

      {/* Footer */}
      <div className="text-xs text-gray-400 text-center pt-4">
        تم الإرسال في:{" "}
        {format(new Date(item.createdAt), "dd MMM yyyy - hh:mm a")}
      </div>
    </div>
  );
};

export default GetImproveFullData;