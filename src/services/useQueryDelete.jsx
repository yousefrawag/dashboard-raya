import authFetch from "../utils/axiosAuthfetch"
import {useMutation , useQueryClient} from "@tanstack/react-query"
import { toast } from 'react-hot-toast';
const useQueryDelete = (endpoint  , key ) => {
    const queryClient = useQueryClient();
    const {isError , mutate:deleteIteam , isLoading} = useMutation({
  mutationFn: async (id) => {
    return new Promise((resolve, reject) => {
      const confirmed = window.confirm("هل أنت متأكد أنك تريد الحذف؟");
      if (!confirmed) return toast.error("تم إلغاء العملية من قبل المستخدم");

      authFetch.delete(`/${endpoint}/${id}`)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  },
  onSuccess: () => {
            queryClient.invalidateQueries({queryKey:[`${key}`]})

    toast.success("تم الحذف بنجاح ✅");

  },
  onError: (err) => {
    toast.error(err?.message || "حدث خطأ أثناء الحذف ❌");
  }
    })

  return{ 
 isError , isLoading , deleteIteam
}
}

export default useQueryDelete