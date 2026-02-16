export default function BulkTable({ csvData, csvResult, onUpload, onPredict, loading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center flex-wrap gap-4">
        <input type="file" accept=".csv" onChange={onUpload} className="text-sm file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-full file:px-4 file:py-2" />
        {csvData.length > 0 && (
          <button onClick={onPredict} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">
            {loading ? "Processing..." : "Process All Rows"}
          </button>
        )}
      </div>

      {csvData.length > 0 && (
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="p-3 border-b sticky left-0 bg-slate-50 z-30">#</th>
                {Object.keys(csvData[0]).map(h => (
                  <th key={h} className="p-3 border-b uppercase min-w-[100px]">{h.replace(/_/g, ' ')}</th>
                ))}
                <th className="p-3 border-b sticky right-0 bg-blue-600 text-white z-30">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                  <td className="p-3 sticky left-0 bg-white group-hover:bg-slate-50 border-r">{i + 1}</td>
                  {Object.values(row).map((v, j) => (
                    <td key={j} className="p-3 text-slate-500">{v}</td>
                  ))}
                  <td className={`p-3 sticky right-0 font-bold border-l shadow-sm ${csvResult[i] === "Thyroid Detected" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                    {csvResult[i] || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}