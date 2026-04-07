"use client";

import { Collection } from "@/constants/mock-data";
import { Star } from "lucide-react";
import Link from "next/link";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.id}`} className="block group">
      <div className="relative h-[480px] w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={collection.imageUrl} 
          alt={collection.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-500 group-hover:opacity-90"></div>

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          
          {/* Top Tag */}
          <div className="flex justify-start">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-extrabold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-sm">
              {collection.tag}
            </span>
          </div>

          {/* Bottom Content */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-3xl text-white mb-2 leading-tight drop-shadow-md">
                {collection.title}
              </h3>
              <p className="text-slate-300 font-medium text-sm flex items-center gap-2">
                {collection.placeArea} <span className="w-1 h-1 bg-slate-400 rounded-full"></span> {collection.locationIds.length} Places
              </p>
            </div>
            
            {/* Rating floating tag */}
            <div className="bg-white text-slate-800 font-bold text-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shrink-0 translate-y-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {collection.rating}
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
}
