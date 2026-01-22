import { Button } from "@/components/ui/button";
import { EventForm } from "@/pages/EventForm";
import InquiryForm from "@/pages/InquiryForm";
import LoginForm from "@/pages/LoginForm";
import { ProductForm } from "@/pages/ProductForm";
import StudentForm from "@/pages/StudentForm";
import Todo from "@/pages/Todo";
import { UserForm } from "@/pages/UserForm";
import { Routes, Route, Link, useNavigate, NavLink } from "react-router";

export default function Router() {
  const navigate = useNavigate();
  return (
    <>
      <header className="flex gap-3 list-none justify-center ">
        <Button onClick={() => navigate("/")}>Logo </Button>
        <NavLink to="/">
          <li>Login</li>
        </NavLink>
        <NavLink to="/student">
          <li>Student</li>
        </NavLink>
        <NavLink to="/inquiry">
          <li>Inquiry</li>
        </NavLink>
        <NavLink to="/event">
          <li>Event</li>
        </NavLink>
        <NavLink to="/user">
          <li>User</li>
        </NavLink>
        <NavLink to="/product">
          <li>Product</li>
        </NavLink>
        <NavLink to="/todo">
          <li>Todo</li>
        </NavLink>
      </header>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/student/create" element={<StudentForm />} />
        <Route path="/student" element={<StudentForm />} />
        <Route path="/inquiry" element={<InquiryForm />} />
        <Route path="/event" element={<EventForm />} />
        <Route path="/user" element={<UserForm />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </>
  );
}
