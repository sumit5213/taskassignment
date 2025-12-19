// import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, CheckSquare, Clock, PlusCircle, LogOut } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  const { user, logout } = useAuth();

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-300">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col p-6">
        {/* Mobile Navbar */}
        <div className="flex items-center justify-between lg:hidden mb-4 bg-base-200 p-4 rounded-xl">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </label>
          <span className="font-bold text-warning">Task Manager</span>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1">{children}</main>
      </div> 

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content border-r border-orange-600/30">
          <li className="mb-8 px-4">
            <h1 className="text-2xl font-bold text-warning flex items-center gap-2">
              <CheckSquare className="w-8 h-8" /> Taskly
            </h1>
            <p className="text-xs text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </li>
          
          <li><a className="active"><LayoutDashboard size={20}/> Global Board</a></li>
          <li><a><PlusCircle size={20}/> Create New Task</a></li>
          <li><a><Clock size={20}/> Overdue Tasks</a></li>
          
          <div className="mt-auto pt-4 border-t border-base-300">
            <li onClick={logout}>
              <a className="text-error hover:bg-error/10">
                <LogOut size={20}/> Logout
              </a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;