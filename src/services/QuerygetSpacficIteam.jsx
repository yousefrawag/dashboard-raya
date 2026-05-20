import authFetch from "../utils/axiosAuthfetch"
import {useQuery } from "@tanstack/react-query"
// import { toast } from 'react-hot-toast';
const useQuerygetSpacficIteam = (endpoint  , key  , id , params) => {
    const {isError , data, isLoading  , refetch} = useQuery({
            queryKey:[key , id , params],
        queryFn: async () => {
            
        const {data} = await authFetch(`/${endpoint}/${id}` , {params} )
        return data
        },
    })
  return{ 
 isError , isLoading , data , refetch
}
}

export default useQuerygetSpacficIteam