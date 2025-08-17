import type {ThoughtBlock} from "../../../../models/types.ts";

export function TextInput({block, onUpdateBlock}: { block: ThoughtBlock, onUpdateBlock: (id: string, updates: Partial<ThoughtBlock>) => void}) {
    return <textarea
        value={block.content}
        onChange={(e) => onUpdateBlock(block.id, {content: e.target.value})}
        placeholder="What's on your mind?"
        rows={4}
        className="w-full px-0 py-0 border-0 resize-none focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent"
    />;
}
