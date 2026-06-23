import authFetch from "../utils/axiosAuthfetch"
import {useQuery } from "@tanstack/react-query"
const useQuerygetiteams = (endpoint  , key  , params) => {
    
    const {isError , data, isLoading , refetch} = useQuery({
            queryKey:[`${key}` , params],
        queryFn: async () => {
            const resp = await authFetch(`/${endpoint}/` , {params} )
            // console.log(resp);
            return resp
        },
            
            
     
    })
  return{ 
 isError , isLoading , data ,refetch
}
}

export default useQuerygetiteams