export default function Loading() {
    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
            <div className="mb-8 flex items-center justify-between">
                <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center justify-center rounded-lg bg-white p-4 shadow-sm h-24 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mb-2"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 animate-pulse rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                        <div className="flex gap-2">
                            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
