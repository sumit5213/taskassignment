// import { ITask } from '../../interfaces/Tasks';
import { Calendar, User } from 'lucide-react';

const TaskCard = ({ task }: { task: any }) => {
  const priorityColors: Record<string, string> = {
    Low: 'badge-info',
    Medium: 'badge-warning',
    High: 'badge-error',
    Urgent: 'badge-secondary'
  };

  return (
    <div className="card bg-base-100 shadow-md border-l-4 border-orange-500 mb-4 hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm truncate w-40">{task.title}</h3>
          <div className={`badge ${priorityColors[task.priority]} badge-sm`}>
            {task.priority}
          </div>
        </div>
        
        <p className="text-xs text-gray-400 line-clamp-2 mt-1">{task.description}</p>
        
        <div className="divider my-1"></div>
        
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <User size={12} />
            {task.assignedToId?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;