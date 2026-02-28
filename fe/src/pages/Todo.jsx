import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Todo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [todo, setTodo] = useState("");
  const [important, setImportant] = useState(false);
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  const priorityOptions = ["low", "medium", "high"];
  const categoryOptions = ["work", "personal", "study"];

  // TODO: Add API call in addTodoHandler

  const addTodoHandler = async (e) => {
    e.preventDefault();
    console.log("Form data:", { todo, important, priority, category });
    navigate("/todoList");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={addTodoHandler} className="space-y-5 w-80 border p-5 rounded-2xl">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>
        )}

        <Input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="enter your task"
          required
          className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
          />
          Mark as important
        </label>

        <div className="space-y-2">
          <p className="text-sm font-medium">Priority</p>
          {priorityOptions.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="priority"
                value={item}
                checked={priority === item}
                onChange={(e) => setPriority(e.target.value)}
              />
              {item}
            </label>
          ))}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md px-2 hover:border-gray-400 focus:border-black focus:outline-none"
        >
          <option value="">Select category</option>
          {categoryOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <Button
          type="submit"
          disabled={loading}
          variant="outline"
          className="w-full h-11 text-base border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </div>
  );
}
