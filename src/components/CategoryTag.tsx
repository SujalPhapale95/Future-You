interface CategoryTagProps {
    category: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
    return (
        <span className="inline-flex items-center rounded-md bg-[#f5f0e8] px-2 py-1 text-xs font-medium text-[#6b6458]">
            {category}
        </span>
    );
}
