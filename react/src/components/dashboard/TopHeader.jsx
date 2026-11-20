export function TopHeader({ userName, initials }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Selamat datang, {userName} <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola uangmu dengan aman, cepat, dan nyaman.
        </p>
      </div>

      <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 shadow-2xs">
        <span className="text-xs font-bold text-slate-900">{initials}</span>
        <span className="text-sm font-medium text-slate-700">{userName}</span>
      </div>
    </header>
  );
}
