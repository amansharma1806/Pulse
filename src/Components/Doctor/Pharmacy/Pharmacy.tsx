import React, { useEffect, useState } from 'react';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { medicineCategories, medicineType } from '../../../Data/DropdownData';
import { addMedicine, getAll } from '../../../Service/PharmacyService';
import { errorNotication, successNotication } from '../../../Utility/NotificationUtil';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  category: string;
  type: string;
  manufacturer: string;
  unitPrice: number;
}

const Pharmacy = () => {
  const [showForm, setShowForm] = useState(false);
  const [medicineList, setMedicineList] = useState<Medicine[]>([]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    dosage: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    manufacturer: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  useEffect(() => {
    loadMedicineList();
  }, []);

  const loadMedicineList = () => {
    getAll()
      .then((response) => {
        console.log('Medicine Response:', response);
        // Adjust if axiosInstance wraps .data itself
        const data: Medicine[] = Array.isArray(response) ? response : response.data;
        setMedicineList(data);
      })
      .catch(() => {
        errorNotication('Failed to fetch medicines');
      });
  };

  const form = useForm({
    initialValues: {
      name: '',
      dosage: '',
      category: '',
      type: '',
      manufacturer: '',
      unitPrice: 0,
    },
    validate: {
      name: (v:any) => (v ? undefined : 'Name is required'),
      dosage: (v:any) => (v ? undefined : 'Dosage is required'),
      category: (v:any) => (v ? undefined : 'Category is required'),
      type: (v:any) => (v ? undefined : 'Type is required'),
      manufacturer: (v:any) => (v ? undefined : 'Manufacturer is required'),
      unitPrice: (v:any) => (v > 0 ? undefined : 'Unit price must be greater than 0'),
    },
  });

  const handleSubmit = (values: any) => {
    addMedicine(values)
      .then(() => {
        form.reset();
        successNotication('Medicine added successfully');
        setShowForm(false);
        loadMedicineList();
      })
      .catch((err) => {
        errorNotication(err.response?.data?.message || 'Could not add medicine');
      });
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGlobalFilterValue(val);
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value: val },
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {!showForm ? (
        <div className="flex gap-4 mb-4">
          <Button leftSection={<></>} onClick={() => setShowForm(true)}>Add Medicine</Button>
          <Button onClick={loadMedicineList}>Refresh List</Button>
          <TextInput
            placeholder="Global Search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            style={{ width: 300 }}
          />
        </div>
      ) : (
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="bg-white shadow-md rounded-xl p-8 w-full max-w-md grid grid-cols-1 gap-5 mb-4"
        >
          <TextInput label="Name" {...form.getInputProps('name')} />
          <TextInput label="Dosage" {...form.getInputProps('dosage')} />

          <Select label="Category" data={medicineCategories} {...form.getInputProps('category')} />

          <Select label="Type" data={medicineType} {...form.getInputProps('type')} />

          <TextInput label="Manufacturer" {...form.getInputProps('manufacturer')} />

          <NumberInput label="Unit Price" min={0} {...form.getInputProps('unitPrice')} />

          <Button type="submit" className="w-full">Submit</Button>
          <Button color="red" variant="outline" onClick={() => setShowForm(false)}>Close</Button>
        </form>
      )}

      <div className="w-full mt-6">
        <DataTable
          value={medicineList}
          paginator rows={10}
          dataKey="id"
          stripedRows
          size="small"
          filters={filters}
          globalFilterFields={['name', 'dosage', 'category', 'type', 'manufacturer']}
          emptyMessage="No medicines found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column field="id" header="Id" sortable filter filterPlaceholder="Id" style={{ minWidth: '6rem' }} />
          <Column field="name" header="Name" sortable filter filterPlaceholder="Name" style={{ minWidth: '10rem' }} />
          <Column field="dosage" header="Dosage" sortable filter filterPlaceholder="Dosage" style={{ minWidth: '8rem' }} />
          <Column field="category" header="Category" sortable filter filterPlaceholder="Category" style={{ minWidth: '10rem' }} />
          <Column field="type" header="Type" sortable filter filterPlaceholder="Type" style={{ minWidth: '10rem' }} />
          <Column field="manufacturer" header="Manufacturer" sortable filter filterPlaceholder="Manufacturer" style={{ minWidth: '12rem' }} />
          <Column field="unitPrice" header="Unit Price" sortable filter filterPlaceholder="Price" style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    </div>
  );
};

export default Pharmacy;
