import React, { useEffect, useState } from "react";
import Contributions from "./Contributions";

type Dizimista = {
  id: number;
  name: string;
  cpf?: string | null;
  email?: string | null;
  phone?: string | null;
  communityId?: number;
};

export default function App(): JSX.Element {
  const [dizimistas, setDizimistas] = useState<Dizimista[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    fetchDizimistas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDizimistas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/dizimistas`);
      if (!res.ok) throw new Error(`Erro ao buscar: ${res.status}`);
      const json = await res.json();
      setDizimistas(Array.isArray(json) ? json : []);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function addDizimista(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/dizimistas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), communityId: 1 })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao criar: ${res.status} ${text}`);
      }
      const novo = await res.json();
      setDizimistas(prev => [...prev, novo]);
      setName("");
    } catch (err: any) {
      setError(err.message || "Erro ao criar dizimista");
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Dizimistas — Paróquia Cristo Libertador</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Adicionar dizimista</h2>
          <form onSubmit={addDizimista} className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Adicionar</button>
          </form>
          {error && <div className="mt-2 text-red-600">Erro: {error}</div>}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Lista de dizimistas</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <ul className="space-y-2">
              {dizimistas.length === 0 && <div className="text-slate-500">Nenhum dizimista encontrado.</div>}
              {dizimistas.map(d => (
                <li key={d.id} className="border rounded p-3 bg-slate-50">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-slate-600">
                    {d.cpf ? `CPF: ${d.cpf}` : ""} {d.email ? `• ${d.email}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* aqui inserimos o componente de contribuições */}
        <Contributions />

      </div>
    </div>
  );
}
