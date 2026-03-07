import { Routes, Route } from 'react-router';
import Layout from '@/Layout/Layout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import StudentPrivateRoute from './StudentPrivateRoute';
import StudentPublicRoute from './StudentPublicRoute';
import StudentLayout from '@/student/layout/StudentLayout';

// Landing
import LandingPage from '@/landing/LandingPage';

// Auth
import LoginForm from '@/pages/LoginForm';

// Public
import PublicInquiryForm from '@/pages/PublicInquiryForm';

// Admin/Staff pages
import Home from '@/pages/Home';
import StudentList from '@/pages/StudentList';
import StudentForm from '@/pages/StudentForm';
import InquiryList from '@/pages/InquiryList';
import InquiryForm from '@/pages/InquiryForm';
import CourseList from '@/pages/CourseList';
import { CourseForm } from '@/pages/CourseForm';
import EventList from '@/pages/EventList';
import { EventForm } from '@/pages/EventForm';
import UserList from '@/pages/UserList';
import { UserForm } from '@/pages/UserForm';
import ProductList from '@/pages/ProductList';
import { ProductForm } from '@/pages/ProductForm';
import Profile from '@/pages/Profile';
import QRCodePage from '@/pages/QRCodePage';
import ActivityLog from '@/pages/ActivityLog';
import AdmissionList from '@/pages/AdmissionList';
import TicketList from '@/pages/TicketList';
import AdmissionForm from '@/pages/AdmissionForm';
import AdmissionDetail from '@/pages/AdmissionDetail';
import PaymentList from '@/pages/PaymentList';
import PaymentForm from '@/pages/PaymentForm';
import PaymentDetail from '@/pages/PaymentDetail';

// Student portal pages
import StudentLogin from '@/pages/student/StudentLogin';
import StudentDashboard from '@/student/pages/Dashboard';
import StudentProfile from '@/student/pages/Profile';
import StudentCourses from '@/student/pages/Courses';
import StudentEvents from '@/student/pages/Events';
import StudentInquiryStatus from '@/student/pages/Inquiry';
import StudentNotifications from '@/student/pages/Notifications';
import StudentSupport from '@/student/pages/Support';
import StudentSettings from '@/student/pages/Settings';

import { NotFound } from '@/pages/404NotFound';

export default function Router() {
  return (
    <Routes>
      {/* Landing page — public, shown to unauthenticated users */}
      <Route path="/" element={<LandingPage />} />

      {/* Fully public */}
      <Route path="/inquiry-form" element={<PublicInquiryForm />} />

      {/* Admin/staff auth (redirects to /dashboard if already logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginForm />} />
      </Route>

      {/* Student auth */}
      <Route element={<StudentPublicRoute />}>
        <Route path="/student-login" element={<StudentLogin />} />
      </Route>

      {/* Admin/Staff portal */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Home />} />

          <Route path="/inquiry"           element={<InquiryList />} />
          <Route path="/inquiry/create"    element={<InquiryForm />} />
          <Route path="/inquiry/edit/:id"  element={<InquiryForm />} />

          <Route path="/student"           element={<StudentList />} />
          <Route path="/student/create"    element={<StudentForm />} />
          <Route path="/student/edit/:id"  element={<StudentForm />} />

          <Route path="/course"            element={<CourseList />} />
          <Route path="/course/create"     element={<CourseForm />} />
          <Route path="/course/edit/:id"   element={<CourseForm />} />

          <Route path="/event"             element={<EventList />} />
          <Route path="/event/create"      element={<EventForm />} />
          <Route path="/event/edit/:id"    element={<EventForm />} />

          <Route path="/user"              element={<UserList />} />
          <Route path="/user/create"       element={<UserForm />} />
          <Route path="/user/edit/:id"     element={<UserForm />} />

          <Route path="/product"           element={<ProductList />} />
          <Route path="/product/create"    element={<ProductForm />} />
          <Route path="/product/edit/:id"  element={<ProductForm />} />

          <Route path="/admission"           element={<AdmissionList />} />
          <Route path="/admission/create"    element={<AdmissionForm />} />
          <Route path="/admission/edit/:id"  element={<AdmissionForm />} />
          <Route path="/admission/:id"       element={<AdmissionDetail />} />

          <Route path="/payment"             element={<PaymentList />} />
          <Route path="/payment/create"      element={<PaymentForm />} />
          <Route path="/payment/edit/:id"    element={<PaymentForm />} />
          <Route path="/payment/:id"         element={<PaymentDetail />} />

          <Route path="/profile"           element={<Profile />} />
          <Route path="/qr-code"           element={<QRCodePage />} />
          <Route path="/activity-log"      element={<ActivityLog />} />
          <Route path="/tickets"           element={<TicketList />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Student portal */}
      <Route element={<StudentPrivateRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/student-dashboard"      element={<StudentDashboard />} />
          <Route path="/student-profile"        element={<StudentProfile />} />
          <Route path="/student-courses"        element={<StudentCourses />} />
          <Route path="/student-events"         element={<StudentEvents />} />
          <Route path="/student-inquiry-status" element={<StudentInquiryStatus />} />
          <Route path="/student-notifications"  element={<StudentNotifications />} />
          <Route path="/student-support"        element={<StudentSupport />} />
          <Route path="/student-settings"       element={<StudentSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
