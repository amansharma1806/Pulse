import axiosInstance from "../Interceptor/AxiosInterceptor";
const addMedicine = async (data: any) => {
return axiosInstance.post('/pharmacy/medicines/add', data)
.then((response: any) => response.data)
.catch((error: any )=> { throw error; })
}
const getAll = async () => {
return axiosInstance.get('/pharmacy/medicines/getAll')
.then((response: any) => response.data)
.catch((error: any )=> { throw error; })
}
export {addMedicine,getAll};