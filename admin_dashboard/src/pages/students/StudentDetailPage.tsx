import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApiQuery } from '../../hooks/useApi';
import { getStudentById } from '../../services/studentService';

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const studentQuery = useApiQuery(
    ['students', id],
    () => getStudentById(id as string),
    { enabled: Boolean(id) }
  );

  if (studentQuery.isLoading) {
    return <LoadingSpinner label="Loading student…" />;
  }

  if (studentQuery.isError || !studentQuery.data) {
    return (
      <div>
        <PageHeader title="Student Not Found" />
        <p className="text-gray-600">
          We couldn&apos;t find that student.{' '}
          <Link to="/students" className="text-primary hover:underline">
            Back to Students
          </Link>
        </p>
      </div>
    );
  }

  const student = studentQuery.data;

  return (
    <div>
      <PageHeader
        title={student.name}
        description={`${student.grade} · ${student.school}`}
        actions={
          <Badge color={student.status === 'active' ? 'green' : 'red'}>
            {student.status}
          </Badge>
        }
      />

      <Card title="Student details">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Parent ID</dt>
            <dd className="font-medium text-gray-800">{student.parentId}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Route</dt>
            <dd className="font-medium text-gray-800">
              {student.routeId ? (
                <Link
                  to={`/routes/${student.routeId}`}
                  className="text-primary hover:underline"
                >
                  {student.routeId}
                </Link>
              ) : (
                'Not assigned'
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Seat Number</dt>
            <dd className="font-medium text-gray-800">
              {student.seatNumber ?? '—'}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export default StudentDetailPage;
