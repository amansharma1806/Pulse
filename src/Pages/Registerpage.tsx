import React from 'react';
import { IconHeartbeat } from "@tabler/icons-react";
import { TextInput, SegmentedControl, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PasswordInput } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../Service/UserService';
import { error } from 'console';
import { errorNotication, successNotication } from '../Utility/NotificationUtil';

const RegisterPage = () => {
  type FormValues = {
    name: string;
  role: string;
  email: string;
  password: string;
  confirmpassword: string;
};
  const navigate=useNavigate();

const form = useForm<FormValues>({
  initialValues: {
    name:'',
    role: "PATIENT",
    email: '',
    password: '',
    confirmpassword: '',
  },

  validate: {
    name:(value:string)=>(!value?"Name is required":null),
       email: (value: string) =>
      /^\S+@\S+$/.test(value) ? null : 'Invalid email',
    password: (value: string) =>
  !value
    ? 'Password is required'
    : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(value)
    ? 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
    : null,

    confirmpassword: (value: string, values: FormValues) =>
      value === values.password ? null : "Passwords don't match",
  },
});


  const handleSubmit = (values: typeof form.values) => {
registerUser(values).then((data)=>{
  console.log(data)
  successNotication("Registered Successfully.");
  navigate('/login');
}).catch((error)=>{
  console.log(error);
  errorNotication(error.response.data.errormessage);
})
  };

  return (
    <div
      style={{ background: 'url("/bg.jpg")' }}
      className="h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center"
    >
      <div className="py-3 text-pink-500 flex gap-1 items-center">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading text-4xl font-semibold">
          Pulse
        </span>
      </div>
      <div className="w-[450px] backdrop-blur-md p-10 py-8 rounded-lg">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-5 [&_input::placeholder]:text-neutral-100 [&_.mantine-Input-input]:border-white focus-within:[&_.mantine-Input-input]:border-pink-400 [&_.mantine-Input-input]:border [&_input]:pl-2 [&_svg]:text-white [&_input]:text-white"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Register
          </div>

          {/* Updated SegmentControl options */}
          <SegmentedControl
            {...form.getInputProps('role')}
            fullWidth
            size="md"
            radius="md"
            color="pink"
            bg="none"
            className='[&_*]:!text-white border border-white'
            data={[
              { label: 'Patient', value: 'PATIENT' },
              { label: 'Doctor', value: 'DOCTOR' },
              { label: 'Admin', value: 'ADMIN' },
            ]}
          />
         <TextInput
            {...form.getInputProps('name')}
            className="transition duration-300"
            placeholder="Name"
            variant="unstyled"
            radius="md"
            size="md"
          />
          <TextInput
            {...form.getInputProps('email')}
            className="transition duration-300"
            placeholder="Email"
            variant="unstyled"
            radius="md"
            size="md"
          />

          <PasswordInput
            {...form.getInputProps('password')}
            className="transition duration-300"
            placeholder="Password"
            variant="unstyled"
            radius="md"
            size="md"
          />

          <PasswordInput
            {...form.getInputProps('confirmpassword')}
            className="transition duration-300"
            placeholder="Confirm Password"
            variant="unstyled"
            radius="md"
            size="md"
          />

          <Button radius="md" size="md" type="submit" color="pink">
            Register
          </Button>

          <div className="text-neutral-100 text-sm self-center">
            Have an account?{' '}
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
