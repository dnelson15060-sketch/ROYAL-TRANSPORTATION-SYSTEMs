import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Table, type TableColumn } from '../../components/ui/Table';
import { getApiErrorMessage, useApiMutation, useApiQuery } from '../../hooks/useApi';
import {
  getNotificationHistory,
  sendNotification,
  type SendNotificationPayload,
} from '../../services/notificationService';
import type { Notification } from '../../types';
import { formatDateTime } from '../../utils/helpers';

export function NotificationsPage() {
  const queryClient = useQueryClient();

  const historyQuery = useApiQuery(
    ['notifications'],
    getNotificationHistory
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendNotificationPayload>({
    defaultValues: { userId: 'all', title: '', body: '' },
  });

  const sendNotificationMutation = useApiMutation(sendNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      reset({ userId: 'all', title: '', body: '' });
    },
  });

  const columns: TableColumn<Notification>[] = [
    { header: 'Recipient', accessor: (notification) => notification.userId },
    { header: 'Title', accessor: (notification) => notification.title },
    { header: 'Body', accessor: (notification) => notification.body },
    {
      header: 'Sent At',
      accessor: (notification) => formatDateTime(notification.createdAt),
    },
    {
      header: 'Read',
      accessor: (notification) => (notification.read ? 'Yes' : 'No'),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Send push notifications to parents, drivers, or all users"
      />

      <Card title="Send Notification" className="mb-6">
        <form
          onSubmit={handleSubmit((values) => sendNotificationMutation.mutate(values))}
          className="flex flex-col gap-4"
          noValidate
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Recipient</span>
            <select
              className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              {...register('userId', { required: true })}
            >
              <option value="all">All Users</option>
            </select>
            <span className="text-xs text-gray-500">
              Enter a specific Firebase user ID below to target one recipient
              instead.
            </span>
          </label>

          <Input
            label="Target User ID (optional override)"
            placeholder="Leave blank to use the selection above"
            {...register('userId')}
          />

          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Message</span>
            <textarea
              rows={4}
              className={`rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary ${
                errors.body ? 'border-accent' : 'border-gray-300'
              }`}
              {...register('body', { required: 'Message body is required' })}
            />
            {errors.body && (
              <span className="text-xs text-accent">{errors.body.message}</span>
            )}
          </label>

          {sendNotificationMutation.isError && (
            <p className="text-sm text-accent">
              {getApiErrorMessage(sendNotificationMutation.error)}
            </p>
          )}
          {sendNotificationMutation.isSuccess && (
            <p className="text-sm text-green-600">Notification sent successfully.</p>
          )}

          <Button
            type="submit"
            isLoading={sendNotificationMutation.isPending}
            className="self-start"
          >
            Send Notification
          </Button>
        </form>
      </Card>

      <Card title="Notification History">
        {historyQuery.isLoading ? (
          <LoadingSpinner label="Loading notification history…" />
        ) : historyQuery.isError ? (
          <p className="text-accent">Failed to load notification history.</p>
        ) : (
          <Table
            columns={columns}
            data={historyQuery.data ?? []}
            rowKey={(notification) => notification.id}
            emptyMessage="No notifications have been sent yet."
          />
        )}
      </Card>
    </div>
  );
}

export default NotificationsPage;
