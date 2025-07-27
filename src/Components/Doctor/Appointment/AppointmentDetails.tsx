import {
  Badge,
  Breadcrumbs,
  Card,
  Divider,
  Group,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAppointmentDetails } from '../../../Service/AppointmentService';
import { formatDateWithTime } from '../../../Utility/DateUtility';
import { getphoneemail } from '../../../Service/AppointmentService'; // import this correctly
import { IconClipboardHeart, IconStethoscope, IconVaccine } from '@tabler/icons-react';
import ApReport from './ApReport';
import Prescriptions from './Prescriptions';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<any>({});
  const [patientContact, setPatientContact] = useState<any>(null);

  useEffect(() => {
    getAppointmentDetails(id)
      .then((res) => {
        setAppointment(res);

        if (res.patientId) {
          // Fetch phone/email
          getphoneemail(res.patientId)
            .then((contact) => setPatientContact(contact))
            .catch((err) =>
              console.error('Error fetching patient contact:', err)
            );
        }
      })
      .catch((err) => {
        console.error('Error fetching appointment details:', err);
      });
  }, [id]);

  return (
    <div>
      <Breadcrumbs mb="md">
        <Link className="text-primary-400 hover:underline" to="/doctor/dashboard">
          Dashboard
        </Link>
        <Link className="text-blue-500 hover:underline" to="/doctor/appointments">
          Appointments
        </Link>
        <Text>Details</Text>
      </Breadcrumbs>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="sm">
          <Title order={2}>{appointment.patientName}</Title>
          <Badge
            color={appointment.status === 'CANCELLED' ? 'red' : 'green'}
            variant="light"
          >
            {appointment.status}
          </Badge>
        </Group>
        <div className="grid grid-cols-2 gap-5 mb-4">
           {patientContact && (
            <>
              <Text>
                <strong>Email:</strong> {patientContact.email}
              </Text>
              <Text>
                <strong>Phone:</strong> {patientContact.phone}
              </Text>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Text>
            <strong>Reason:</strong> {appointment.reason}
          </Text>

          <Text>
            <strong>Appointment Time:</strong>{' '}
            {formatDateWithTime(appointment.appointmentTime)}
          </Text>

         
        </div>

        {appointment.notes && (
          <Text mt="sm" color="dimmed" size="sm">
            <strong>Notes:</strong> {appointment.notes}
          </Text>
        )}
      </Card>
      <Tabs variant="pills" my="md" defaultValue="medical">

<Tabs.List>

<Tabs.Tab value="medical" leftSection={<IconStethoscope size={20} />}>

Medical History

</Tabs.Tab>

<Tabs.Tab value="prescriptions" leftSection={<IconVaccine size={20} />}>

Prescriptions

</Tabs.Tab>

<Tabs.Tab value="reports" leftSection={<IconClipboardHeart size={20} />}>

Reports

</Tabs.Tab>

</Tabs.List>

<Divider my="md" />

<Tabs.Panel value="medical">

Medical

</Tabs.Panel>
<Tabs.Panel value="prescriptions">

<Prescriptions appointment={appointment} />

</Tabs.Panel>

<Tabs.Panel value="reports">

<ApReport appointment={appointment}/>

</Tabs.Panel>

</Tabs>
    </div>
  );
};

export default AppointmentDetails;
