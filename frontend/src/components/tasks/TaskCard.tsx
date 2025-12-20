import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../api/services/taskApi';
import { Trash2, Clock, User } from 'lucide-react';
import API from '../../api/axios';

const TaskCard = ({ task }: { task: any }) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updates: any) => taskApi.updateTask(task._id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  });

  const deleteMutation = useMutation({
    mutationFn: () => API.delete(`/tasks/${task._id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  });

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Urgent': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-white/5 mb-4 hover:border-warning/30 transition-all">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h4 className={`font-bold text-sm ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-white'}`}>
            {task.title}
          </h4>
          <button onClick={() => deleteMutation.mutate()} className="text-error hover:scale-110 transition-transform">
            <Trash2 size={14} />
          </button>
        </div>
        
        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`badge badge-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
          <span className="badge badge-xs badge-outline">{task.status}</span>
        </div>

        <div className="divider my-2"></div>

        <div className="flex justify-between items-center text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={10} />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User size={10} />
            {task.assignedToId?.name || 'Unassigned'}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <select 
            className="select select-bordered select-xs w-full"
            value={task.status}
            onChange={(e) => updateMutation.mutate({ status: e.target.value })}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;