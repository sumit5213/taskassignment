import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import API from '../../api/axios';
import { X, Edit3, Trash2, Save, History } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  task: any;
  onClose: () => void;
}

const TaskDetailsSidebar = ({ task, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    dueDate: '',
    assignedToId: ''
  });

  const { data: logs } = useQuery({
    queryKey: ['task_logs', task?._id],
    queryFn: () => API.get(`/tasks/${task._id}/logs`).then(res => res.data),
    enabled: !!task?._id
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
        assignedToId: typeof task.assignedToId === 'object' ? task.assignedToId._id : task.assignedToId
      });
      setIsEditing(false);
    }
  }, [task]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => API.put(`/tasks/${task._id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['global_tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task_logs', task._id] });
      toast.success("Task updated successfully!");
      setIsEditing(false);
    },
    onError: () => toast.error("Update failed. Check your connection.")
  });

  const deleteMutation = useMutation({
    mutationFn: () => API.delete(`/tasks/${task._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.error("Task permanently deleted");
      onClose();
    }
  });

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#c27111] pl-2 h-full shadow-2xl">
        <div className="bg-[#1e1e1e] h-full p-8 flex flex-col">
          <button onClick={onClose} className="self-end text-gray-500 hover:text-white mb-6">
            <X size={24} />
          </button>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            <h2 className="text-white text-3xl font-black uppercase tracking-tighter">Task Control</h2>

            {/* Editable Title */}
            <div className="form-control">
              <label className="text-gray-500 text-[10px] font-black uppercase mb-1">Title</label>
              {isEditing ? (
                <input 
                  className="input input-bordered h-12 w-full bg-[#121212] border-gray-800 focus:border-orange-500" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                />
              ) : (
                <p className="text-white text-xl font-bold">{task.title}</p>
              )}
            </div>

            {/* Editable Description */}
            <div className="form-control">
              <label className="text-gray-500 text-[10px] font-black uppercase mb-1">Description</label>
              {isEditing ? (
                <textarea 
                  className="textarea textarea-bordered h-32 w-full bg-[#121212] border-gray-800 focus:border-orange-500" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              ) : (
                <p className="text-gray-400 text-sm bg-[#121212] p-4 rounded-2xl border border-gray-800 leading-relaxed italic">
                  "{task.description}"
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="text-gray-500 text-[10px] font-black uppercase mb-1">Status</label>
                <select 
                  className="select select-bordered bg-[#121212] text-warning font-black border-gray-800"
                  disabled={!isEditing}
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* AUDIT LOG SECTION */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-gray-500" />
                <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Activity History</h3>
              </div>
              <div className="space-y-4 border-l border-gray-800 ml-2 pl-4">
                {logs?.length > 0 ? (
                  logs.map((log: any) => (
                    <div key={log._id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(255,145,0,0.5)]" />
                      <p className="text-white text-[11px] font-bold">
                        {log.userId?.name} <span className="text-gray-500 font-normal">moved to</span> <span className="text-warning">{log.newStatus}</span>
                      </p>
                      <p className="text-[9px] text-gray-600 uppercase font-black">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-[10px] italic">No status changes recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-800 flex flex-col gap-3">
            {isEditing ? (
              <button 
                onClick={() => updateMutation.mutate(formData)}
                className="btn-primary-orange w-full h-12 flex items-center justify-center gap-2"
              >
                <Save size={18} /> SAVE CHANGES
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black w-full rounded-xl font-black flex items-center justify-center gap-2"
              >
                <Edit3 size={18} /> EDIT COMPONENTS
              </button>
            )}
            
            <button 
              onClick={() => { if(confirm("Permanently delete this task?")) deleteMutation.mutate(); }}
              className="btn btn-error btn-outline w-full rounded-xl font-black flex items-center justify-center gap-2"
            >
              <Trash2 size={18} /> DELETE TASK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsSidebar;