import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function Todo() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      todo: "",
      important: false,
      priority: "",
      category: "",
    },
  });

  const priorityOptions = ["low", "medium", "high"];
  const categoryOptions = ["work", "personal", "study"];

  const addTodoHandler = (data) => {
    console.log("🚀 Final Todo Data:", data);
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit(addTodoHandler)} className="space-y-5 w-80 border p-5 rounded-2xl">

        {/* Todo Input */}
        <Controller
          name="todo"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="enter your task"
              className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          )}
        />

        {/* Checkbox */}
        <Controller
          name="important"
          control={control}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              Mark as important
            </label>
          )}
        />

        {/* Radio */}
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <p className="text-sm font-medium">Priority</p>
              {priorityOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    value={item}
                    checked={field.value === item}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {item}
                </label>
              ))}
            </div>
          )}
        />

        {/* Select */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              className="w-full h-10 border border-gray-300 rounded-md px-2
                         hover:border-gray-400 focus:border-black focus:outline-none"
            >
              <option value="">Select category</option>
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="outline"
          className="w-full h-11 text-base
                     border-gray-300
                     hover:bg-gray-900
                     hover:text-white
                     hover:border-gray-900"
        >
          Add Task
        </Button>
      </form>
    </div>
  );
}
