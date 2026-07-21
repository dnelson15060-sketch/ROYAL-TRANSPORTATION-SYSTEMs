import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge, type BadgeColor } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { Table, type TableColumn } from '../../components/ui/Table';
import { getApiErrorMessage, useApiMutation, useApiQuery } from '../../hooks/useApi';
import { getDrivers } from '../../services/driverService';
import {
  assignDriver,
  createRoute,
  getRoutes,
  type CreateRoutePayload,
} from '../../services/routeService';
import type { Route } from '../../types';
import { formatStatusLabel } from '../../utils/helpers';

const STATUS_BADGE_COLOR: Record<Route['status'], BadgeColor> = {
  active: 'green',
  in_progress: 'blue',
  completed: 'gray',
  inactive: 'red',
};

interface CreateRouteFormValues {
  name: string;
  busId?: string;
  stopName: string;
  stopLatitude: number;
  stopLongitude: number;
}

export function RoutesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assigningRoute, setAssigningRoute] = useState<Route | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const queryClient = useQueryClient();

  const routesQuery = useApiQuery(['routes'], getRoutes);
  const driversQuery = useApiQuery(['drivers'], getDrivers);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRouteFormValues>();

  const createRouteMutation = useApiMutation(
    (values: CreateRouteFormValues) => {
      const payload: CreateRoutePayload = {
        name: values.name,
        busId: values.busId,
        stops: [
          {
            name: values.stopName,
            latitude: values.stopLatitude,
            longitude: values.stopLongitude,
            order: 1,
          },
        ],
        studentIds: [],
      };
      return createRoute(payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['routes'] });
        reset();
        setIsCreateModalOpen(false);
      },
    }
  );

  const assignDriverMutation = useApiMutation(
    ({ routeId, driverId }: { routeId: string; driverId: string }) =>
      assignDriver(routeId, driverId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['routes'] });
        setAssigningRoute(null);
        setSelectedDriverId('');
      },
    }
  );

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    reset();
    createRouteMutation.reset();
  }

  function closeAssignModal() {
    setAssigningRoute(null);
    setSelectedDriverId('');
    assignDriverMutation.reset();
  }

  function handleAssignSubmit() {
    if (!assigningRoute || !selectedDriverId) return;
    assignDriverMutation.mutate({
      routeId: assigningRoute.id,
      driverId: selectedDriverId,
    });
  }

  const drivers = driversQuery.data ?? [];

  const columns: TableColumn<Route>[] = [
    {
      header: 'Route Name',
      accessor: (route) => (
        <Link
          to={`/routes/${route.id}`}
          className="font-medium text-primary hover:underline"
        >
          {route.name}
        </Link>
      ),
    },
    {
      header: 'Driver',
      accessor: (route) => route.driverId ?? 'Unassigned',
    },
    {
      header: 'Students',
      accessor: (route) => route.studentIds.length,
    },
    {
      header: 'Status',
      accessor: (route) => (
        <Badge color={STATUS_BADGE_COLOR[route.status]}>
          {formatStatusLabel(route.status)}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (route) => (
        <div className="flex gap-3">
          <Link to={`/routes/${route.id}`} className="text-primary hover:underline">
            View
          </Link>
          <button
            type="button"
            onClick={() => {
              setAssigningRoute(route);
              setSelectedDriverId(route.driverId ?? '');
            }}
            className="text-primary hover:underline"
          >
            Assign Driver
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Routes"
        description="Create and manage bus routes"
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Create Route</Button>
        }
      />

      {routesQuery.isLoading ? (
        <LoadingSpinner label="Loading routes…" />
      ) : routesQuery.isError ? (
        <p className="text-accent">Failed to load routes. Please try again.</p>
      ) : (
        <Table
          columns={columns}
          data={routesQuery.data ?? []}
          rowKey={(route) => route.id}
          emptyMessage="No routes found. Create your first route to get started."
        />
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Create Route"
        footer={
          <>
            <Button variant="ghost" onClick={closeCreateModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-route-form"
              isLoading={createRouteMutation.isPending}
            >
              Save Route
            </Button>
          </>
        }
      >
        <form
          id="create-route-form"
          onSubmit={handleSubmit((values) => createRouteMutation.mutate(values))}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Route Name"
            error={errors.name?.message}
            {...register('name', { required: 'Route name is required' })}
          />
          <Input label="Bus ID (optional)" {...register('busId')} />
          <Input
            label="First Stop Name"
            error={errors.stopName?.message}
            {...register('stopName', { required: 'Stop name is required' })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stop Latitude"
              type="number"
              step="any"
              error={errors.stopLatitude?.message}
              {...register('stopLatitude', {
                required: 'Latitude is required',
                valueAsNumber: true,
              })}
            />
            <Input
              label="Stop Longitude"
              type="number"
              step="any"
              error={errors.stopLongitude?.message}
              {...register('stopLongitude', {
                required: 'Longitude is required',
                valueAsNumber: true,
              })}
            />
          </div>
          {createRouteMutation.isError && (
            <p className="text-sm text-accent">
              {getApiErrorMessage(createRouteMutation.error)}
            </p>
          )}
        </form>
      </Modal>

      <Modal
        isOpen={assigningRoute !== null}
        onClose={closeAssignModal}
        title={`Assign Driver — ${assigningRoute?.name ?? ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={closeAssignModal}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignSubmit}
              isLoading={assignDriverMutation.isPending}
              disabled={!selectedDriverId}
            >
              Assign
            </Button>
          </>
        }
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Select driver</span>
          <select
            value={selectedDriverId}
            onChange={(event) => setSelectedDriverId(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="">— Choose a driver —</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.user?.name ?? driver.userId} ({driver.licenseNumber})
              </option>
            ))}
          </select>
        </label>
        {assignDriverMutation.isError && (
          <p className="mt-2 text-sm text-accent">
            {getApiErrorMessage(assignDriverMutation.error)}
          </p>
        )}
      </Modal>
    </div>
  );
}

export default RoutesPage;
