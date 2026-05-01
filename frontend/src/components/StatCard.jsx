const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  };

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${colorMap[color] || colorMap.indigo} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl bg-white/5 ${colorMap[color]?.split(' ')[3]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
