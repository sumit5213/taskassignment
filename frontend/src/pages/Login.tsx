import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="orange-frame w-full max-w-[420px]">
        <div className="inner-card">
          <h2 className="text-white text-3xl font-bold mb-10 text-center">Sign In to your Account</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control">
              <label className="label-text text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Email id" 
                className="input input-bordered w-full"
                {...register('email')}
              />
            </div>

            <div className="form-control">
              <label className="label-text text-gray-400 mb-2">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password..." 
                className="input input-bordered w-full"
                {...register('password')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-warning" onChange={() => setShowPassword(!showPassword)} />
              <span className="text-sm text-gray-300">Show Password</span>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" className="btn-primary-orange">Sign In</button>
            </div>
          </form>

          <div className="custom-divider"><span>OR</span></div>
          <p className="text-center text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-blue-500 font-bold ml-1">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;