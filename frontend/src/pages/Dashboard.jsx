import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, Filter } from 'lucide-react';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const overdue = tasks.filter(
    (t) => t.dueDate && t.status !== 'Completed' && new Date(t.dueDate) < now
  ).length;

  const filtered = filter === 'All' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-slate-400 text-sm mt-1">Track your team's progress</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Tasks" value={total} icon={ListTodo} color="indigo" />
            <StatCard title="Completed" value={completed} icon={CheckCircle2} color="emerald" />
            <StatCard title="Pending" value={pending} icon={Clock} color="amber" />
            <StatCard title="Overdue" value={overdue} icon={AlertTriangle} color="rose" />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6">
            <Filter size={16} className="text-slate-500" />
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    filter === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Task Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading tasks...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <ListTodo size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No tasks found</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
