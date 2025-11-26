/* eslint-disable no-unused-vars */
import authFetch from "../utils/axiosAuthfetch"
import {useMutation , useQueryClient} from "@tanstack/react-query"
const useQueryupdate = (endpoint  , key ) => {
    const queryClient = useQueryClient();
    const {isError , mutate:updateiteam , isLoading  ,isPending , data} = useMutation({
        mutationFn: async ({data , id}) => {
            console.log("from query handel" , id , data);
            await authFetch.put(`/${endpoint}/${id}` , data)},
        onSuccess:(response) => {
            queryClient.invalidateQueries({queryKey:[`${key}`]})
          
        } ,
        onError:(error) => {
            console.log(error);
            

            // Display the error message using toast
       

        }
    })
    
  return{ 
 isError , isLoading , updateiteam , isPending  ,data
}
}

export default useQueryupdate