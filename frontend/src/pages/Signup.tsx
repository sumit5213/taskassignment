import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

// Validation schema matching RegisterUserDto in backend
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      setServerError('');
      // 1. Register the user
      await API.post('/users/register', values);
      
      // 2. Automatically log them in after successful signup
      const loginRes = await API.post('/users/login', {
        email: values.email,
        password: values.password
      });
      
      login(loginRes.data.token, loginRes.data.user);
      navigate('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 px-4">
      <div className="card w-full max-w-md bg-orange-600 shadow-2xl p-[2px]">
        <div className="card-body bg-base-200 rounded-2xl p-8">
          <div className="flex justify-center mb-2">
             <div className="bg-warning/10 p-3 rounded-full">
                <UserPlus className="text-warning w-8 h-8" />
             </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
          <p className="text-center text-gray-400 mb-6 text-sm">Join the collaborative workspace</p>
          
          {serverError && (
            <div className="alert alert-error py-2 mb-4 text-sm rounded-lg">
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Full Name</span></label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Your name" 
                  className={`input input-bordered w-full pl-10 bg-base-300 focus:border-orange-500 ${errors.name ? 'border-error' : ''}`}
                  {...register('name')}
                />
              </div>
              {errors.name && <span className="text-error text-xs mt-1">{errors.name.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className={`input input-bordered w-full pl-10 bg-base-300 focus:border-orange-500 ${errors.email ? 'border-error' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <span className="text-error text-xs mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Password</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="Create a password" 
                  className={`input input-bordered w-full pl-10 bg-base-300 focus:border-orange-500 ${errors.password ? 'border-error' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && <span className="text-error text-xs mt-1">{errors.password.message}</span>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-warning w-full text-lg font-bold mt-4"
            >
              {isSubmitting ? <span className="loading loading-spinner"></span> : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account? <Link to="/login" className="text-orange-500 hover:underline font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;