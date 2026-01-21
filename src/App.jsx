import { useState } from "react";

import "./App.css";
import LoginForm from "./pages/LoginForm";
import StudentForm from "./pages/StudentForm";
import InquiryForm from "./pages/InquiryForm";
import { EventForm } from "./pages/EventForm";
import { BrowserRouter, Routes, Route } from "react-router";
import { UserForm } from "./pages/UserForm";
import { ProductForm } from "./pages/ProductForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/student/create" element={<StudentForm />} />
          <Route path="/inquiry" element={<InquiryForm />} />
          <Route path="/event" element={<EventForm />} />
          <Route path="/user" element={<UserForm />} />
          <Route path="/product" element={<ProductForm />} />
        </Routes>

        {/* <StudentForm />
        <InquiryForm />
        <EventForm /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
