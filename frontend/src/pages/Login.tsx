import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await API.post('/users/login', values);
      login(data.token, data.user);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]"> {/* Deep dark background */}
      
      {/* Orange Outer Frame from your image */}
      <div className="bg-[#c27111] p-10 rounded-[2rem] shadow-2xl w-full max-w-md mx-4">
        
        {/* Dark Inner Card */}
        <div className="bg-[#242424] rounded-2xl p-8 flex flex-col items-center">
          <h2 className="text-white text-3xl font-bold mb-8">Sign In to your Account</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
            
            <div className="form-control">
              <label className="label-text text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Email id" 
                className="input input-bordered bg-transparent border-gray-700 w-full focus:outline-none focus:border-orange-500"
                {...register('email')}
              />
            </div>

            <div className="form-control">
              <label className="label-text text-gray-400 mb-2">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password..." 
                className="input input-bordered bg-transparent border-gray-700 w-full focus:outline-none focus:border-orange-500"
                {...register('password')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="checkbox checkbox-warning border-gray-600 rounded-lg w-5 h-5" 
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="text-sm text-gray-300">Show Password</span>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn bg-[#ff9100] border-none text-black font-bold px-8 hover:bg-[#e68200]">
                Sign In
              </button>
            </div>
          </form>

          <div className="divider before:bg-gray-700 after:bg-gray-700 my-8 text-gray-500 text-sm">OR</div>
          
          <p className="text-gray-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;