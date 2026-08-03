import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge, type BadgeColor } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApiQuery } from '../../hooks/useApi';
import { getDriverById } from '../../services/driverService';
import type { Driver } from '../../types';
import { formatStatusLabel } from '../../utils/helpers';

const STATUS_BADGE_COLOR: Record<Driver['status'], BadgeColor> = {
  active: 'green',
  on_route: 'yellow',
  inactive: 'red',
};

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const driverQuery = useApiQuery(
    ['drivers', id],
    () => getDriverById(id as string),
    { enabled: Boolean(id) }
  );

  if (driverQuery.isLoading) {
    return <LoadingSpinner label="Loading driver…" />;
  }

  if (driverQuery.isError || !driverQuery.data) {
    return (
      <div>
        <PageHeader title="Driver Not Found" />
        <p className="text-gray-600">
          We couldn&apos;t find that driver.{' '}
          <Link to="/drivers" className="text-primary hover:underline">
            Back to Drivers
          </Link>
        </p>
      </div>
    );
  }

  const driver = driverQuery.data;

  return (
    <div>
      <PageHeader
        title={driver.user?.name ?? driver.userId}
        description={`License: ${driver.licenseNumber}`}
        actions={
          <Badge color={STATUS_BADGE_COLOR[driver.status]}>
            {formatStatusLabel(driver.status)}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Driver details">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm text-gray-500">User ID</dt>
              <dd className="font-medium text-gray-800">{driver.userId}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Vehicle</dt>
              <dd className="font-medium text-gray-800">
                {driver.vehicleId ?? 'Not assigned'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Rating</dt>
              <dd className="font-medium text-gray-800">
                {driver.rating.toFixed(1)} / 5.0
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Assigned Routes">
          {driver.assignedRoutes.length === 0 ? (
            <p className="text-sm text-gray-500">No routes assigned yet.</p>
          ) : (
            <ul className="space-y-2">
              {driver.assignedRoutes.map((routeId) => (
                <li key={routeId}>
                  <Link
                    to={`/routes/${routeId}`}
                    className="text-primary hover:underline"
                  >
                    {routeId}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DriverDetailPage;
