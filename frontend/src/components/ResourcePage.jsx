import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext.jsx";

export default function ResourcePage({ title, singular, endpoint, fields }) {
  const { user } = useAuth();
  const isAdmin = user.role === "ADMIN";
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(null); // null = closed, object = add/edit
  const [error, setError] = useState("");

  const load = () =>
    api.get(endpoint).then((r) => setRows(r.data)).catch(() => setError("Could not load records."));

  useEffect(() => { setRows([]); setQuery(""); setForm(null); setError(""); load(); }, [endpoint]);

  const blank = () => Object.fromEntries(fields.map((f) => [f.name, ""]));

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form };
    fields.forEach((f) => { if (f.type === "number") payload[f.name] = payload[f.name] === "" ? null : Number(payload[f.name]); });
    try {
      if (form.id) await api.put(`${endpoint}/${form.id}`, payload);
      else await api.post(endpoint, payload);
      setForm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this record.");
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete ${row[fields[0].name]}? This can't be undone.`)) return;
    try { await api.delete(`${endpoint}/${row.id}`); load(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete this record."); }
  };

  const shown = rows.filter((r) => JSON.stringify(Object.values(r)).toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <header className="page-head">
        <h2>{title}</h2>
        <div className="tools">
          <input placeholder={`Search ${title.toLowerCase()}`} value={query} onChange={(e) => setQuery(e.target.value)} />
          {isAdmin && <button className="btn" onClick={() => { setError(""); setForm(blank()); }}>Add {singular}</button>}
        </div>
      </header>

      {error && !form && <p className="error">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>{fields.map((f) => <th key={f.name}>{f.label}</th>)}{isAdmin && <th />}</tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                {fields.map((f) => <td key={f.name}>{r[f.name] ?? "—"}</td>)}
                {isAdmin && (
                  <td className="actions">
                    <button className="link" onClick={() => { setError(""); setForm({ ...blank(), ...r }); }}>Edit</button>
                    <button className="link danger" onClick={() => remove(r)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && (
          <p className="empty">
            {rows.length === 0
              ? isAdmin ? `No ${title.toLowerCase()} yet. Add the first ${singular} to get started.` : `No ${title.toLowerCase()} have been added yet.`
              : "Nothing matches your search."}
          </p>
        )}
      </div>

      {form && (
        <div className="overlay" onClick={() => setForm(null)}>
          <form className="dialog" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{form.id ? `Edit ${singular}` : `Add ${singular}`}</h3>
            {fields.map((f) => (
              <label key={f.name}>
                {f.label}
                <input type={f.type || "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              </label>
            ))}
            {error && <p className="error">{error}</p>}
            <div className="dialog-actions">
              <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn">{form.id ? "Save changes" : `Add ${singular}`}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
