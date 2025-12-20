import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormValues } from '../../utils/validation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { X, Calendar, Flag, User, FileText } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const queryClient = useQueryClient();

  // Fetch users for the assignment dropdown
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
    defaultValues: { priority: 'Medium', status: 'To Do' }
  });

  const mutation = useMutation({
    mutationFn: (newTask: TaskFormValues) => API.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      reset();
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      {/* Orange Outer Frame */}
      <div className="orange-frame w-full max-w-[500px] relative">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="inner-card">
          <h2 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="text-warning" /> New Task
          </h2>

          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            {/* Title Input */}
            <div className="form-control">
              <label className="label-text text-gray-400 text-xs mb-1 ml-1">Task Title</label>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                className="input input-bordered w-full" 
                {...register('title')} 
              />
              {errors.title && <p className="text-error text-[10px] mt-1">{errors.title.message}</p>}
            </div>

            {/* Description Input */}
            <div className="form-control">
              <label className="label-text text-gray-400 text-xs mb-1 ml-1">Description</label>
              <textarea 
                placeholder="Provide some details..." 
                className="textarea textarea-bordered h-20 bg-[#121212] text-white border-gray-700 focus:border-orange-500" 
                {...register('description')}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Due Date */}
              <div className="form-control">
                <label className="label-text text-gray-400 text-xs mb-1 ml-1 flex items-center gap-1">
                  <Calendar size={12}/> Due Date
                </label>
                <input type="datetime-local" className="input input-bordered text-xs" {...register('dueDate')} />
              </div>

              {/* Priority Selection */}
              <div className="form-control">
                <label className="label-text text-gray-400 text-xs mb-1 ml-1 flex items-center gap-1">
                  <Flag size={12}/> Priority
                </label>
                <select className="select select-bordered text-xs" {...register('priority')}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Assignee Selection */}
            <div className="form-control">
              <label className="label-text text-gray-400 text-xs mb-1 ml-1 flex items-center gap-1">
                <User size={12}/> Assign To
              </label>
              <select className="select select-bordered" {...register('assignedToId')}>
                <option value="">Select a team member</option>
                {users?.map((u: any) => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              {errors.assignedToId && <p className="text-error text-[10px] mt-1">{errors.assignedToId.message}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="btn btn-ghost text-gray-500 hover:text-white px-6"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={mutation.isPending} 
                className="btn-primary-orange"
              >
                {mutation.isPending ? 'Saving...' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;