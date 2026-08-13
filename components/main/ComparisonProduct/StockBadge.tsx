export default function StockBadge({ count }: { count: number }) {
  if (count === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
        Out of Stock
      </span>
    );
  if (count <= 5)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
        Low Stock ({count})
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
      In Stock ({count})
    </span>
  );
}
