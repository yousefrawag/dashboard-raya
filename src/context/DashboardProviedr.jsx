import { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

const DashboardProvider = ({ children }) => {
    const [module, setmodule] = useState(false);
const [editmainCategory , setEditmaincategory] = useState(false)
const [moduleDelete , setModuleDelete] = useState(false)
const [Deletestauts , setDelteSatuts] = useState("")
const [AsigineclientTouser , setAsigine] = useState(false)
const [mainCategory , setmainCategory] = useState({
    _id:"",
    name:"" ,
    relatedRegions:[]
})
const [expensesmodule , setExpensesmodule] = useState(false)
const [expenssEidt , setExpensesEdit] = useState({})
const [expenseemoduleEdit  , setExpensesmoduleedit] = useState(false)
const handelEditmainCategory = (item) => {
setEditmaincategory(true)
setmainCategory(item)
}
    return (
        <DashboardContext.Provider
            value={{
                module,
                setmodule,
                editmainCategory , 
                setEditmaincategory,
                handelEditmainCategory,
                mainCategory,
                setmainCategory ,
                moduleDelete ,
                setModuleDelete ,
                Deletestauts ,
                setDelteSatuts ,
                expensesmodule ,
                setExpensesmodule ,
                expenssEidt ,
                setExpensesEdit ,
                AsigineclientTouser , setAsigine ,
                expenseemoduleEdit  , setExpensesmoduleedit
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default DashboardProvider;

export const useDashboardContext = () => useContext(DashboardContext);
