import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState(null);
  useEffect(() => { api.get("/dashboard").then((r) => setCounts(r.data)); }, []);

  const rows = [["students", "Students enrolled"], ["teachers", "Teachers on staff"], ["courses", "Courses offered"]];
  return (
    <section>
      <header className="page-head"><h2>Welcome, {user.name.split(" ")[0]}</h2></header>
      <div className="table-wrap">
        <table>
          <tbody>
            {rows.map(([key, label]) => (
              <tr key={key}>
                <td>{label}</td>
                <td><strong>{counts ? counts[key] : "…"}</strong></td>
                <td className="actions"><Link to={`/${key}`}>Open {key}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
