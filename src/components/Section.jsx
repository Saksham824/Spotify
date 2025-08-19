import Card from "./Card";

export default function Section({ title, items, onPlay }) {
  return (
    <section className="w-full px-3 sm:px-6 py-4 sm:py-6">
      {/* Section Title with accent underline */}
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <span className="h-1 w-8 bg-gradient-to-r from-[#1DB954] to-transparent rounded-full" />
      </div>

      {/* Cards grid */}
      {items && items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <Card key={item.id || index} {...item} onPlay={onPlay} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-10 text-base">
          No items to display.
        </div>
      )}
    </section>
  );
}