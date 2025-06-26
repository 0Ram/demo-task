import { TaskGenerator } from "@/components/TaskGenerator";
import { TaskList } from "@/components/TaskList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Task Genius
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered learning task generator
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="bg-white rounded-xl shadow-md p-6">
            <TaskGenerator />
          </section>
          <section className="bg-white rounded-xl shadow-md p-6">
            <TaskList />
          </section>
        </div>
      </div>
    </main>
  );
}