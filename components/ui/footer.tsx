import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-black/20 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
          <Link 
            href="https://www.sunai.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            <span>🌟</span>
            <span>sunai论坛开发</span>
          </Link>
          
          <span className="text-white/40 hidden sm:inline">|</span>
          
          <Link 
            href="https://github.com/woodchen-ink/Edgeone_CleanCache" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            <span>⭐</span>
            <span>GitHub</span>
          </Link>
          
          <span className="text-white/40 hidden sm:inline">|</span>
          
          <Link 
            href="https://woodchen.ink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            <span>📝</span>
            <span>个人博客</span>
          </Link>
          
          <span className="text-white/40 hidden sm:inline">|</span>
          
          <Link 
            href="https://onepage.czl.net" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
          >
            <span>🔧</span>
            <span>其他工具</span>
          </Link>
        </div>
      </div>
    </footer>
  );
} 