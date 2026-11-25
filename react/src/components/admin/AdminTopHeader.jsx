export function AdminTopHeader({
  eyebrow = "Admin Area",
  title = "Ringkasan platform",
  subtitle = "Pantau pertumbuhan pengguna dan status akun.",
  adminLabel = "Admin",
  initials = "AD",
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-[#0d5c52] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white py-1 pr-3.5 pl-1.5 shadow-2xs">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d5c52] text-[11px] font-bold text-white">
          {initials}
        </span>
        <span className="text-xs font-semibold text-slate-800">
          {adminLabel}
        </span>
      </div>
    </header>
  );
}
