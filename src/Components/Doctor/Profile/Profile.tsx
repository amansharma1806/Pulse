import {
  Avatar,
  Button,
  Divider,
  Modal,
  NumberInput,
  Select,
  Table,
  TextInput
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { departments, specializations } from "../../../Data/DropdownData";
import { useDisclosure } from "@mantine/hooks";
import { getDoctor, updateDoctor } from "../../../Service/DoctorProfileService";
import { useForm } from "@mantine/form";
import { formatDate } from "../../../Utility/DateUtility";
import { errorNotication, successNotication } from "../../../Utility/NotificationUtil";

const Profile = () => {
  const user = useSelector((state: any) => state.user);
  const [editMode, setEdit] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    getDoctor(user.profileId)
      .then((data) => {
        setProfile({ ...data, dob: data.dob ? new Date(data.dob) : undefined });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const form = useForm({
    initialValues: {
      dob: '',
      phone: '',
      address: '',
      licenseNo: '',
      specialization: '',
      department: '',
      totalExp: '',
    },
    validate: {
      dob: (value: any) => (!value ? 'Date of Birth is required' : undefined),
      phone: (value: any) => (!value ? 'Phone number is required' : undefined),
      address: (value: any) => (!value ? 'Address is required' : undefined),
      licenseNo: (value: any) => (!value ? 'License number is required' : undefined),
    },
  });

  const handleEdit = () => {
    form.setValues({ ...profile,dob: profile.dob ? new Date(profile.dob) : undefined });
    setEdit(true);
  };

  const handleSubmit = (e:any) => {
    let values = form.getValues();
    form.validate();

    if (!form.isValid()) return;

   

    updateDoctor({...profile, ...values})
      .then((_data) => {
        successNotication("Profile updated successfully");
        setProfile({ ...profile, ...values });
        setEdit(false);
      })
      .catch((error) => {
        console.log(error);
        errorNotication("Failed to update profile");
      });
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div className="flex gap-5 items-center">
          <div className="flex flex-col items-center gap-3">
            <Avatar variant="filled" src="/bittudidi.jpeg" size={130} alt="Profile Picture" />
            {editMode && (
              <Button size="sm" onClick={open} variant="filled">
                Upload
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-medium text-neutral-900">{user.name}</div>
            <div className="text-xl text-neutral-700">{user.email}</div>
          </div>
        </div>

        {!editMode ? (
          <Button size="lg" type="button" onClick={handleEdit} variant="filled" leftSection={<IconEdit />}>
            Edit
          </Button>
        ) : (
          <Button size="lg" type="submit" onClick={handleSubmit} variant="filled">
            Submit
          </Button>
        )}
      </div>

      <Divider my="xl" />

      <div>
        <div className="text-2xl font-medium mb-5 text-neutral-900">Personal Information</div>
        <Table striped stripedColor="primary.1" withRowBorders={false} verticalSpacing="md">
          <Table.Tbody className="[&>tr]:!mb-3 [&_td]:!w-1/2">
            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Date of Birth</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
                  <DateInput {...form.getInputProps("dob")} placeholder="Date of birth" />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{formatDate(profile.dob)??'-'}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Phone</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
                  <NumberInput
                    {...form.getInputProps("phone")}
                    clampBehavior="strict"
                    maxLength={10}
                    placeholder="Phone number"
                    hideControls
                  />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{profile.phone??"-"}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Address</Table.Td>
              {editMode ? 
                <Table.Td className="text-xl">
                  <TextInput {...form.getInputProps("address")} placeholder="address" />
                </Table.Td>
              : 
                <Table.Td className="text-xl">{profile.address??"Gram -"}</Table.Td>
              }
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="font-semibold text-xl">License No.</Table.Td>
              {editMode ? 
                <Table.Td className="text-xl">
                  <TextInput {...form.getInputProps("licenseNo")} placeholder="License number" />
                </Table.Td>
               : 
                <Table.Td className="text-xl">{profile.licenseNo??"-"}</Table.Td>
              }
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Specialization</Table.Td>
              {editMode ? 
                <Table.Td className="text-xl">
                  <Select
                    {...form.getInputProps("specialization")}
                    placeholder="Select specialization"
                    data={specializations}
                  />
                </Table.Td>
               : 
                <Table.Td className="text-xl">{profile.specialization??"-"}</Table.Td>
              }
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Department</Table.Td>
              {editMode ? 
                <Table.Td className="text-xl">
                  <Select
                    {...form.getInputProps("department")}
                    placeholder="Select department"
                    data={departments}
                  />
                </Table.Td>
               : 
                <Table.Td className="text-xl">{profile.department??"-"}</Table.Td>
              } 
            </Table.Tr>
            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Total Experience</Table.Td>
              {editMode ? 
                <Table.Td className="text-xl">
                  <NumberInput
                    {...form.getInputProps("totalExp")}
                    clampBehavior="strict"
                    placeholder="Total experience in years"
                    hideControls
                  />
                </Table.Td>
               : 
                <Table.Td className="text-xl">{profile.totalExp??"-"}</Table.Td>
              }
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      <Modal centered opened={opened} onClose={close} title={<span className="text-xl font-medium">Upload Profile Picture</span>}>
        {/* Upload modal content goes here */}
      </Modal>
    </div>
  );
};

export default Profile;
