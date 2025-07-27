import axiosInstance from "../Interceptor/AxiosInterceptor";
const scheduleAppointment = async (data: any) => {
return axiosInstance.post('/appointment/schedule', data)
.then((response: any) => response.data)
.catch((error: any )=> { throw error; })
}
const cancelAppointment = async (id: any) => {
return axiosInstance.put('/appointment/cancel/' + id)
.then((response: any) => response.data)
.catch((error: any) => { throw error; })
}
const getAppointment = async (id: any) => {
return axiosInstance.get('/appointment/get/' + id)
.then((response: any) => response.data)
.catch((error: any) => { throw error; })
}
const getAppointmentDetails = async (id: any) => {
return axiosInstance.get('/appointment/get/details/' + id)
.then((response: any) => response.data)
.catch((error: any) => { throw error; })
}
const getAppointmentByPatient = async (patientId: any) => {
return axiosInstance.get('/appointment/getAllByPatient/' + patientId)
.then((response: any) => response.data)
.catch((error: any) => { throw error; })
}
const getAppointmentByDoctor = async (doctorId: any) => {
return axiosInstance.get('/appointment/getAllByDoctor/' + doctorId)
.then((response: any) => response.data)
.catch((error: any) => { throw error; })
}

const getphoneemail = async (patientId: any) => {
  return axiosInstance
    .get(`/profile/patient/get/${patientId}`)
    .then((response: any) => response.data)
    .catch((error: any) => {
      throw error;
    });
};
const createAppointmentReport = (data: any) => {

return axiosInstance.post('/appointment/report/create', data)

.then((response: any) => response.data)

.catch((error: any) => { throw error; })

}

const isReportExists = async (appointmentId: any) => {


return axiosInstance.get('/appointment/report/isRecordExists/' + appointmentId)

.then((response: any) => response.data)

.catch((error: any) => { throw error; })
}

const getReportsByPatientId = async (patientId: any) => {



return axiosInstance.get('/appointment/report/getRecordsByPatientId/' + patientId)

.then((response: any) => response.data)

.catch((error: any) => { throw error; })
}

const getPrescriptionsByPatientId = async (patientId: any) => {

return axiosInstance.get('/appointment/report/getPrescriptionsByPatientId/' + patientId)

.then((response: any) => response.data)

.catch((error: any) => { throw error; })}
export { scheduleAppointment, cancelAppointment, getAppointment, getAppointmentDetails ,getAppointmentByPatient,getAppointmentByDoctor,getphoneemail,createAppointmentReport,isReportExists,getReportsByPatientId,getPrescriptionsByPatientId};