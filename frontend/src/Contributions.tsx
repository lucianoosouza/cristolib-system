import React, { useEffect, useState } from "react";

type Dizimista = { id: number; name: string };
type Contribution = {
  id: number;
  dizimistaId: number;
  amount: number;
  method?: string | null;
  type?: string | null;
  date: string;
};

const API = "http://localhost:3000";

export default function Contributions(): JSX.Element {
  const [dizimistas, setDizimistas] = useState<Dizimista[]>([]);
  const [contribs, setContribs] = useState<Contribution[]>([]);
  const [dizimistaId, setDizimistaId] = useState<number | "">("");
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<string>("dinheiro");
  const [type, setType] = useState<string>("oferta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDizimistas();
    fetchContribs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDizimistas() {
    try {
      const res = await fetch(`${API}/dizimistas`);
      const json = await res.json();
      setDizimistas(json || []);
      if (json && json.length > 0) setDizimistaId(json[0].id);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchContribs() {
    try {
      const res = await fetch(`${API}/contributions`);
      const json = await res.json();
      setContribs(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    if (!dizimistaId || !amount) {
      setError("Selecione um dizimista e informe o valor.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        dizimistaId: Number(dizimistaId),
        amount: Number(amount),
        method,
        type,
      };
      const res = await fetch(`${API}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro: ${res.status} ${text}`);
      }
      const novo = await res.json();
      setContribs(prev => [novo, ...prev]);
      setAmount("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao registrar contribuição");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-3">Registrar contribuição</h2>

      <form onSubmit={submit} className="flex gap-2 mb-4 flex-wrap">
        <select
          value={dizimistaId}
          onChange={(e) => setDizimistaId(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value="">Selecione dizimista</option>
          {dizimistas.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Valor (ex: 50)"
          className="border rounded px-2"
        />

        <select value={type} onChange={e => setType(e.target.value)} className="border rounded p-2">
          <option value="oferta">Oferta</option>
          <option value="dizimo">Dízimo</option>
          <option value="doacao">Doação</option>
        </select>

        <select value={method} onChange={e => setMethod(e.target.value)} className="border rounded p-2">
          <option value="dinheiro">Dinheiro</option>
          <option value="cartao">Cartão</option>
          <option value="pix">PIX</option>
        </select>

        <button className="bg-green-600 text-white px-4 rounded" type="submit" disabled={loading}>
          {loading ? "..." : "Registrar"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <h3 className="font-medium mb-2">Últimas contribuições</h3>
      <ul className="space-y-2">
        {contribs.length === 0 && <div className="text-slate-500">Nenhuma contribuição registrada.</div>}
        {contribs.map(c => (
          <li key={c.id} className="border rounded p-2 bg-slate-50">
            <div className="font-medium">
              {dizimistas.find(d => d.id === c.dizimistaId)?.name || `Dizimista ${c.dizimistaId}`} — R$ {c.amount}
            </div>
            <div className="text-sm text-slate-600">
              {c.type ? `${c.type}` : ""} {c.method ? `• ${c.method}` : ""} • {new Date(c.date).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
