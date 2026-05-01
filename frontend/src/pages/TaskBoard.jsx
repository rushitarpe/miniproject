import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, X, ClipboardList } from 'lucide-react';

const COLUMNS = ['Pending', 'In Progress', 'Completed'];

const columnStyle = {
  Pending: 'border-amber-500/20 bg-amber-500/5',
  'In Progress': 'border-blue-500/20 bg-blue-500/5',
  Completed: 'border-emerald-500/20 bg-emerald-500/5',
};

const columnHeaderStyle = {
  Pending: 'text-amber-400',
  'In Progress': 'text-blue-400',
  Completed: 'text-emerald-400',
};

const TaskBoard = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '', projectId: '', status: 'Pending', dueDate: '',
  });

  const fetchData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects'),
      ]);
      setTasks(tRes.data);
      setProjects(pRes.data);
      if (isAdmin) {
        const uRes = await api.get('/projects/users');
        setAllUsers(uRes.data);
      }
    } catch {
      toast.error('Failed to load task board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', {
        ...form,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      setTasks((prev) => [data, ...prev]);
      setForm({ title: '', description: '', assignedTo: '', projectId: '', status: 'Pending', dueDate: '' });
      setShowForm(false);
      toast.success('Task created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

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

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-white">Task Board</h2>
              <p className="text-slate-400 text-sm mt-1">{tasks.length} total tasks</p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> New Task
              </button>
            )}
          </div>

          {/* Create Task Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-white">Create New Task</h3>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="label">Title *</label>
                    <input required className="input-field" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea rows={3} className="input-field resize-none" placeholder="Task description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Project *</label>
                      <select required className="input-field" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                        <option value="">Select project</option>
                        {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Assign to</label>
                      <select className="input-field" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                        <option value="">Unassigned</option>
                        {allUsers.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Status</label>
                      <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        {COLUMNS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Due date</label>
                      <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                    <button type="submit" className="btn-primary flex-1">Create Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Kanban Columns */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading board...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COLUMNS.map((col) => {
                const colTasks = getTasksByStatus(col);
                return (
                  <div key={col} className={`rounded-2xl border p-4 ${columnStyle[col]}`}>
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-sm font-semibold ${columnHeaderStyle[col]}`}>{col}</h3>
                      <span className="text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded-full">
                        {colTasks.length}
                      </span>
                    </div>
                    {/* Tasks */}
                    <div className="space-y-3 min-h-[200px]">
                      {colTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-slate-600">
                          <ClipboardList size={24} className="mb-2" />
                          <p className="text-xs">No tasks</p>
                        </div>
                      ) : (
                        colTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskBoard;
