import { toast } from "react-toastify"

export const handleError =(error:any) => {
toast.error(error?.data?.message)
}
