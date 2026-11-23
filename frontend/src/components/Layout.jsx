import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = [["/", "Dashboard"], ["/students", "Students"], ["/teachers", "Teachers"], ["/courses", "Courses"]];

  return (
    <div className="shell">
      <aside className="sidebar">
        <h1 className="brand">Campus<br />Office</h1>
        <nav>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
          ))}
        </nav>
        <div className="who">
          <strong>{user.name}</strong>
          <span>{user.role === "ADMIN" ? "Administrator" : "Read-only access"}</span>
          <button className="link" onClick={() => { signOut(); navigate("/login"); }}>Sign out</button>
        </div>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}
