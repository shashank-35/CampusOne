import { EventForm } from "@/pages/EventForm";
import InquiryForm from "@/pages/InquiryForm";
import LoginForm from "@/pages/LoginForm";
import { ProductForm } from "@/pages/ProductForm";
import StudentForm from "@/pages/StudentForm";
import Todo from "@/pages/Todo";
import TodoList from "@/pages/TodoList";
import { UserForm } from "@/pages/UserForm";
import Home from "@/pages/Home";
import Sidebar from "@/Layout/Sidebar";
import TopNav from "@/Layout/TopNav";
import { Routes, Route } from "react-router";
import Layout from "@/Layout/Layout";

export default function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/create" element={<StudentForm />} />
        <Route path="/student" element={<StudentForm />} />
        <Route path="/inquiry" element={<InquiryForm />} />
        <Route path="/event" element={<EventForm />} />
        <Route path="/user" element={<UserForm />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/todoList" element={<TodoList />} />
      </Routes>
    </Layout>
  );
}
