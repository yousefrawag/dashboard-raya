import React from 'react';
import { useParams } from 'react-router-dom';
import Teamworkmission from '../../../components/ui/chat/Teamworkmission';
import Breadcrumb from '../../../components/common/Breadcrumbs/Breadcrumb';
import ChatBox from '../../../components/ui/chat/ChatBox';
import TaskStatuts from './TaskStatuts';
import { useState } from 'react';
import Confetti from "react-confetti";
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../../components/common/Loader';
import MissaionUpdateRequires from './MissaionUpdateRequires';
import UploadFiles from '../../../hooks/UpoladFiles';
const ReportChat = () => {
    const { missionid, chatid } = useParams();
    const {data , isLoading} = useQuerygetSpacficIteam("missions" , "missions" , missionid)
    const CurrentMissionTitle = data?.data?.title
    const [showConfetti, setShowConfetti] = useState(false);
 if(isLoading){
    return <Loader />
 }   
    return (
        <div className="lg:p-4">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className='flex justify-between items-center'>
            <Breadcrumb pageName="التواصل مع الفريق" />
            <TaskStatuts missionid={missionid} setShowConfetti={setShowConfetti} showConfetti={showConfetti}/>
            </div>
         <MissaionUpdateRequires id={missionid} />
            <div className="flex flex-col w-full lg:flex-row  gap-4 mt-4">
                <div className="w-full lg:w-[70%]">
                    <ChatBox CurrentMissionTitle={CurrentMissionTitle} chatid={chatid} />
                </div>
                <div className="w-full lg:w-[30%]">
                    <Teamworkmission missionid={missionid} />
                </div>
            </div>
        </div>
    );
};

export default ReportChat;