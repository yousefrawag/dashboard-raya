import authFetch from "../utils/axiosAuthfetch"
import {useQuery } from "@tanstack/react-query"
const useQuerygetiteams = (endpoint  , key  , params) => {
    
    const {isError , data, isLoading} = useQuery({
            queryKey:[`${key}` , params],
        queryFn: async () => {
            const resp = await authFetch(`/${endpoint}/` , {params} )
            // console.log(resp);
            return resp
        },
            
            
     
    })
  return{ 
 isError , isLoading , data
}
}

export default useQuerygetiteams