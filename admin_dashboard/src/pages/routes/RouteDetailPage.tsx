import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge, type BadgeColor } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApiQuery } from '../../hooks/useApi';
import { getRouteById } from '../../services/routeService';
import type { Route } from '../../types';
import { formatDateTime, formatStatusLabel } from '../../utils/helpers';

const STATUS_BADGE_COLOR: Record<Route['status'], BadgeColor> = {
  active: 'green',
  in_progress: 'blue',
  completed: 'gray',
  inactive: 'red',
};

export function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const routeQuery = useApiQuery(
    ['routes', id],
    () => getRouteById(id as string),
    { enabled: Boolean(id) }
  );

  if (routeQuery.isLoading) {
    return <LoadingSpinner label="Loading route…" />;
  }

  if (routeQuery.isError || !routeQuery.data) {
    return (
      <div>
        <PageHeader title="Route Not Found" />
        <p className="text-gray-600">
          We couldn&apos;t find that route.{' '}
          <Link to="/routes" className="text-primary hover:underline">
            Back to Routes
          </Link>
        </p>
      </div>
    );
  }

  const route = routeQuery.data;
  const sortedStops = [...route.stops].sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHeader
        title={route.name}
        description={route.busId ? `Bus: ${route.busId}` : undefined}
        actions={
          <Badge color={STATUS_BADGE_COLOR[route.status]}>
            {formatStatusLabel(route.status)}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Route Overview">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Driver</dt>
              <dd className="font-medium text-gray-800">
                {route.driverId ? (
                  <Link
                    to={`/drivers/${route.driverId}`}
                    className="text-primary hover:underline"
                  >
                    {route.driverId}
                  </Link>
                ) : (
                  'Unassigned'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Start Time</dt>
              <dd className="font-medium text-gray-800">
                {formatDateTime(route.startTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">End Time</dt>
              <dd className="font-medium text-gray-800">
                {formatDateTime(route.endTime)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Total Students</dt>
              <dd className="font-medium text-gray-800">
                {route.studentIds.length}
              </dd>
            </div>
          </dl>
        </Card>

        <Card title="Enrolled Students">
          {route.studentIds.length === 0 ? (
            <p className="text-sm text-gray-500">No students enrolled yet.</p>
          ) : (
            <ul className="space-y-2">
              {route.studentIds.map((studentId) => (
                <li key={studentId}>
                  <Link
                    to={`/students/${studentId}`}
                    className="text-primary hover:underline"
                  >
                    {studentId}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Stops" className="mt-4">
        {sortedStops.length === 0 ? (
          <p className="text-sm text-gray-500">No stops defined for this route.</p>
        ) : (
          <ol className="space-y-3">
            {sortedStops.map((stop) => (
              <li
                key={`${stop.order}-${stop.name}`}
                className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {stop.order}. {stop.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stop.latitude.toFixed(5)}, {stop.longitude.toFixed(5)}
                  </p>
                </div>
                {stop.estimatedTime && (
                  <span className="text-sm text-gray-500">
                    ETA: {stop.estimatedTime}
                  </span>
                )}
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

export default RouteDetailPage;
