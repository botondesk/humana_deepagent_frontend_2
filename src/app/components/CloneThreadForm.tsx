import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface CloneThreadFormProps {
    onGenerate: (text: string) => void;
    onClose: () => void;
}

export const CloneThreadForm: React.FC<CloneThreadFormProps> = ({
    onGenerate,
    onClose,
}) => {
    const [threadId, setThreadId] = useState("");

    const handleGenerate = () => {
        if (!threadId.trim()) return;

        const generatedText = `get the file state from this thread_id: ${threadId.trim()} and write the question.md and final_report.md to the current file system using write_file tool`;
        onGenerate(generatedText);
    };

    return (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm mb-4 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={onClose}
            >
                <X size={14} />
            </Button>
            <h3 className="mb-4 text-sm font-semibold">Clone Thread</h3>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="clone_thread_id">Thread ID</Label>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info size={14} className="text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    Use a previous thread ID to copy its file state.
                                    This ensures continuity while preventing context overload.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <Input
                        id="clone_thread_id"
                        placeholder="Enter thread ID to clone..."
                        value={threadId}
                        onChange={(e) => setThreadId(e.target.value)}
                    />
                </div>

                <Button onClick={handleGenerate} className="mt-2">
                    Generate Command
                </Button>
            </div>
        </div>
    );
};