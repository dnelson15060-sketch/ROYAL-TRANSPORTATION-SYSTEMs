import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import type { Driver, Route, Student } from '../types';

vi.mock('../services/routeService', () => ({
  getRoutes: vi.fn(),
}));
vi.mock('../services/studentService', () => ({
  getStudents: vi.fn(),
}));
vi.mock('../services/driverService', () => ({
  getDrivers: vi.fn(),
}));

import { getRoutes } from '../services/routeService';
import { getStudents } from '../services/studentService';
import { getDrivers } from '../services/driverService';

const mockRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'Downtown Loop',
    stops: [],
    studentIds: ['s1', 's2'],
    status: 'in_progress',
  },
  {
    id: 'route-2',
    name: 'Suburb Express',
    stops: [],
    studentIds: ['s3'],
    status: 'active',
  },
];

const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Alice',
    parentId: 'p1',
    grade: '5',
    school: 'Royal Elementary',
    status: 'active',
  },
];

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    userId: 'u1',
    licenseNumber: 'DL-1',
    rating: 4.8,
    status: 'active',
    assignedRoutes: [],
  },
];

function renderDashboard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('DashboardPage', () => {
  it('renders summary cards with counts from the API', async () => {
    vi.mocked(getRoutes).mockResolvedValue(mockRoutes);
    vi.mocked(getStudents).mockResolvedValue(mockStudents);
    vi.mocked(getDrivers).mockResolvedValue(mockDrivers);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Active Routes')).toBeInTheDocument();
    });

    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('Total Drivers')).toBeInTheDocument();
    expect(screen.getByText('Routes In Progress')).toBeInTheDocument();

    // 2 routes, 1 student, 1 driver, 1 in-progress route
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('shows a loading spinner while data is being fetched', () => {
    vi.mocked(getRoutes).mockReturnValue(new Promise(() => {}));
    vi.mocked(getStudents).mockReturnValue(new Promise(() => {}));
    vi.mocked(getDrivers).mockReturnValue(new Promise(() => {}));

    renderDashboard();

    expect(screen.getByText('Loading dashboard data…')).toBeInTheDocument();
  });
});
