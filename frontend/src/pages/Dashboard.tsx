import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import TaskDetailsSidebar from '../components/tasks/TaskDetailsSidebar';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [view, setView] = useState<'personal' | 'global'>('personal');
  
  useSocket(user?.id); // Connect Real-time & Toasts

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => API.get('/tasks/dashboard').then(res => res.data),
    enabled: view === 'personal'
  });

  const { data: globalTasks } = useQuery({
    queryKey: ['global_tasks'],
    queryFn: () => API.get('/tasks').then(res => res.data),
    enabled: view === 'global'
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="bg-[#181818] border-b border-gray-800 px-10 py-5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-warning rounded flex items-center justify-center text-black font-black">✓</div>
            <span className="text-xl font-black text-warning">Taskly</span>
          </div>
          <nav className="flex gap-6 text-[11px] font-black uppercase tracking-widest">
            <button onClick={() => setView('global')} className={view === 'global' ? 'text-warning' : 'text-gray-500'}>Global Board</button>
            <button onClick={() => setView('personal')} className={view === 'personal' ? 'text-warning' : 'text-gray-500'}>Workspace</button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setIsModalOpen(true)} className="btn-primary-orange btn-sm">+ Create Task</button>
          <div className="flex items-center gap-3 bg-[#1e1e1e] px-4 py-1.5 rounded-full border border-gray-800">
            <span className="text-[10px] font-black text-gray-500">{user?.name}</span>
            <button onClick={logout} className="text-error text-[10px] font-black hover:underline uppercase">Logout</button>
          </div>
        </div>
      </header>

      <main className="p-10 max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-1 uppercase tracking-tighter">
            {view === 'global' ? 'Team Global Board' : 'Personal Workspace'}
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] italic">
            {view === 'global' ? 'All team tasks in real-time' : 'Tasks assigned to you and overdue'}
          </p>
        </div>
        
        {view === 'personal' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Column title="ASSIGNED TO ME" tasks={dashboardData?.assigned} onTaskClick={setSelectedTask} accent="border-warning" />
            <Column title="CREATED BY ME" tasks={dashboardData?.created} onTaskClick={setSelectedTask} accent="border-info" />
            <Column title="OVERDUE" tasks={dashboardData?.overdue} onTaskClick={setSelectedTask} accent="border-error" />
          </div>
        ) : (
          <div className="bg-[#121212]/50 p-8 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-4 gap-6">
            {globalTasks?.map((task: any) => (
              <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} accent="border-orange-500" />
            ))}
          </div>
        )}
      </main>

      {/* Sidebar for details/editing */}
      {selectedTask && <TaskDetailsSidebar task={selectedTask} onClose={() => setSelectedTask(null)} />}
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const Column = ({ title, tasks, onTaskClick, accent }: any) => (
  <section className="flex flex-col gap-6">
    <h3 className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase px-4">{title}</h3>
    <div className="bg-[#121212]/40 p-4 rounded-[2rem] min-h-[600px] border border-white/5">
      {tasks?.map((task: any) => (
        <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} accent={accent} />
      ))}
    </div>
  </section>
);

const TaskCard = ({ task, onClick, accent }: any) => {
  const statusColors: any = {
    "To Do": "badge-ghost",
    "In Progress": "badge-info",
    "Review": "badge-warning",
    "Completed": "badge-success"
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-[#1e1e1e] border-l-4 ${accent} rounded-2xl p-6 mb-5 shadow-2xl hover:bg-[#252525] transition-all cursor-pointer group`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-black text-lg leading-tight group-hover:text-warning">{task.title}</h4>
        <div className={`badge ${statusColors[task.status]} badge-sm font-bold uppercase`}>
          {task.status}
        </div>
      </div>
      
      <p className="text-gray-500 text-[11px] mb-6 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center border-t border-gray-800/50 pt-4 text-[9px] text-gray-600 font-black uppercase tracking-widest">
        <div className="flex flex-col gap-1">
          <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
          {/* Visibility of Assignee */}
          <span className="text-warning">
            👤 ASSIGNED TO: {task.assignedToId?.name || 'Unassigned'}
          </span>
        </div>
        <span className="opacity-40">{task.priority}</span>
      </div>
    </div>
  );
};

export default Dashboard;