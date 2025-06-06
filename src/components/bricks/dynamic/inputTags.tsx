import { Input } from "@/components/ui/input";
import React, { useState, useRef, KeyboardEvent, ChangeEvent, FC } from "react";

interface TagInputProps {
    /** Pre-populate with these tags (optional). */
    initialTags?: string[];
    /** Called whenever the tag array changes. */
    onChange?: (tags: string[]) => void;
    /** Placeholder text for the input. */
    placeholder?: string;
    /** Optional container className (e.g. to control width). */
    className?: string;
}

const TagInput: FC<TagInputProps> = ({
    initialTags = [],
    onChange = () => {},
    placeholder = "Type and hit Enter max 10 tags",
    className = "max-w-md",
}) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /** Helper to notify parent and update local state. */
    const updateTags = (newTags: string[]) => {
        setTags(newTags);
        onChange(newTags);
    };

    /** When user presses Enter or comma, attempt to add a new tag. */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const trimmed = inputValue.trim();

        if ((e.key === "Enter" || e.key === ",") && trimmed !== "") {
            e.preventDefault();
            // Avoid duplicates
            if (!tags.includes(trimmed) && tags.length < 10) {
                // Only add if not already present and under limit
                updateTags([...tags, trimmed]);
            }
            setInputValue("");
        }

        // If Backspace on empty input, remove last tag
        if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            e.preventDefault();
            const reduced = tags.slice(0, tags.length - 1);
            updateTags(reduced);
        }
    };

    /** Remove a specific tag when user clicks the “×”. */
    const removeTag = (tagToRemove: string) => {
        const filtered = tags.filter((t) => t !== tagToRemove);
        updateTags(filtered);
        // Refocus the input after removing
        inputRef.current?.focus();
    };

    /** Update internal input value on change. */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <div className={className}>
            <div
                className="
          flex flex-wrap items-center gap-1
          px-2 py-1
          border border-gray-300 rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
          cursor-text
        "
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center bg-indigo-100 text-indigo-700 rounded-[3px] px-2 py-0.5 text-sm"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 focus:outline-none"
                            aria-label={`Remove ${tag}`}
                        >
                            &times;
                        </button>
                    </span>
                ))}

                <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 min-w-[120px] py-1 px-1 text-sm outline-none bg-transparent border-none focus:ring-0 focus-visible:ring-0 ${tags.length === 10 && "placeholder:text-destructive"} `}
                    placeholder={
                        tags.length === 10
                            ? "Maximum of 10 tags exceeded. Ignoring additional tags."
                            : placeholder
                    }
                />
            </div>
        </div>
    );
};

export default TagInput;
