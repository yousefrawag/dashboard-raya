import React from 'react'
import Addprojectleftsteps from '../Addprojectui/Addprojectleftsteps'
import Updateform from './Updateform'
import useQueryDelete from '../../../services/useQueryDelete';
import useGetUserAuthentications from '../../../middleware/GetuserAuthencations';
import { Link  , useNavigate} from 'react-router-dom';
 import { useDashboardContext } from '../../../context/DashboardProviedr';
 import PopupCheckdelete from '../../common/popupmdules/PopupCheckdelete';
const Updateprojectui = ({id}) => {
  const { deleteIteam } = useQueryDelete("projects", "projects");
    const {  setModuleDelete } =  useDashboardContext()
  
  const { CanAdd, CanDelte, CanEdit, CanView, isAdmin } = useGetUserAuthentications("Projects");
  const navigate = useNavigate()
  const handelDeleate = () => {
    deleteIteam(id)
    return navigate('/projects-main')
  }

  return (
    <section className=" w-full h-full ">
    <div className="w-full h-full">
    
          
                 
                <div  className='flex gap-5 m-5'>
            
                 {
                   isAdmin || CanEdit ?    <Link to={`/edtit-project/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
                   : null
                 }
                     <Link to="/projects-main"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                                 عوده
                                 </Link>
             {
               isAdmin || CanDelte ? 
               <button  type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
               : null
             }
             
                </div>
      <div className="main_project_content flex gap-5 flex-col justify-between w-full h-full">
        <Addprojectleftsteps />
        <div className="bg-white dark:bg-transparent  w-full h-full  shadow-lg rounded-md ">
            <Updateform id={id} />
        </div>
      </div>
    </div>
    <PopupCheckdelete navigatepage="/projects-main" deleteKey="projects" titale="المشروع" id={id} />
                  <span>
                إجراء
               </span>
                
               <div  className='flex gap-5 m-5'>
           
                {
                  isAdmin || CanEdit ?    <Link to={`/edtit-project/${id}`} className='w-20 p-2 bg-main text-white rounded-md text-center'>تعديل</Link>
                  : null
                }
                    <Link to="/projects-main"  className='w-20 p-2 text-center bg-main text-white rounded-md'>
                                عوده
                                </Link>
            {
              isAdmin || CanDelte ? 
              <button type='button' onClick={() => setModuleDelete(true)} className='w-20 p-2 bg-main text-white rounded-md'>حذف</button>
              : null
            }
            
               </div>
  </section>
  )
}

export default Updateprojectui