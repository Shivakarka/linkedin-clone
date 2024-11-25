import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {toast} from "react-hot-toast";
import { Loader } from "lucide-react";

type FormParams = {
    name: string;
    username: string;
    email: string;
    password: string;
}

const SignUpForm = () => {

const queryClient = useQueryClient();

const [name,setName] = useState('');
const [email,setEmail] = useState('');
const [username,setUsername] = useState('');
const [password,setPassword] = useState('');

const {mutate: signUpMutation, isPending} = useMutation({
    mutationFn: async(data:FormParams) => {
        const response = await axiosInstance.post('/auth/signup',data);
        return response.data;
    },
    onSuccess: (data) => {
        toast.success(data?.message);       
        queryClient.invalidateQueries({queryKey: ["authUser"]});      
    },
    onError: (error) => {            
        toast.error((error as any)?.response?.data?.message);
    }
})
const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signUpMutation({
        name,
        username,
        email,
        password
    })
}

  return (
    <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
        <input
				type='text'
				placeholder='Full name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

            <button type='submit' disabled={isPending} className='btn btn-primary w-full text-white'>
				{isPending ? <Loader className='size-5 animate-spin' /> : "Agree & Join"}
			</button>

    </form>
  )
}

export default SignUpForm;