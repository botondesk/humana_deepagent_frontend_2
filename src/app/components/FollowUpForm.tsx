import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, ChevronsUpDown, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface FollowUpFormProps {
    onGenerate: (text: string) => void;
    onClose: () => void;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({
    onGenerate,
    onClose,
}) => {
    const [userPrompt, setUserPrompt] = useState("");
    const [toolsToUse, setToolsToUse] = useState<string[]>([]);
    const [conceptNames, setConceptNames] = useState("");
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toolsOptions = [
        {
            value: "db_search_tool",
            description: "This tool will search the database for your specific question",
        },
        {
            value: "quant_search_tool",
            description:
                "This tool will search the quantitative pdf for your specific question",
        },
        {
            value: "qual_search_tool",
            description:
                "This tool will search the qualitative pdf for your specific question",
        },
    ];

    const toggleTool = (tool: string) => {
        setToolsToUse((current) =>
            current.includes(tool)
                ? current.filter((t) => t !== tool)
                : [...current, tool]
        );
    };

    const handleGenerate = () => {
        const parts = [];
        if (userPrompt.trim()) parts.push(`${userPrompt.trim()}`);
        if (toolsToUse.length > 0) parts.push(`tools_to_use: [${toolsToUse.join(", ")}]`);
        if (conceptNames.trim()) {
            const formattedConcepts = conceptNames
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c !== "")
                .join(", ");
            parts.push(`concept_names: [${formattedConcepts}]`);
        }

        const generatedText = parts.join("\n\n");
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
            <h3 className="mb-4 text-sm font-semibold">Follow Up Question</h3>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="user_prompt">User Prompt</Label>
                    <Textarea
                        id="user_prompt"
                        placeholder="Enter your follow up question..."
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        rows={2}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="tools_to_use">Tools to Use</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info size={14} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">
                                        Select the tools best suited for your query to ensure precise and relevant results.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="relative" ref={dropdownRef}>
                            <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                aria-expanded={isToolsOpen}
                                className="w-full justify-between"
                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                            >
                                {toolsToUse.length > 0
                                    ? `${toolsToUse.length} selected`
                                    : "Select tools..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            {isToolsOpen && (
                                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                                    {toolsOptions.map((tool) => (
                                        <Tooltip key={tool.value}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(
                                                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                                                        toolsToUse.includes(tool.value) &&
                                                        "bg-accent text-accent-foreground"
                                                    )}
                                                    onClick={() => toggleTool(tool.value)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            toolsToUse.includes(tool.value)
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <Check className={cn("h-4 w-4")} />
                                                    </div>
                                                    <span>{tool.value}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" align="start">
                                                <p>{tool.description}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="additional_concepts">Additional Concept Names</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info size={14} className="text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">
                                        We match the concepts you provide—and the ones we automatically detect—to the right database tables. This keeps your results relevant and accurate.
                                        This feature is available only when the <strong>db_search_tool</strong> is selected.
                                        Use the provided link to search for relevant concept names and paste them here.
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                            <a
                                href="http://52.71.104.149:8200/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-xs text-muted-foreground hover:text-primary hover:underline"
                                title="Search for concept names"
                            >
                                <ExternalLink size={12} className="mr-1" />
                                Search Concepts
                            </a>
                        </div>
                        <Input
                            id="additional_concepts"
                            placeholder="e.g., SocialDeterminant, SNAPHouseholdAgeClassification"
                            value={conceptNames}
                            onChange={(e) => setConceptNames(e.target.value)}
                            disabled={!toolsToUse.includes("db_search_tool")}
                        />
                    </div>
                </div>

                <Button onClick={handleGenerate} className="mt-2">
                    Generate & Fill
                </Button>
            </div>
        </div>
    );
};