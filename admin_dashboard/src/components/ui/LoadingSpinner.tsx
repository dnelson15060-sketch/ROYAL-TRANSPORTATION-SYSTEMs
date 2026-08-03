export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES: Record<NonNullable<LoadingSpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md', label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8" role="status">
      <span
        className={`animate-spin rounded-full border-primary border-t-transparent ${SIZE_CLASSES[size]}`}
        aria-hidden="true"
      />
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
