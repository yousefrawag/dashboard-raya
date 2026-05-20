import React from 'react';
import useQuerygetSpacficIteam from '../../../services/QuerygetSpacficIteam';
import Loader from '../../common/Loader';

const Teamworkmission = ({ missionid }) => {
    const { data, isLoading } = useQuerygetSpacficIteam("missions", "missions", missionid);
    const Currentitem = data?.data;
    const Team = Currentitem?.assignedTo;

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-4 dark:bg-gray-900 ">
            <h2 className="text-2xl font-bold mb-6">فريق العمل</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Team?.map((item) => (
                    <div key={item?._id} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-sm">
                        <img src={item?.imageURL} alt="user" className="w-16 h-16 rounded-full" />
                        <span className="mt-2 text-lg font-medium">{item?.fullName || item?.name}  - 

                            
                        </span>
                        <span>
 {item?.type ==="admin" ? "أدمن" : item?.type === "employee" ? "مسوق أساسى" :"مسوق تحت التدريب"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teamworkmission;