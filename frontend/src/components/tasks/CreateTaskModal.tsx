import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormValues } from '../../utils/validation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../api/axios';
import { X } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const queryClient = useQueryClient();

  // Fetch all users for the "Assigned To" dropdown
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
      priority: 'Medium',
      status: 'To Do'
    }
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
    <div className="modal modal-open">
      <div className="modal-box border border-orange-600 bg-base-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-warning">Create New Task</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="form-control">
            <input type="text" placeholder="Task Title" className="input input-bordered" {...register('title')} />
            {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div className="form-control">
            <textarea placeholder="Description" className="textarea textarea-bordered h-24" {...register('description')}></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label-text text-xs mb-1">Due Date</label>
              <input type="datetime-local" className="input input-bordered" {...register('dueDate')} />
            </div>
            <div className="form-control">
              <label className="label-text text-xs mb-1">Priority</label>
              <select className="select select-bordered" {...register('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label-text text-xs mb-1">Assign To</label>
            <select className="select select-bordered" {...register('assignedToId')}>
              <option value="">Select User</option>
              {users?.map((u: any) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
            {errors.assignedToId && <p className="text-error text-xs mt-1">{errors.assignedToId.message}</p>}
          </div>

          <button type="submit" disabled={mutation.isPending} className="btn btn-warning w-full">
            {mutation.isPending ? 'Saving...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
