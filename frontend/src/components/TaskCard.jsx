import { Calendar, User, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  Pending: 'badge-pending',
  'In Progress': 'badge-progress',
  Completed: 'badge-completed',
};

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const { isAdmin } = useAuth();
  const isOverdue = task.isOverdue || (
    task.dueDate &&
    task.status !== 'Completed' &&
    new Date(task.dueDate) < new Date()
  );

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className={`glass-card p-4 animate-slide-up hover:border-white/20 transition-all duration-200 ${isOverdue ? 'border-rose-500/30' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-white leading-tight">{task.title}</h3>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isOverdue && <AlertCircle size={14} className="text-rose-400" />}
          <span className={statusConfig[task.status] || 'badge-pending'}>
            {task.status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        <span className="flex items-center gap-1">
          <User size={11} />
          {task.assignedTo?.name || 'Unassigned'}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          <span className={isOverdue ? 'text-rose-400' : ''}>{formatDate(task.dueDate)}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Status update dropdown — members update their own, admins update any */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {isAdmin && (
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {task.projectId?.name && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-slate-600">📁 {task.projectId.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
