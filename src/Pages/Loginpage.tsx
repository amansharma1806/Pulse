import React from 'react';
import { IconHeartbeat } from "@tabler/icons-react";
import { TextInput, Checkbox, Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PasswordInput } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../Service/UserService';
import { errorNotication, successNotication } from '../Utility/NotificationUtil';
import { useDispatch } from 'react-redux';
import { setJwt } from '../Slices/JwtSlice';
import { jwtDecode } from 'jwt-decode';
import { setUser } from '../Slices/UserSlice';

const LoginPage = () => {
  const dispatch=useDispatch();
   const navigate=useNavigate();
    const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value: string)=>(!value?"Password is required":null)
    },
  });
   const handleSubmit=(values:typeof form.values)=>{
loginUser(values).then((_data)=>{
  successNotication("Logged in Successfully.");
  dispatch(setJwt(_data))
  dispatch(setUser(jwtDecode(_data)));
}).catch((error)=>{
  errorNotication(error?.response?.data?.errormessage);
})    };
  return (
    <div style={{background:'url("/bg.jpg")'}} className='h-screen w-screen !bg-cover !bg-center !bg-no-repeat flex flex-col items-center justify-center'>
         <div className="  py-3 text-pink-500 flex gap-1 items-center ">
                <IconHeartbeat size={45} stroke={2.5} />
                <span className="font-heading text-4xl font-semibold ">
                    Pulse
                </span>
            </div>
        <div className='w-[450px] backdrop-blur-md p-10 py-8 rounded-lg'>
<form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-5 [&_input::placeholder]:text-neutral-100 [&_.mantine-Input-input]:border-white focus-within:[&_.mantine-Input-input]:border-pink-400 [&_.mantine-Input-input]:border [&_input]:pl-2 [&_svg]:text-white [&_input]:text-white">
    <div className='self-center font-medium font-heading text-white text-xl'>
        Login
    </div>
    <TextInput {...form.getInputProps('email')} className='transition duration-300'
      placeholder="Email"
      variant="unstyled"
      radius="md"
      size="md"
      
    />
     <PasswordInput {...form.getInputProps('password')} className='transition duration-300'
      placeholder="Password"
      variant="unstyled"
      radius="md"
      size="md"
      
    />
  <Button radius="md" size='md' type='submit' color='pink'>Login</Button>
<div className='text-neutral-100 text-sm self-center'>Doesn't have any account ?<Link to="/register" className='hover:underline'>
Register</Link></div>
</form>
        </div>
    </div>
  );
};

export default LoginPage;
