import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'Users', icon: '👤' },
  { to: '/drivers', label: 'Drivers', icon: '🚌' },
  { to: '/students', label: 'Students', icon: '🎒' },
  { to: '/routes', label: 'Routes', icon: '🗺️' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col bg-primary text-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-primary-600">
        <span className="text-2xl">🚍</span>
        <div>
          <p className="text-sm font-semibold leading-tight">Royal Transportation</p>
          <p className="text-xs text-primary-100">Admin Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-primary'
                  : 'text-primary-50 hover:bg-primary-600'
              }`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 text-xs text-primary-100 border-t border-primary-600">
        © {new Date().getFullYear()} Royal Transportation System
      </div>
    </aside>
  );
}

export default Sidebar;
