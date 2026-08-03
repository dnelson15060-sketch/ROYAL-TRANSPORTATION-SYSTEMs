import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Modal } from '../../components/ui/Modal';
import { Table, type TableColumn } from '../../components/ui/Table';
import { getApiErrorMessage, useApiMutation, useApiQuery } from '../../hooks/useApi';
import {
  createStudent,
  getStudents,
  type CreateStudentPayload,
} from '../../services/studentService';
import type { Student } from '../../types';

export function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const studentsQuery = useApiQuery(['students'], getStudents);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStudentPayload>();

  const createStudentMutation = useApiMutation(createStudent, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      reset();
      setIsModalOpen(false);
    },
  });

  function onSubmit(values: CreateStudentPayload) {
    createStudentMutation.mutate(values);
  }

  function closeModal() {
    setIsModalOpen(false);
    reset();
    createStudentMutation.reset();
  }

  const columns: TableColumn<Student>[] = [
    {
      header: 'Name',
      accessor: (student) => (
        <Link
          to={`/students/${student.id}`}
          className="font-medium text-primary hover:underline"
        >
          {student.name}
        </Link>
      ),
    },
    { header: 'Grade', accessor: (student) => student.grade },
    { header: 'School', accessor: (student) => student.school },
    { header: 'Parent', accessor: (student) => student.parentId },
    { header: 'Route', accessor: (student) => student.routeId ?? '—' },
    {
      header: 'Status',
      accessor: (student) => (
        <Badge color={student.status === 'active' ? 'green' : 'red'}>
          {student.status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Students"
        description="Manage student roster and route enrollment"
        actions={<Button onClick={() => setIsModalOpen(true)}>+ Add Student</Button>}
      />

      {studentsQuery.isLoading ? (
        <LoadingSpinner label="Loading students…" />
      ) : studentsQuery.isError ? (
        <p className="text-accent">Failed to load students. Please try again.</p>
      ) : (
        <Table
          columns={columns}
          data={studentsQuery.data ?? []}
          rowKey={(student) => student.id}
          emptyMessage="No students found. Add your first student to get started."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add Student"
        footer={
          <>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-student-form"
              isLoading={createStudentMutation.isPending}
            >
              Save Student
            </Button>
          </>
        }
      >
        <form
          id="create-student-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Student Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Parent ID"
            placeholder="Firebase UID of the parent account"
            error={errors.parentId?.message}
            {...register('parentId', { required: 'Parent ID is required' })}
          />
          <Input
            label="Grade"
            placeholder="e.g. 5th Grade"
            error={errors.grade?.message}
            {...register('grade', { required: 'Grade is required' })}
          />
          <Input
            label="School"
            error={errors.school?.message}
            {...register('school', { required: 'School is required' })}
          />
          <Input label="Route ID (optional)" {...register('routeId')} />
          <Input
            label="Seat Number (optional)"
            type="number"
            {...register('seatNumber', { valueAsNumber: true })}
          />
          {createStudentMutation.isError && (
            <p className="text-sm text-accent">
              {getApiErrorMessage(createStudentMutation.error)}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default StudentsPage;
