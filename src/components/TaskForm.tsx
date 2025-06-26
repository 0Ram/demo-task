"use client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import * as React from "react";

interface Task {
  id: string;
  content: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high";
}

export function TaskForm({ 
  task, 
  onSubmit 
}: { 
  task?: Task; 
  onSubmit: (task: Partial<Task>) => void 
}) {
  const [date, setDate] = React.useState<Date | undefined>(task?.dueDate);
  const [priority, setPriority] = React.useState(task?.priority || "medium");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <div className="flex gap-2">
          {["low", "medium", "high"].map((level) => (
            <Button
              key={level}
              variant={priority === level ? "default" : "outline"}
              size="sm"
              onClick={() => setPriority(level as "low" | "medium" | "high")}
            >
              <Flag className="h-4 w-4 mr-2" />
              {level}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}