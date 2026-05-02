import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Users, Calendar, X, UserPlus, UserMinus, FolderKanban } from 'lucide-react';

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '' });
  const [memberModal, setMemberModal] = useState(null); // project object
  const [addUserId, setAddUserId] = useState('');

  const fetchAll = async () => {
    try {
      const [pRes, uRes] = await Promise.all([
        api.get('/projects'),
        isAdmin ? api.get('/projects/users') : Promise.resolve({ data: [] }),
      ]);
      setProjects(pRes.data);
      setAllUsers(uRes.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', form);
      setProjects((prev) => [data, ...prev]);
      setForm({ name: '', description: '', deadline: '' });
      setShowForm(false);
      toast.success('Project created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleAddMember = async () => {
    if (!addUserId) return;
    try {
      const { data } = await api.post(`/projects/${memberModal._id}/members`, { userId: addUserId });
      setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setMemberModal(data);
      setAddUserId('');
      toast.success('Member added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const { data } = await api.delete(`/projects/${memberModal._id}/members/${userId}`);
      setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setMemberModal(data);
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <p className="text-slate-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> New Project
              </button>
            )}
          </div>

          {/* Admin Info Banner */}
          {isAdmin && (
            <div className="mb-6 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 text-sm text-indigo-300 animate-fade-in">
              <p className="font-semibold mb-1">📋 Admin Workflow</p>
              <ol className="list-decimal list-inside space-y-0.5 text-indigo-200/80 text-xs">
                <li>Create a project below.</li>
                <li>Click <strong>"Manage Members"</strong> on a project card to add users — members only see projects they're added to.</li>
                <li>Go to <strong>Task Board</strong> → create a task and assign it to a member — members only see tasks assigned to them.</li>
              </ol>
            </div>
          )}

          {/* Create Project Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card p-6 w-full max-w-md animate-slide-up">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-white">New Project</h3>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="label">Project name *</label>
                    <input required className="input-field" placeholder="e.g. Marketing Campaign" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <textarea rows={3} className="input-field resize-none" placeholder="Project overview..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Deadline</label>
                    <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
                    <button type="submit" className="btn-primary flex-1">Create Project</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Member Management Modal */}
          {memberModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="glass-card p-6 w-full max-w-md animate-slide-up">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-white">Manage Members — {memberModal.name}</h3>
                  <button onClick={() => setMemberModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
                {/* Add member */}
                <div className="flex gap-2 mb-4">
                  <select value={addUserId} onChange={(e) => setAddUserId(e.target.value)} className="input-field flex-1 text-sm">
                    <option value="">Select user to add...</option>
                    {allUsers
                      .filter((u) => !memberModal.members.some((m) => m._id === u._id))
                      .map((u) => (
                        <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                      ))}
                  </select>
                  <button onClick={handleAddMember} className="btn-primary flex items-center gap-1 text-sm px-3"><UserPlus size={14} /></button>
                </div>
                {/* Member list */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {memberModal.members.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No members yet</p>
                  ) : (
                    memberModal.members.map((m) => (
                      <div key={m._id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                        <div>
                          <p className="text-sm text-white">{m.name}</p>
                          <p className="text-xs text-slate-500">{m.email}</p>
                        </div>
                        <button onClick={() => handleRemoveMember(m._id)} className="text-slate-500 hover:text-rose-400 transition-colors"><UserMinus size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Cards */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <FolderKanban size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400">No projects yet. {isAdmin && 'Create one!'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div key={project._id} className="glass-card p-5 hover:border-white/20 transition-all duration-200 animate-slide-up">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">by {project.createdBy?.name}</p>
                    </div>
                    {isAdmin && (
                      <button onClick={() => handleDelete(project._id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all ml-2">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Users size={11} /> {project.members.length} members</span>
                    {project.deadline && (
                      <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(project.deadline)}</span>
                    )}
                  </div>

                  {isAdmin && (
                    <button onClick={() => setMemberModal(project)} className="btn-ghost text-xs flex items-center gap-1.5 w-full justify-center">
                      <Users size={13} /> Manage Members
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
