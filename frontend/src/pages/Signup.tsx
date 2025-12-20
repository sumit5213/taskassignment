import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '../utils/validation';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await API.post('/users/register', values);
      navigate('/login');
    } catch (err: any) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="orange-frame w-full max-w-[420px]">
        <div className="inner-card">
          <h2 className="text-white text-3xl font-bold mb-10 text-center">Create Account</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="form-control">
              <label className="label-text text-gray-400 mb-1">Full Name</label>
              <input type="text" className="input input-bordered" {...register('name')} />
            </div>
            <div className="form-control">
              <label className="label-text text-gray-400 mb-1">Email</label>
              <input type="email" className="input input-bordered" {...register('email')} />
            </div>
            <div className="form-control">
              <label className="label-text text-gray-400 mb-1">Password</label>
              <input type="password" className="input input-bordered" {...register('password')} />
            </div>

            <button type="submit" className="btn-primary-orange w-full mt-4">Register</button>
          </form>

          <div className="custom-divider"><span>OR</span></div>
          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-500 font-bold ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;