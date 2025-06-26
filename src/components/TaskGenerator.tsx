"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

export function TaskGenerator() {
  const [topic, setTopic] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTasks = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      
      const data = await response.json();
      setGeneratedTasks(data.tasks || []);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Generate Learning Tasks
        </h2>
        <p className="text-sm text-gray-600">
          Enter any topic you want to learn
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Learn C, Study React, Master Python"
          className="flex-1"
        />
        <Button onClick={generateTasks} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate
            </span>
          )}
        </Button>
      </div>

      {generatedTasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Suggested Tasks</h3>
          <ul className="space-y-3">
            {generatedTasks.map((task, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <span className="flex-1 text-gray-800">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}