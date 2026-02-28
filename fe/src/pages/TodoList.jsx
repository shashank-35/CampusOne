import React, { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const PriorityBadge = ({ priority }) => {
  const styles = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[priority] || "bg-gray-100 text-gray-700"}`}>
      {priority}
    </span>
  );
};

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // TODO: Add fetchTodos function with API call
  // TODO: Add useEffect to fetch on mount

  const toggleComplete = async (todo) => {
    // TODO: Add API update call
  };

  const handleDelete = async (id) => {
    // TODO: Add API delete call
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
          <Link to="/todo">
            <Button className="bg-black hover:bg-zinc-800 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Todo
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No todos yet. Create one!</div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo._id}
                className={`bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm ${
                  todo.status === "completed" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleComplete(todo)}
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition ${
                      todo.status === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {todo.status === "completed" && <Check className="h-3 w-3" />}
                  </button>
                  <div>
                    <p className={`font-medium ${todo.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {todo.todo}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <PriorityBadge priority={todo.priority} />
                      <span className="text-xs text-gray-500 capitalize">{todo.category}</span>
                      {todo.important && <span className="text-xs text-orange-500 font-medium">Important</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDelete(todo._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
