import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin", label: "📊 Overview", end: true },
  { to: "/admin/customers", label: "👥 Customers" },
  { to: "/admin/orders", label: "📦 Orders" },
  { to: "/admin/inventory", label: "🗂️ Inventory" },
  { to: "/admin/support", label: "💬 Support" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>NexoraShop CRM</h2>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "admin-link-active" : "")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
