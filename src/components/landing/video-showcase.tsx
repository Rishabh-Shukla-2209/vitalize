export function VideoShowcase() {
  return (
    <section
      id="demo"
      className="relative z-10 bg-zinc-200 dark:bg-black bg-dot-white w-full px-6 py-20 flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-zinc-700 dark:text-white tracking-tight mb-3">
          See it in Action
        </h2>
        <p className="text-zinc-600 dark:text-gray-400">
          Watch the full workflow below.
        </p>
      </div>

      {/* MacBook Mockup */}
      <div className="w-full max-w-[800px] relative perspective-[2000px] group">
        <div className="relative bg-zinc-100 dark:bg-[#0d0d0d] border-8 border-[#1a1a1a] rounded-t-2xl rounded-b-md shadow-2xl overflow-hidden aspect-16/10">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-200 dark:bg-[#0a0a0a] z-20 shadow-inner border border-white/5"></div>
          <video
            src="https://res.cloudinary.com/dlyluxb9z/video/upload/v1765709096/Vitalize_Demo_x5qcms.mov"
            controls
            className="h-full w-full"
            aria-label="Product demo video showing the full workflow from login to logging a workout"
          />
        </div>
        <div className="h-3 bg-[#222] w-[102%] -ml-[1%] rounded-b-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border-t border-white/5 relative flex justify-center">
          <div className="w-[15%] h-1 bg-[#111] rounded-b-md border-t border-[#333]"></div>
        </div>
      </div>
    </section>
  );
}
