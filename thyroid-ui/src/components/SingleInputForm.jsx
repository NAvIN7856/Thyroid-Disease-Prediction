export default function SingleInputForm({
  form,
  onChange,
  onPredict,
  result,
  loading,
}) {
  const labs = ["age", "TSH", "T3", "T4U", "FTI"];
  const clinical = Object.keys(form).filter(
    (k) => !labs.includes(k) && k !== "sex",
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Laboratory Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 ml-1">
                Sex
              </label>
              <select
                name="sex"
                value={form.sex}
                onChange={(e) => onChange("sex", Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select</option>
                <option value={1}>Male</option>
                <option value={2}>Female</option>
              </select>
            </div>
            {labs.map((key) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1 ml-1">
                  {key}
                </label>
                <input
                  type="number"
                  name={key}
                  value={form[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
            Clinical History
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {clinical.map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={form[key] === 1}
                  onChange={(e) => onChange(key, e.target.checked ? 1 : 0)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm capitalize">
                  {key.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center">
        <button
          onClick={onPredict}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Run Assessment"}
        </button>
        {result && (
          <div
            className={`mt-6 p-4 rounded-xl font-bold ${result.includes("Detected") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            Result: {result}
          </div>
        )}
      </div>
    </div>
  );
}
