import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f0e8] text-[#0f0e0c]">
            <h2 className="font-serif text-4xl font-bold mb-4">404 - Page Not Found</h2>
            <p className="text-[#6b6458] mb-8">Could not find requested resource</p>
            <Link
                href="/"
                className="rounded-md bg-[#0f0e0c] px-4 py-2 text-sm font-medium text-[#f5f0e8] shadow-sm hover:bg-[#2a2a2a]"
            >
                Return Home
            </Link>
        </div>
    );
}
