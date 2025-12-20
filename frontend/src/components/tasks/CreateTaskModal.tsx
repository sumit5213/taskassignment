import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormValues } from '../../utils/validation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { X, Calendar, Flag, User, FileText } from 'lucide-react';

export const CreateTaskModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const queryClient = useQueryClient();
  const minDate = new Date().toISOString().slice(0, 16); 

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await API.get('/users');
      return data;
    },
    enabled: isOpen
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'To Do', 
      assignedToId: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (newTask: TaskFormValues) => API.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['global_tasks'] });
      reset();
      onClose();
    },
    onError: (err: any) => {
      console.error("Submission Error:", err.response?.data);
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4">
      <div className="orange-frame w-full max-w-[500px] relative">
        <div className="inner-card">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-50"
          >
            <X size={20} />
          </button>

          <h2 className="text-white text-3xl font-black mb-8 uppercase tracking-tighter flex items-center gap-2">
            <FileText className="text-warning" /> New Task
          </h2>
          
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4 text-left">
            <div className="form-control">
              <label className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-widest">Task Title</label>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                className="input input-bordered h-12" 
                {...register('title')} 
              />
              {errors.title && <span className="text-error text-[10px] mt-1 font-bold">{errors.title.message}</span>}
            </div>

            <div className="form-control">
              <label className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-widest">Description</label>
              <textarea 
                placeholder="Provide details..." 
                className="textarea textarea-bordered h-24" 
                {...register('description')} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12}/> Due Date
                </label>
                <input 
                  type="datetime-local" 
                  min={minDate} 
                  className="input input-bordered text-xs" 
                  {...register('dueDate')} 
                />
              </div>

              <div className="form-control">
                <label className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-widest flex items-center gap-1">
                  <Flag size={12}/> Priority
                </label>
                <select className="select select-bordered" {...register('priority')}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-widest flex items-center gap-1">
                <User size={12}/> Assign To
              </label>
              <select className="select select-bordered" {...register('assignedToId')}>
                <option value="">Select Member</option>
                {users?.map((u: any) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              {errors.assignedToId && <span className="text-error text-[10px] mt-1 font-bold">{errors.assignedToId.message}</span>}
            </div>

            <input type="hidden" {...register('status')} />

            <button 
              type="submit" 
              className="btn-primary-orange w-full h-12 mt-4 uppercase text-sm tracking-widest"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Confirm & Create'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;