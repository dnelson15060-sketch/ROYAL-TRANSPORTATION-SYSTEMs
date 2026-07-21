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
import {
  createDriver,
  getDrivers,
  type CreateDriverPayload,
} from '../../services/driverService';
import type { Driver } from '../../types';
import { formatStatusLabel } from '../../utils/helpers';

const STATUS_BADGE_COLOR: Record<Driver['status'], BadgeColor> = {
  active: 'green',
  on_route: 'yellow',
  inactive: 'red',
};

export function DriversPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const driversQuery = useApiQuery(['drivers'], getDrivers);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDriverPayload>();

  const createDriverMutation = useApiMutation(createDriver, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      reset();
      setIsModalOpen(false);
    },
  });

  function onSubmit(values: CreateDriverPayload) {
    createDriverMutation.mutate(values);
  }

  function closeModal() {
    setIsModalOpen(false);
    reset();
    createDriverMutation.reset();
  }

  const columns: TableColumn<Driver>[] = [
    {
      header: 'Name',
      accessor: (driver) => (
        <Link
          to={`/drivers/${driver.id}`}
          className="font-medium text-primary hover:underline"
        >
          {driver.user?.name ?? driver.userId}
        </Link>
      ),
    },
    { header: 'License', accessor: (driver) => driver.licenseNumber },
    {
      header: 'Status',
      accessor: (driver) => (
        <Badge color={STATUS_BADGE_COLOR[driver.status]}>
          {formatStatusLabel(driver.status)}
        </Badge>
      ),
    },
    {
      header: 'Assigned Routes',
      accessor: (driver) => driver.assignedRoutes.length,
    },
    {
      header: 'Actions',
      accessor: (driver) => (
        <Link to={`/drivers/${driver.id}`} className="text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Manage bus drivers and their route assignments"
        actions={<Button onClick={() => setIsModalOpen(true)}>+ Add Driver</Button>}
      />

      {driversQuery.isLoading ? (
        <LoadingSpinner label="Loading drivers…" />
      ) : driversQuery.isError ? (
        <p className="text-accent">Failed to load drivers. Please try again.</p>
      ) : (
        <Table
          columns={columns}
          data={driversQuery.data ?? []}
          rowKey={(driver) => driver.id}
          emptyMessage="No drivers found. Add your first driver to get started."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add Driver"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-driver-form"
              isLoading={createDriverMutation.isPending}
            >
              Save Driver
            </Button>
          </>
        }
      >
        <form
          id="create-driver-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="User ID"
            placeholder="Firebase UID of the driver's user account"
            error={errors.userId?.message}
            {...register('userId', { required: 'User ID is required' })}
          />
          <Input
            label="License Number"
            placeholder="e.g. DL-123456"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber', {
              required: 'License number is required',
            })}
          />
          <Input
            label="Vehicle ID (optional)"
            placeholder="e.g. BUS-07"
            {...register('vehicleId')}
          />
          {createDriverMutation.isError && (
            <p className="text-sm text-accent">
              {getApiErrorMessage(createDriverMutation.error)}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default DriversPage;
