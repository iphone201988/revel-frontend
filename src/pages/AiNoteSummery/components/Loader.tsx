export function FullScreenLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#395159] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#395159] font-medium">{text}</p>
      </div>
    </div>
  );
}
