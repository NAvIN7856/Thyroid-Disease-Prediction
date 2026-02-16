export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
      <button 
        onClick={() => setMode("single")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "single" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
      >
        Single Patient
      </button>
      <button 
        onClick={() => setMode("csv")}
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "csv" ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
      >
        Bulk Upload
      </button>
    </div>
  );
}