import { Avatar, Button, Divider, Modal, NumberInput, Select, Table, TagsInput, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { bloodGroupH, bloodGroups } from "../../../Data/DropdownData";
import { useDisclosure } from "@mantine/hooks";
import { getPatient, updatePatient } from "../../../Service/PatientProfileService";
import { formatDate } from "../../../Utility/DateUtility";
import { useForm } from "@mantine/form";
import { errorNotication, successNotication } from "../../../Utility/NotificationUtil";
import { arrayToCSV } from "../../../Utility/arrayToCSV";

const Profile = () => {
  const user = useSelector((state: any) => state.user);
  const [editMode, setEdit] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [profile, setProfile] = useState<any>({}); // ✅ Added profile state

  useEffect(() => {
    console.log(user);
    getPatient(user.profileId)
      .then((data: any) => {
        setProfile({...data,allergies: data.allergies ?(JSON.parse(data.allergies)):null, chronicDisease: data.chronicDisease ? (JSON.parse(data.chronicDisease)):null});
        console.log("Patient Profile Data:", data);
      })
      .catch((error: any) => {
        console.error("Error fetching patient profile:", error);
      });
  }, []);
  const form = useForm({
    initialValues: {
      dob: '' ,
      phone: '' ,
      address: '' ,
      aadharNo: '' ,
      bloodGroup: '' ,
      allergies: [] ,
      chronicDisease: [] ,
    },
    validate: {
      dob: (value:any) => !value ?  "Date of birth is required":undefined ,
      phone: (value:any) => !value  ?  "Phone number must be 10 digits":undefined,
      address: (value:any) => !value ?  "Address is required":undefined,
      aadharNo: (value:any)=> !value  ?  "Aadhaar number must be 12 digits":undefined,
       },
  });
  const handleEdit = () => {
    form.setValues({
      ...profile,
      dob: profile.dob ? new Date(profile.dob) : undefined,
      chronicDisease: profile.chronicDisease ?? [],
      allergies: profile.allergies ?? []
    });
    setEdit(true);
  }
  const handleSubmit = (e: any) => {
    let values = form.getValues();
    form.validate();
    if(!form.isValid()) return;

    console.log(values)  ;



    updatePatient({ ...profile,...values,allergies:values.allergies?JSON.stringify(values.allergies):null, chronicDisease: values.chronicDisease?JSON.stringify(values.chronicDisease):null })
      .then((data: any) => {
        successNotication("Profile updated successfully");
        setProfile({...profile,...values}); // Update local profile stat  e with the response
        setEdit(false); // Exit edit mode after successful update
      })
      .catch((error: any) => {
        console.error( error);
          errorNotication(error.response.data.errorMessage );
      });
  };
  return (
    <div className="p-10">
      <div className="flex items-center justify-between ">
        <div className="flex gap-5 items-center ">
          <div className="flex flex-col items-center gap-3">
            <Avatar variant="filled" src="/IMG_2325.JPG" size={130} alt="Profile Picture" />
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
        ) : 
          <Button size="lg" type="submit" onClick={handleSubmit} variant="filled">
            Submit
          </Button>
        }
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
              {editMode ? (
                <Table.Td className="text-xl">
                  <TextInput {...form.getInputProps("address")} placeholder="address" />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{profile.address??"Gram -"}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Aadhaar</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
                  <NumberInput
                    {...form.getInputProps("aadharNo")}
                    clampBehavior="strict"
                    maxLength={12}
                    placeholder="aadhar number"
                    hideControls
                  />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{profile.aadharNo??"123456789101"}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Blood Group</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
<Select {...form.getInputProps("bloodGroup")} placeholder="blood group" data={bloodGroups} />                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{bloodGroupH[profile.bloodGroup]??"-"}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Allergies</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
                  <TagsInput {...form.getInputProps("allergies")} placeholder="Allergies separated by comma" />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{arrayToCSV(profile.allergies)??'-'}</Table.Td>
              )}
            </Table.Tr>

            <Table.Tr>
              <Table.Td className="font-semibold text-xl">Chronic Diseases</Table.Td>
              {editMode ? (
                <Table.Td className="text-xl">
                  <TagsInput {...form.getInputProps("chronicDisease")} placeholder="Chronic Diseases separated by comma" />
                </Table.Td>
              ) : (
                <Table.Td className="text-xl">{arrayToCSV(profile.chronicDisease)??"-"}</Table.Td>
              )}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>

      <Modal centered opened={opened} onClose={close} title={<span className="text-xl font-medium ">Upload Profile Picture</span>}>
        {/* Modal content can go here */}
      </Modal>
    </div>
  );
};

export default Profile;
