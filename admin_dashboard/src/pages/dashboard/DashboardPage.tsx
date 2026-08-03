import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useApiQuery } from '../../hooks/useApi';
import { getDrivers } from '../../services/driverService';
import { getRoutes } from '../../services/routeService';
import { getStudents } from '../../services/studentService';

// Mock weekly attendance data used until a dedicated analytics endpoint exists.
const MOCK_WEEKLY_ATTENDANCE = [
  { day: 'Mon', present: 182, absent: 12 },
  { day: 'Tue', present: 190, absent: 8 },
  { day: 'Wed', present: 175, absent: 21 },
  { day: 'Thu', present: 188, absent: 10 },
  { day: 'Fri', present: 165, absent: 30 },
];

interface SummaryCardProps {
  label: string;
  value: number;
  icon: string;
  accent?: boolean;
}

function SummaryCard({ label, value, icon, accent = false }: SummaryCardProps) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p
          className={`mt-1 text-3xl font-bold ${
            accent ? 'text-accent' : 'text-primary'
          }`}
        >
          {value}
        </p>
      </div>
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
    </Card>
  );
}

export function DashboardPage() {
  const routesQuery = useApiQuery(['routes'], getRoutes);
  const studentsQuery = useApiQuery(['students'], getStudents);
  const driversQuery = useApiQuery(['drivers'], getDrivers);

  const isLoading =
    routesQuery.isLoading || studentsQuery.isLoading || driversQuery.isLoading;

  const routes = routesQuery.data ?? [];
  const students = studentsQuery.data ?? [];
  const drivers = driversQuery.data ?? [];

  const activeRoutesNow = routes.filter(
    (route) => route.status === 'in_progress'
  ).length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of Royal Transportation System operations"
      />

      {isLoading ? (
        <LoadingSpinner label="Loading dashboard data…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Active Routes" value={routes.length} icon="🗺️" />
            <SummaryCard
              label="Total Students"
              value={students.length}
              icon="🎒"
            />
            <SummaryCard label="Total Drivers" value={drivers.length} icon="🚌" />
            <SummaryCard
              label="Routes In Progress"
              value={activeRoutesNow}
              icon="📍"
              accent
            />
          </div>

          <Card title="Weekly Attendance Summary" className="mt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_WEEKLY_ATTENDANCE}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#003DA5" name="Present" />
                  <Bar dataKey="absent" fill="#E31937" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              * Attendance data is illustrative until the analytics API is
              available.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
