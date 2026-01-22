import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Controller, useForm } from "react-hook-form";

export default function Todo() {
  const { control, handleSubmit, reset } = useForm({
    defaultValue: {
      todo: "",
    },
  });

  const addTodoHandler = (data) => {
    console.log("🚀 ~ addTodoHandler ~ data:", data);
    reset({
      todo: "",
    });
  };
  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(addTodoHandler)} className="space-y-5">
        {/* Email */}
        <div className="group">
          <Controller
            name="todo"
            control={control}
            render={({ field }) => {
              return (
                <Input
                  {...field}
                  type="text"
                  placeholder="enter your task"
                  className="hover:border-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              );
            }}
          />
        </div>

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
