"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/progress";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Flag,
  GripVertical,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
  order?: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function SortableTask({
  task,
  toggleCompletion,
  deleteTask,
}: {
  task: Task;
  toggleCompletion: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        task.completed
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        onClick={() => toggleCompletion(task.id)}
        className="text-gray-400 hover:text-green-500 dark:hover:text-green-400"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <span
          className={`block truncate ${
            task.completed
              ? "text-gray-500 line-through dark:text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {task.content}
        </span>
        <div className="flex items-center gap-2 mt-1">
          {task.dueDate && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
          {task.priority && (
            <span
              className={`text-xs flex items-center ${
                priorityColors[task.priority]
              }`}
            >
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </li>
  );
}

function ProgressChart({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="h-64 mt-6 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No tasks available for progress chart
      </div>
    );
  }

  const data = [
    {
      name: "Completed",
      value: tasks.filter((t) => t.completed).length,
      color: COLORS[0],
    },
    {
      name: "Pending",
      value: tasks.filter((t) => !t.completed).length,
      color: COLORS[1],
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-64 mt-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Progress Overview
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => {
              const percent = typeof value === "number" && total > 0 ? (value / total) * 100 : 0;
              return `${name} ${percent.toFixed(0)}%`;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number | string, name: string) => {
              const val = typeof value === "number" ? value : parseFloat(value);
              const percent = total > 0 ? (val / total) * 100 : 0;
              return [`${val} tasks`, `${percent.toFixed(2)}% (${name})`];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });

      fetchTasks();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      fetchTasks();
      toast({ title: "Success", description: "Task deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      return newItems.map((item, index) => ({ ...item, order: index }));
    });

    try {
      await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: active.id,
          newOrder: tasks.findIndex((item) => item.id === over.id),
        }),
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to reorder tasks",
        variant: "destructive",
      });
      fetchTasks(); // Revert if failed
    }
  };

  function arrayMove<T>(array: T[], from: number, to: number): T[] {
    const newArray = array.slice();
    newArray.splice(to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Your Learning Path
        </h2>
        {tasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Progress
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {completedCount}/{tasks.length} completed
              </span>
            </div>
            <Progress value={progress ?? 0} className="h-2" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      ) : tasks.length > 0 ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    toggleCompletion={toggleCompletion}
                    deleteTask={deleteTask}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          <ProgressChart tasks={tasks} />
        </>
      ) : (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500">
          No tasks found. Try generating some!
        </div>
      )}
    </div>
  );
}