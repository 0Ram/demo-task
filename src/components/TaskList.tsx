// components/TaskList.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/progress";

interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch tasks from the API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error("Failed to update task");
      fetchTasks(); // Refresh the task list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");
      fetchTasks(); // Refresh the task list
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

 // Calculate progress percentage
const completedCount = tasks.filter(t => t.completed).length;
const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

// In your JSX:
<Progress value={progress} />

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <h3 className="font-medium">Task Progress</h3>
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground">
          {completedCount} of {tasks.length} tasks completed
        </p>
      </div>

      <h3 className="font-medium">Your Tasks</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length > 0 ? (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center p-2 border rounded">
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.content}
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={task.completed ? "outline" : "default"}
                  onClick={() => toggleCompletion(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks saved yet.</p>
      )}
    </div>
  );
}