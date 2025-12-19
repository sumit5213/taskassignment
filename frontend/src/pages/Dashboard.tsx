import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/services/taskApi';
import DashboardLayout from '../components/layout/DashboardLayout';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { useSocket } from '../hooks/useSocket';
import { Filter, SortAsc } from 'lucide-react';

const Dashboard = () => {
  useSocket(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for filtering
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', filterPriority, filterStatus],
    queryFn: () => taskApi.getDashboard() // In a real app, pass filters to the API here
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-base-300">
      <span className="loading loading-spinner loading-lg text-warning"></span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Workspace</h2>
          <p className="text-sm text-gray-500">Manage and track your team tasks</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 bg-base-200 p-1 rounded-lg border border-orange-600/20">
            <select 
              className="select select-sm select-ghost focus:bg-transparent"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            
            <select 
              className="select select-sm select-ghost focus:bg-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-warning btn-sm shadow-lg shadow-orange-900/20"
          >
            + Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Assigned to Current User */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-warning">Assigned To Me</h3>
            <span className="badge badge-outline badge-xs">{data?.assigned?.length || 0}</span>
          </div>
          <div className="bg-base-200/30 p-4 rounded-2xl min-h-[500px] border border-white/5">
            {data?.assigned?.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>

        {/* Column 2: Created by Current User */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-info">Created By Me</h3>
            <span className="badge badge-outline badge-xs">{data?.created?.length || 0}</span>
          </div>
          <div className="bg-base-200/30 p-4 rounded-2xl min-h-[500px] border border-white/5">
            {data?.created?.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>

        {/* Column 3: Overdue */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-error">Overdue Tasks</h3>
            <span className="badge badge-error badge-xs text-white">{data?.overdue?.length || 0}</span>
          </div>
          <div className="bg-base-200/30 p-4 rounded-2xl min-h-[500px] border border-error/10">
            {data?.overdue?.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </div>
      </div>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};

export default Dashboard;