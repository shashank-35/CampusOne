import { EventForm } from "@/pages/EventForm";
import EventList from "@/pages/EventList";
import InquiryForm from "@/pages/InquiryForm";
import InquiryList from "@/pages/InquiryList";
import LoginForm from "@/pages/LoginForm";
import { ProductForm } from "@/pages/ProductForm";
import StudentList from "@/pages/StudentList";
import StudentForm from "@/pages/StudentForm";

import { UserForm } from "@/pages/UserForm";
import Home from "@/pages/Home";
import Layout from "@/Layout/Layout";
import UserList from "@/pages/UserList";
import { CourseForm } from "@/pages/CourseForm";
import CourseList from "@/pages/CourseList";
import { NotFound } from "@/pages/404NotFound";
import ProductList from "@/pages/ProductList";
import StudentHome from "@/pages/StudentHome";
import { Routes, Route } from "react-router";

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/student-home" element={<StudentHome />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/student/create" element={<StudentForm />} />
        <Route path="/student/edit/:id" element={<StudentForm />} />
        <Route path="/student" element={<StudentList />} />
        <Route path="/inquiry/create" element={<InquiryForm />} />
        <Route path="/inquiry/edit/:id" element={<InquiryForm />} />
        <Route path="/inquiry" element={<InquiryList />} />
        <Route path="/course/create" element={<CourseForm />} />
        <Route path="/course/edit/:id" element={<CourseForm />} />
        <Route path="/course" element={<CourseList />} />
        <Route path="/event/create" element={<EventForm />} />
        <Route path="/event/edit/:id" element={<EventForm />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<UserForm />} />
        <Route path="/user/edit/:id" element={<UserForm />} />
        <Route path="/product/create" element={<ProductForm />} />
        <Route path="/product/edit/:id" element={<ProductForm />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
