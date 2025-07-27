import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { dosageFrequencies, symptoms, tests } from '../../../Data/DropdownData';
import { IconEye, IconSearch, IconTrash } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { createAppointmentReport, getReportsByPatientId, isReportExists } from '../../../Service/AppointmentService';
import { errorNotication, successNotication } from '../../../Utility/NotificationUtil';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../Utility/DateUtility';

type Medicine = {

  name: string;
  medicineId?: number;
  dosage: string;
  frequency: string;
  duration: number; // in days
  route: string// e.g., oral, intravenous
  type: string; // e.g., tablet, syrup, injection
  instructions: string;
  prescriptionId?: number;
}
const ApReport = ({appointment}:any) => {
const navigate = useNavigate();

const [filters, setFilters] = useState<DataTableFilterMeta>({

global: { value: null, matchMode: FilterMatchMode.CONTAINS },

}); const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {

const value = e.target.value;

let _filters: any = { ...filters };

_filters['global'].value = value;

setFilters(_filters);

setGlobalFilterValue(value);

};
  const dispatch=useDispatch();
  const [data,setData]=useState<any[]>([]);
  const [loading,setLoading]=useState(false);
  const [allowAdd,setAllowAdd]=useState<boolean>(false);
  const [edit,setEdit]=useState<boolean>(false);
  const form = useForm({

    initialValues: {

      symptoms: [],

      tests: [],

      diagnosis: '',

      referral: '',

      notes: '',

      prescription: {

        medicines: [] as Medicine[]

      }

    },

    validate: {
      symptoms: (value: any[]) => (value.length > 0 ? null : 'Please select at least one symptom'),

      diagnosis: (value: string) => (value?.trim() ? null : 'Diagnosis is required'),

      prescription: {
        medicines: {
          name: (value: string) => (value?.trim() ? null : 'Medicine name is required'),
          dosage: (value: string) => (value?.trim() ? null : 'Dosage is required'),
          duration: (value: number) => (value > 0 ? null : 'Duration must be greater than 0'),
          frequency: (value: string) => (value ? null : 'Frequency is required'),
          route: (value: string) => (value ? null : 'Route is required'),
          type: (value: string) => (value ? null : 'Type is required'),
          instructions: (value: string) => (value?.trim() ? null : 'Instructions are required')
        }
      }
    }

  })
  const insertMedicine = () => {

    form.insertListItem('prescription.medicines', {
      name: '', dosage: '', frequency: '',

      duration: 0, route: '', type: '', instructions: ''
    });

  }

  const removeMedicine = (index: number) => {

    form.removeListItem('prescription.medicines', index);

  }
  useEffect(() => {
   if (!appointment?.patientId) return;

fetchData();

}, [appointment?.patientId,appointment.id]);
const fetchData=()=>{

getReportsByPatientId(appointment?.patientId).then((res) => {


setData(res);

}).catch((err) => {

console.error("Error fetching reports:", err);

});
isReportExists(appointment.id).then((res) => {

setAllowAdd(!res);


}).catch((err) => {

console.error("Error checking report existence:", err);

setAllowAdd(true);

});
}
  const handleSubmit=(values:typeof form.values)=>{
let data = {

...values,

doctorId: appointment.doctorId,

patientId: appointment.patientId,

appointmentId: appointment.id,

prescription: {

...values.prescription,

doctorId: appointment.doctorId,

patientId: appointment.patientId,

appointmentId: appointment.id,
}
}

setLoading(true);
createAppointmentReport(data)
.then((res) => {
successNotication("Report created successfully")
form.reset();
setEdit(false);
setAllowAdd(false);
fetchData();
})
.catch((err) => {
  errorNotication (err?.response?.data?.errorMessage || "Failed to create report");
}).finally(()=> {
setLoading (false);
})

}

const renderHeader = () => {

return (

<div className="flex flex-wrap gap-2 justify-between items-center">
{allowAdd&&<Button variant='filled' onClick={()=>setEdit(true)}>Add Report</Button>
}<TextInput leftSection={<IconSearch />} fw={500} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />

</div>
);

};

const actionBodyTemplate = (rowData: any) => {

return <div className='flex gap-2'>

{/* <ActionIcon onClick={() => navigate("/doctor/appointments/" + rowData.appointmentId)} >

<IconEye size={20} stroke={1.5} />

</ActionIcon> */}



</div>

};
const header = renderHeader();

  return (

            <div>
        { !edit?  <DataTable header={header} stripedRows value={data} size='small' paginator rows={10}

        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]} dataKey="id"

        filterDisplay="menu" globalFilterFields={['doctorName', 'reason', 'notes']}

        emptyMessage="No appointment found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">

        <Column field="doctorName" header="Doctor"  />
        <Column field="diagnosis" header="Diagnosis"   />

        <Column field="reportDate" header="Report Date" sortable body={(rowData) => formatDate(rowData.createdAt)} />

        <Column field="notes" header="Notes"  />

        <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle= {{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
        </DataTable>
    : <form onSubmit={form.onSubmit(handleSubmit)} className='grid gap-5'>

      <Fieldset className='grid gap-4 grid-cols-2' legend={<span className="text-lg font-medium text-primary-500">Personal information</span>} radius="md">

        <MultiSelect {...form.getInputProps("symptoms")} className="col-span-2" withAsterisk

          label="Symptoms"

          placeholder="Pick symptoms"

          data={symptoms}

        />

        <MultiSelect {...form.getInputProps("tests")} className="col-span-2"

          label="Tests"

          placeholder="Pick tests"

          data={tests}

        />
        <TextInput {...form.getInputProps("diagnosis")} label="Diagnosis" placeholder='Enter Diagnosis' withAsterisk />
        <TextInput {...form.getInputProps("referral")} label="Referral" placeholder="Enter referral details" />
        <Textarea {...form.getInputProps("notes")} className="col-span-2" label="Notes" placeholder="Enter any additional notes" withAsterisk />
      </Fieldset>
      <Fieldset className="grid gap-5 " legend={<span className="text-lg font-medium text-primary-500"> Prescription </span>} radius="md">

        

       {form.values.prescription.medicines.map((medicine: Medicine, index: number) => (
          <Fieldset legend={
            <div className="flex items-center gap-10">

              <h1 className="text-lg font-medium">Medicine {index + 1} </h1>

              <ActionIcon onClick={() => removeMedicine(index)} variant="filled" color="red" size="lg" >

                <IconTrash />

              </ActionIcon>

            </div>
          }
            className="grid gap-4 col-span-2 grid-cols-2 ">

            <TextInput
             {...form.getInputProps(`prescription.medicines.${index}.name`)}
            label="Medicine" placeholder="Enter medicine name" withAsterisk />

            <TextInput  {...form.getInputProps(`prescription.medicines.${index}.dosage`)} label="Dosage" placeholder="Enter dosage" withAsterisk />

            <Select {...form.getInputProps(`prescription.medicines.${index}.frequency`)}  label="Frequency" placeholder="Enter frequency" withAsterisk data=

              {dosageFrequencies} />

            <NumberInput {...form.getInputProps(`prescription.medicines.${index}.duration`)} label="Duration (days)" min={1} placeholder="Enter duration in days"

              withAsterisk />
            <Select {...form.getInputProps(`prescription.medicines.${index}.route`)} label="Route" placeholder="Select route" withAsterisk data={["Oral", "Intravenous", "Topical", "Inhalation"]} />

            <Select {...form.getInputProps(`prescription.medicines.${index}.type`)} label="Type" placeholder="Select type" withAsterisk data={["Tablet", "Syrup", "Injection", "Capsule", "Ointment"]} />
            <TextInput {...form.getInputProps(`prescription.medicines.${index}.instructions`)} label="Instructions" placeholder="Enter instructions" withAsterisk

            />
          </Fieldset>
        ))}
        <div className='flex items-start col-span-2 justify-center'>
          <Button onClick={insertMedicine} variant="outline" color="blue" className="col-span-2">Add Medicine</Button>

        </div>
        </Fieldset>
        <div className="flex items-center gap-5 justify-center">

<Button loading={loading} type="submit" className="w-full" variant="filled"

color="primary">Submit Report</Button>

<Button loading={loading}  variant="filled" color="red" >Cancel</Button>

</div>

    </form>
}
    </div>
      
  );
};

export default ApReport;