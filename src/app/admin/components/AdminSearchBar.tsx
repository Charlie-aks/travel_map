"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, User, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  title: string;
  type: 'LOCATION' | 'USER';
  subtitle: string;
  image?: string | null;
  href: string;
}

export function AdminSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-[400px]" ref={dropdownRef}>
      <div className="relative group">
        <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isLoading ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search insights, locations, or users..." 
          className="w-full pl-11 pr-10 py-2.5 bg-[#e9ecef]/50 hover:bg-[#e9ecef]/80 rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0c2b48]/10 transition-all text-[#0c2b48] placeholder:text-slate-400"
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading && results.length === 0 && (
              <div className="p-8 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Searching the coast...</p>
              </div>
            )}

            {!isLoading && results.length === 0 && query.length >= 2 && (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-slate-400">No results found for "{query}"</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result.href)}
                    className="w-full px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {result.image ? (
                        <img src={result.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        result.type === 'LOCATION' ? <MapPin className="w-5 h-5 text-slate-400" /> : <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#0c2b48] truncate">{result.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{result.subtitle}</p>
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${result.type === 'LOCATION' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex justify-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Press ESC to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
