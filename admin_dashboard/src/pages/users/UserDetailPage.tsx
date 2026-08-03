import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApiQuery } from '../../hooks/useApi';
import { getUserById } from '../../services/userService';
import { formatDateTime } from '../../utils/helpers';

export function UserDetailPage() {
  const { uid } = useParams<{ uid: string }>();
  const userQuery = useApiQuery(
    ['users', uid],
    () => getUserById(uid as string),
    { enabled: Boolean(uid) }
  );

  if (userQuery.isLoading) {
    return <LoadingSpinner label="Loading user…" />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div>
        <PageHeader title="User Not Found" />
        <p className="text-gray-600">
          We couldn&apos;t find that user.{' '}
          <Link to="/users" className="text-primary hover:underline">
            Back to Users
          </Link>
        </p>
      </div>
    );
  }

  const user = userQuery.data;

  return (
    <div>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={<Badge color="primary">{user.role}</Badge>}
      />

      <Card title="Profile details">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">User ID</dt>
            <dd className="font-medium text-gray-800">{user.uid}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-800">{user.phone ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="font-medium text-gray-800 capitalize">
              {user.role}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Joined</dt>
            <dd className="font-medium text-gray-800">
              {formatDateTime(user.createdAt)}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export default UserDetailPage;
