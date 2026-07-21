import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function Card({
  title,
  actions,
  children,
  className = '',
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}
      {...rest}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
