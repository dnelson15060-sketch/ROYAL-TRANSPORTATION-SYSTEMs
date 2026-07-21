import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Table, type TableColumn } from '../../components/ui/Table';
import { useApiQuery } from '../../hooks/useApi';
import { getUsers } from '../../services/userService';
import type { User } from '../../types';
import { formatDate, matchesSearch } from '../../utils/helpers';

const ROLE_BADGE_COLOR: Record<User['role'], 'primary' | 'blue' | 'gray'> = {
  admin: 'primary',
  driver: 'blue',
  parent: 'gray',
};

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | User['role']>('all');

  const usersQuery = useApiQuery(['users'], () => getUsers());

  const filteredUsers = useMemo(() => {
    const users = usersQuery.data ?? [];
    return users.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesQuery =
        search.trim() === '' ||
        matchesSearch(user.name, search) ||
        matchesSearch(user.email, search);
      return matchesRole && matchesQuery;
    });
  }, [usersQuery.data, roleFilter, search]);

  const columns: TableColumn<User>[] = [
    {
      header: 'Name',
      accessor: (user) => (
        <Link to={`/users/${user.uid}`} className="font-medium text-primary hover:underline">
          {user.name}
        </Link>
      ),
    },
    { header: 'Email', accessor: (user) => user.email },
    {
      header: 'Role',
      accessor: (user) => (
        <Badge color={ROLE_BADGE_COLOR[user.role]}>{user.role}</Badge>
      ),
    },
    { header: 'Phone', accessor: (user) => user.phone ?? '—' },
    { header: 'Joined', accessor: (user) => formatDate(user.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title="Users"
        description="All parents, drivers, and admins registered in the system"
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search users"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as 'all' | User['role'])
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="driver">Driver</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      {usersQuery.isLoading ? (
        <LoadingSpinner label="Loading users…" />
      ) : usersQuery.isError ? (
        <p className="text-accent">Failed to load users. Please try again.</p>
      ) : (
        <Table
          columns={columns}
          data={filteredUsers}
          rowKey={(user) => user.uid}
          emptyMessage="No users match your search."
        />
      )}
    </div>
  );
}

export default UsersPage;
