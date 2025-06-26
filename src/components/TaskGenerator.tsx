"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export function TaskGenerator() {
  const [topic, setTopic] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateTasks = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending request with topic:", topic); // Debug log 1

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      console.log("API Response Status:", response.status); // Debug log 2

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText); // Debug log 3
        throw new Error(`Failed to generate tasks: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Debug log 4

      setGeneratedTasks(data.tasks || []);
    } catch (error) {
      console.error("Generation Error:", error); // Debug log 5
      toast({
        title: "Error",
        description: "Failed to generate tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g. Learn Next.js)"
        />
        <Button onClick={generateTasks} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Tasks"}
        </Button>
      </div>

      {generatedTasks.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Generated Tasks:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {generatedTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}