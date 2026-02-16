import { useState } from "react";
import Papa from "papaparse";
import ModeToggle from "./components/ModeToggle";
import SingleInputForm from "./components/SingleInputForm";
import BulkTable from "./components/BulkTable";

export default function App() {
  const [mode, setMode] = useState("single");
  const [result, setResult] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [csvResult, setCsvResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    age: "",
    sex: "0",
    on_thyroxine: 0,
    query_on_thyroxine: 0,
    on_antithyroid_medication: 0,
    sick: 0,
    pregnant: 0,
    thyroid_surgery: 0,
    I131_treatment: 0,
    query_hypothyroid: 0,
    query_hyperthyroid: 0,
    lithium: 0,
    goitre: 0,
    tumor: 0,
    hypopituitary: 0,
    psych: 0,
    TSH: "",
    T3: "",
    T4U: "",
    FTI: "",
  });

  const REQUIRED_COLUMNS = [
    "age",
    "sex",
    "on_thyroxine",
    "query_on_thyroxine",
    "on_antithyroid_medication",
    "sick",
    "pregnant",
    "thyroid_surgery",
    "I131_treatment",
    "query_hypothyroid",
    "query_hyperthyroid",
    "lithium",
    "goitre",
    "tumor",
    "hypopituitary",
    "psych",
    "TSH",
    "T3",
    "T4U",
    "FTI",
  ];
  const sanitizeCSVRow = (row) => {
    const cleaned = {};

    REQUIRED_COLUMNS.forEach((col) => {
      cleaned[col] = Number(row[col] ?? 0);
    });

    return cleaned;
  };
  const handleFormChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const predictOne = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.prediction);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleFileUpload = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const cleanedData = res.data.map(sanitizeCSVRow);
        setCsvData(cleanedData);
      },
    });
  };

  const predictCSV = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(csvData),
      });
      const data = await res.json();
      setCsvResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 py-4 px-8 mb-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">TS</span>
            ThyroScan{" "}
            <span className="text-blue-600 underline decoration-2">AI</span>
          </div>
          <ModeToggle mode={mode} setMode={setMode} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        {mode === "single" ? (
          <SingleInputForm
            form={form}
            onChange={handleFormChange}
            onPredict={predictOne}
            result={result}
            loading={loading}
          />
        ) : (
          <BulkTable
            csvData={csvData}
            csvResult={csvResult}
            onUpload={handleFileUpload}
            onPredict={predictCSV}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}
