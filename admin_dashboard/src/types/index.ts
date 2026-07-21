export interface User {
  uid: string;
  email: string;
  name: string;
  role: 'parent' | 'driver' | 'admin';
  phone?: string;
  fcmToken?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  vehicleId?: string;
  rating: number;
  status: 'active' | 'inactive' | 'on_route';
  assignedRoutes: string[];
  user?: User;
}

export interface Student {
  id: string;
  name: string;
  parentId: string;
  routeId?: string;
  grade: string;
  school: string;
  seatNumber?: number;
  status: 'active' | 'inactive';
}

export interface RouteStop {
  name: string;
  latitude: number;
  longitude: number;
  order: number;
  estimatedTime?: string;
}

export interface Route {
  id: string;
  name: string;
  driverId?: string;
  busId?: string;
  stops: RouteStop[];
  studentIds: string[];
  status: 'active' | 'inactive' | 'in_progress' | 'completed';
  startTime?: string;
  endTime?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardSummary {
  totalRoutes: number;
  activeRoutes: number;
  totalStudents: number;
  totalDrivers: number;
}

export interface WeeklyAttendancePoint {
  day: string;
  present: number;
  absent: number;
}
