import React from 'react';
import QuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const GetFullAplication = () => {
  const { id } = useParams();
  const { data, isLoading } = QuerygetSpacficIteam("jop", "jop", id);
const currentItem = data?.data
  if (isLoading) return <div className="p-10 text-center">جاري تحميل بيانات المتقدم...</div>;
  if (!currentItem) return <div className="p-10 text-center text-red-500">لم يتم العثور على البيانات</div>;

  // دالة مساعدة لعرض الـ Boolean بشكل نصي جذاب
  const renderCheck = (val) => val ? 
    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✔ نعم</span> : 
    <span style={{ color: '#dc3545', fontWeight: 'bold' }}>✖ لا</span>;

  return (
    <div style={{ padding: '20px', direction: 'rtl', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>{currentItem?.personalInfo?.fullName}</h1>
          <p style={{ color: '#666', margin: '5px 0' }}>مقدم على وظيفة: <strong>{currentItem?.jobDetails?.appliedPosition}</strong></p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <span style={{ padding: '8px 15px', borderRadius: '20px', backgroundColor: '#e3f2fd', color: '#0d47a1', fontWeight: 'bold' }}>
            {currentItem?.applicationStatus || 'جديد'}
          </span>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>تاريخ التقديم: {format(new Date(currentItem?.createdAt), "dd MMMM yyyy")}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* 1. المعلومات الشخصية والوظيفية */}
        <Section cardTitle="المعلومات الأساسية">
          <InfoRow label="الهاتف" value={currentItem?.personalInfo?.phoneNumber} />
          <InfoRow label="البريد الإلكتروني" value={currentItem?.personalInfo?.email} />
          <InfoRow label="مكان السكن" value={currentItem?.personalInfo?.address} />
          <InfoRow label="الحالة الاجتماعية" value={currentItem?.personalInfo?.maritalStatus} />
          <InfoRow label="نوع العمل المطلوب" value={currentItem?.jobDetails?.employmentType} />
          <InfoRow label="كيف سمعت عنا" value={currentItem?.jobDetails?.referralSource} />
        </Section>

        {/* 2. المؤهلات العلمية */}
        <Section cardTitle="المؤهلات العلمية">
          <InfoRow label="آخر شهادة" value={currentItem?.education?.lastDegree} />
          <InfoRow label="التخصص" value={currentItem?.education?.specialization} />
          <InfoRow label="المؤسسة التعليمية" value={currentItem?.education?.institution} />
          <div style={{ marginTop: '10px' }}>
            <strong>الدورات:</strong>
            <ul style={{ paddingRight: '20px', marginTop: '5px' }}>
              {currentItem?.education?.courses?.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </Section>

        {/* 3. الخبرة والمهارات (الفلترة الذكية) */}
        <Section cardTitle="الخبرات والمهارات">
          <InfoRow label="خبرة تسويق عقاري" value={renderCheck(currentItem?.experience?.hasRealEstateExp)} />
          <InfoRow label="متابعة عملاء" value={renderCheck(currentItem?.experience?.hasCustomerFollowUpExp)} />
          <InfoRow label="خبرة CRM" value={renderCheck(currentItem?.experience?.hasCrmExp)} />
          <InfoRow label="امتلاك لابتوب" value={renderCheck(currentItem?.techAndAI?.ownsLaptop)} />
          <InfoRow label="تحليل بيانات بالـ AI" value={renderCheck(currentItem?.techAndAI?.knowsAIDataAnalysis)} />
          <div style={{ marginTop: '15px' }}>
            <strong>المهارات التقنية:</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {currentItem?.experience?.technicalSkills?.map((s, i) => <Badge key={i} text={s} color="#673ab7" />)}
            </div>
          </div>
        </Section>

        {/* 4. الجاهزية والالتزام */}
        <Section cardTitle="الجاهزية للعمل">
          <InfoRow label="يعمل حالياً؟" value={renderCheck(currentItem?.readiness?.isCurrentlyEmployed)} />
          <InfoRow label="قبول نظام الأهداف" value={renderCheck(currentItem?.readiness?.acceptsTargets)} />
          <div style={{ marginTop: '10px' }}>
            <strong>التزامات أخرى:</strong>
            <p style={{ backgroundColor: '#fffde7', padding: '10px', borderRadius: '5px' }}>{currentItem?.readiness?.otherCommitments || "لا يوجد"}</p>
          </div>
        </Section>
      </div>

      {/* 5. التقييم العملي (Full Width) */}
      <div style={{ marginTop: '20px' }}>
        <Section cardTitle="التقييم العملي والإجابات المقالية">
          <QuestionBox question="كيف تتعامل مع ضغط العمل؟" answer={currentItem?.practicalEvaluation?.pressureHandling} />
          <QuestionBox question="موقف صعب واجهته وكيف حللته؟" answer={currentItem?.practicalEvaluation?.difficultSituation} />
          <QuestionBox question="خطة تطوير العمل خلال 30 يوم؟" answer={currentItem?.practicalEvaluation?.thirtyDaysPlan} />
          <QuestionBox question="ما الذي يجعلك مختلفاً؟" answer={currentItem?.practicalEvaluation?.uniqueValue} />
        </Section>
      </div>
    </div>
  );
};

// مكونات فرعية بسيطة (Sub-components) للتنظيم
const Section = ({ cardTitle, children }) => (
  <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '15px', color: '#007bff' }}>{cardTitle}</h3>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ color: '#666' }}>{label}:</span>
    <span style={{ fontWeight: '500' }}>{value || 'غير محدد'}</span>
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ backgroundColor: color, color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>{text}</span>
);

const QuestionBox = ({ question, answer }) => (
  <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderRight: '4px solid #007bff' }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{question}</h4>
    <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>{answer || "لم تتم الإجابة"}</p>
  </div>
);

export default GetFullAplication;