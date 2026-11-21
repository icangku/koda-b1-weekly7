export function LoginBrandingPanel({
  brandName = "koda wallet",
  headlineLines = ["Uangmu,", "lebih terarah."],
  description = "Kelola saldo, kirim uang, dan lihat setiap transaksi dalam satu tempat.",
}) {
  return (
    <section className="flex flex-col justify-between bg-[#0d5c52] px-8 py-10 text-white sm:px-14 sm:py-12 lg:min-h-screen lg:w-[46%]">
      <div>
        <span className="text-base font-bold tracking-tight text-white">
          {brandName}
        </span>
      </div>

      <div className="my-12 max-w-md lg:my-0">
        <h1 className="text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
          {headlineLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-emerald-100/85 sm:text-[15px]">
          {description}
        </p>
      </div>

      <div className="h-px w-full max-w-md bg-white/25" />
    </section>
  );
}
