import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import ResourcePage from "./components/ResourcePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OAuthRedirect from "./pages/OAuthRedirect.jsx";

export const resources = [
  {
    path: "students", title: "Students", singular: "student",
    fields: [
      { name: "name", label: "Full name" },
      { name: "rollNo", label: "Roll number" },
      { name: "email", label: "Email", type: "email" },
      { name: "department", label: "Department" },
      { name: "semester", label: "Semester", type: "number" },
    ],
  },
  {
    path: "teachers", title: "Teachers", singular: "teacher",
    fields: [
      { name: "name", label: "Full name" },
      { name: "email", label: "Email", type: "email" },
      { name: "department", label: "Department" },
      { name: "phone", label: "Phone" },
    ],
  },
  {
    path: "courses", title: "Courses", singular: "course",
    fields: [
      { name: "code", label: "Course code" },
      { name: "title", label: "Title" },
      { name: "credits", label: "Credits", type: "number" },
      { name: "department", label: "Department" },
      { name: "instructor", label: "Instructor" },
    ],
  },
];

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center-note">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        {resources.map((r) => (
          <Route key={r.path} path={r.path} element={<ResourcePage key={r.path} {...r} endpoint={`/${r.path}`} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
