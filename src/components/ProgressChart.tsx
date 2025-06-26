"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Task } from "@/components/TaskList"; // ✅ Import Task

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function ProgressChart({ tasks }: { tasks: Task[] }) {
  const data = [
    { name: "Completed", value: tasks.filter(t => t.completed).length },
    { name: "Pending", value: tasks.filter(t => !t.completed).length },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} // ✅ percent safe
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}