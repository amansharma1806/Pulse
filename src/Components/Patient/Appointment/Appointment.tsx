

import dayjs from 'dayjs';

import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { TextInput, Button, Modal, Select, Textarea, LoadingOverlay, ActionIcon, Text, SegmentedControl } from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { getDoctorDropdown } from '../../../Service/DoctorProfileService';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { appointmentReasons } from '../../../Data/DropdownData';
import { useSelector } from 'react-redux';
import { cancelAppointment, getAppointmentByPatient, scheduleAppointment } from '../../../Service/AppointmentService';
import { errorNotication, successNotication } from '../../../Utility/NotificationUtil';
import { formatDateWithTime } from '../../../Utility/DateUtility';
import { modals } from '@mantine/modals';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { Toolbar } from 'primereact/toolbar';
interface Country {
  name: string;  
  code: string;
}

interface Representative {
  name: string;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

const Appointment = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointment, setAppointment] = useState<any[]>([]);
  const user = useSelector((state: any) => state.user);
  const [tab,setTab]=useState<string>("Today");
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    doctorName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    reason: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    status: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
 
  const getSeverity = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return 'danger';

      case 'COMPLETED':
        return 'success';

      case 'SCHEDULED':
        return 'info';

      default:
        return null;
    }
  };
const fetchData=()=>{
   getAppointmentByPatient(user.profileId).then((data) => {
      console.log(data);
      setAppointment(getCustomers(data));
    }).catch((error) => {
      console.error('Error fetching appointments:', error);
    });
}
  useEffect(() => {
   
   fetchData();
    getDoctorDropdown().then((data) => {
      console.log(data);
      setDoctors(data.map((doctor: any) => ({
        value: "" + doctor.id,
        label: doctor.name
      })));
    }).catch((error) => {
      console.error('Error fetching doctors:', error);
    });

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCustomers = (data: Customer[]) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);

      return d;
    });
  };



  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters: any = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };




 
 
  const statusBodyTemplate = (rowData: Customer) => {
    return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
  };

 

  

const handleDelete = (rowData: any) => {
modals.openConfirmModal({
  title: <span className='text-xl font-serif font-semibold'>Are You Sure</span>,
  centered: true,
  children: (
    <Text>
       you want to delete this appointment?This action cannot be undone.
    </Text>
  ),
  labels:{confirm:'Confirm',cancel:'Cancel'},
  onConfirm:()=>{
    cancelAppointment(rowData.id).then(()=>{
      successNotication("Appointment Cancelled Succesfully");
      setAppointment(appointment.map((app)=>
      app.id===rowData.id?{...app,status:"CANCELLED"}:app));
    }).catch((error)=>{
      errorNotication(error.response?.data?.errorMessage||"Filed to cancel Appointment");
    });
  },
});
}
  const actionBodyTemplate = (rowData:any) => {
    return <div className='flex gap-2 justify-center'>
      <ActionIcon>
        <IconEdit size={20} stroke={1.5} />
      </ActionIcon>
      <ActionIcon color='red' onClick={()=>handleDelete(rowData)}>
        <IconTrash size={20} stroke={1.5}/>
      </ActionIcon>
    </div>
  };

  const form = useForm({
    initialValues: {
      doctorId: '',
      patientId: user.profileId,
      appointmentTime: new Date(),
      reason: '',
      notes: ""
    },

    validate: {
      doctorId: (value: any) => (value ? undefined : 'Doctor is required'),
      appointmentTime: (value: any) => (value ? undefined : 'Appointment time is required'),
      reason: (value: any) => (value ? undefined : 'Reason for appointment is required'),
      //notes: (value) => (value ? null : 'Notes are required'),
    },
  });


const handleSubmit = (values: any) => {
  console.log('Form submitted with values:', values);

  // Convert appointmentTime to ISO-compatible string
  const payload = {
    ...values,
    appointmentTime: dayjs(values.appointmentTime).format('YYYY-MM-DDTHH:mm:ss'),
  };

  setLoading(true);
  scheduleAppointment(payload)
    .then((data) => {
      close();
      form.reset();
      fetchData();
      successNotication("Appointment Scheduled Successfully");
    })
    .catch((error) => {
      errorNotication(error.response?.data?.message || "An error occurred while scheduling the appointment.");
    })
    .finally(() => {
      setLoading(false);
    });
};

const timeTemplate = (rowData: any) => {
  return <span>{formatDateWithTime(rowData.appointmentTime)}</span>
}
const leftToolbarTemplate=()=>{
  return (
    <Button leftSection={<IconPlus/>} onClick={open} variant='filled'>Scheduled Appointment</Button>
  );
};
const rightToolbarTemplate=()=>{
return         <TextInput leftSection={<IconSearch />} fw={500} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />;

};
const centerToolbarTemplate=()=>{
return <SegmentedControl
value={tab}
variant='filled'
color='primary'
onChange={setTab}
data={["Today","Upcoming","Past"]}
/>
};
const filteredAppointments = appointment.filter((app)=>{
  const appointmentDate=new Date(app.appointmentTime);
  const today=new Date();
  today.setHours(0,0,0,0);
  const appointmentDay=new Date(appointmentDate);
  appointmentDay.setHours(0,0,0,0);
  if(tab==="Today"){
   return appointmentDay.getTime()===today.getTime(); 
  }else if(tab==="Upcoming"){
    return appointmentDay.getTime()>today.getTime();
  }else if(tab==="Past"){
    return appointmentDay.getTime()<today.getTime();
  }
  return true;

})

  return (
    <div className="card">
      <Toolbar className='mb-4' start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
      <DataTable stripedRows value={filteredAppointments} size='small' paginator rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]} dataKey="id" 
        
        filters={filters} filterDisplay="menu" globalFilterFields={['doctorName', 'reason', 'notes', 'status']}
        emptyMessage="No customers found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
        <Column field="doctorName" header="Doctor" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
        <Column field='appointmentTime' header="Appointment Time" sortable   style={{ minWidth: '14rem' }} body={timeTemplate}  />
        <Column field='reason' header="Reason" sortable filterField='reason' filter filterPlaceholder='Search by reason' style={{ minWidth: '14rem' }} />
        <Column field="notes" header="Notes" sortable filterField='notes' filter filterPlaceholder='Search by notes'  style={{ minWidth: '14rem' }} />
        <Column field='status' header="Status" sortable filterField='status' filter  filterMenuStyle={{ minWidth: '12rem' }} style={{ minWidth: '14rem' }} body={statusBodyTemplate} />


       
    <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} /> 
      </DataTable>
      <Modal opened={opened} size="lg" onClose={close} title={<div className='text-xl font-semibold text-primary-500'>Schedule Appointment</div>} centered>

        <LoadingOverlay visible={loading} zIndex={400} overlayProps={{radius:"sm",blur:2}}/>
        <form onSubmit={form.onSubmit(handleSubmit)} className='grid grid-cols-1 gap-5'>
          <Select {...form.getInputProps("doctorId")} withAsterisk data={doctors} label="Doctor" placeholder='Select Doctor' />
          <DateTimePicker minDate={new Date()} {...form.getInputProps("appointmentTime")} withAsterisk label="Appointment Time" placeholder='Pick date and time' />
          <Select {...form.getInputProps("reason")} data={appointmentReasons} withAsterisk label="Reason for Appointment" placeholder='Enter Reason for Appointment' />
          <Textarea {...form.getInputProps("notes")} label="Additional Notes" placeholder='Enter Any Additional notes' />
          <Button type="submit" variant='filled' className='w-full' >Submit</Button>
        </form>

      </Modal>
    </div>
  );
}


export default Appointment;