import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import { Button } from '../ui/Button';

export function Header() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary">
            {getInitials(profile?.name ?? 'Admin')}
          </span>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {profile?.name ?? 'Admin'}
            </p>
            <p className="text-xs text-gray-500">{profile?.email}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}

export default Header;
