import { TaskGenerator } from "@/components/TaskGenerator";
import { TaskList } from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Task Genius</h1>
      <TaskGenerator />
      <TaskList />
    </main>
  );
}