import { EventForm } from "@/pages/EventForm";
import EventList from "@/pages/EventList";
import InquiryForm from "@/pages/InquiryForm";
import InquiryList from "@/pages/InquiryList";
import LoginForm from "@/pages/LoginForm";
import { ProductForm } from "@/pages/ProductForm";
import StudentList from "@/pages/StudentList";
import StudentForm from "@/pages/StudentForm";
import Todo from "@/pages/Todo";
import TodoList from "@/pages/TodoList";
import { UserForm } from "@/pages/UserForm";
import Home from "@/pages/Home";
import Sidebar from "@/Layout/Sidebar";
import TopNav from "@/Layout/TopNav";
import { Routes, Route } from "react-router";
import Layout from "@/Layout/Layout";
import UserList from "@/pages/UserList";
import { CourseForm } from "@/pages/CourseForm";

import NotFound from "@/pages/NotFound";
import ProductList from "@/pages/ProductList";

export default function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/create" element={<StudentForm />} />
        <Route path="/student/edit/:id" element={<StudentForm />} />
        <Route path="/student" element={<StudentList />} />
        <Route path="/inquiry/create" element={<InquiryForm />} />
        <Route path="/inquiry/edit/:id" element={<InquiryForm />} />
        <Route path="/inquiry" element={<InquiryList />} />
        <Route path="/inquiry/edit/:id" element={<CourseForm />} />
        <Route path="/course" element={<CourseForm />} />
        <Route path="/event/create" element={<EventForm />} />
        <Route path="/event/create" element={<EventForm />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/user" element={<UserList/>} />
        <Route path="/user/create" element={<UserForm />} />
        <Route path="/user/edit/:id" element={<UserForm />} />
        <Route path="/product/create" element={<ProductForm />} />
        <Route path="/product" element={<ProductList />} />

        <Route path="/todo" element={<Todo />} />
        <Route path="/todoList" element={<TodoList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
