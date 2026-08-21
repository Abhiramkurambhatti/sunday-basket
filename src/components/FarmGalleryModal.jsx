import React, { useState } from 'react';
import { X, Camera, Play, ExternalLink, Image as ImageIcon, Sparkles, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FarmGalleryModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!isOpen) return null;

  // Farm Gallery items extracted from Google Photos album: https://photos.app.goo.gl/4xMtVQjkimeF2m6B6
  const galleryItems = [
    {
      id: 1,
      title: "Fresh Sitaphal Orchard",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_01.jpg",
      caption: "Handpicked creamy custard apples directly from our Pune orchards.",
      badge: "Custard Apple"
    },
    {
      id: 2,
      title: "Ruby Red Pomegranates",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_04.jpg",
      caption: "Juicy, vibrant Anar harvested at peak sweetness.",
      badge: "Pomegranate"
    },
    {
      id: 3,
      title: "Farm Harvest Video",
      category: "videos",
      type: "video",
      url: "/uploads/gallery/farm_gallery_09.jpg",
      videoUrl: "https://photos.app.goo.gl/4xMtVQjkimeF2m6B6",
      caption: "Watch our fresh harvest process directly in the fields.",
      badge: "Harvest Video"
    },
    {
      id: 4,
      title: "Farm Fresh Cooking Onions",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_02.jpg",
      caption: "Sun-dried Maharashtra daily onions ready for Sunday delivery.",
      badge: "Onion Harvest"
    },
    {
      id: 5,
      title: "Aromatic Kadipatta Shrubs",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_03.jpg",
      caption: "Fresh green aromatic curry leaves grown without chemical sprays.",
      badge: "Herbs"
    },
    {
      id: 6,
      title: "Juicy Pune Lemons",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_05.jpg",
      caption: "Fresh citrus pick packed with vitamins.",
      badge: "Fresh Lemons"
    },
    {
      id: 7,
      title: "Orchard Morning View",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_06.jpg",
      caption: "Early morning inspection at Sunday Basket farm fields.",
      badge: "Farm Field"
    },
    {
      id: 8,
      title: "Sorting & Quality Check",
      category: "videos",
      type: "video",
      url: "/uploads/gallery/farm_gallery_10.jpg",
      videoUrl: "https://photos.app.goo.gl/4xMtVQjkimeF2m6B6",
      caption: "Careful grading and basket packing for home delivery.",
      badge: "Video Walkthrough"
    },
    {
      id: 9,
      title: "Ripe Anar Tree Care",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_07.jpg",
      caption: "Naturally cultivated pomegranate trees.",
      badge: "Anar Orchard"
    },
    {
      id: 10,
      title: "Farm Fresh Sitaphal Harvest",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_08.jpg",
      caption: "Soft, sweet Sitaphal pulp harvested with utmost care.",
      badge: "Sitaphal"
    },
    {
      id: 11,
      title: "Organic Farm Soil Care",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_11.jpg",
      caption: "Nurturing soil health naturally for seasonal crops.",
      badge: "Soil Care"
    },
    {
      id: 12,
      title: "Fresh Picked Lemons",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_12.jpg",
      caption: "Bright yellow lemons sorted for Pune Sunday deliveries.",
      badge: "Lemons"
    },
    {
      id: 13,
      title: "Curry Leaves Bundle",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_14.jpg",
      caption: "Rich green Kadipatta harvested fresh every weekend.",
      badge: "Curry Leaves"
    },
    {
      id: 14,
      title: "Farm Sunset View",
      category: "photos",
      type: "image",
      url: "/uploads/gallery/farm_gallery_22.jpg",
      caption: "Peaceful evening view at Sunday Basket farm location.",
      badge: "Farm Views"
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item, index) => {
    setLightboxItem(item);
    setLightboxIndex(index);
  };

  const handleNextLightbox = () => {
    const nextIdx = (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(nextIdx);
    setLightboxItem(filteredItems[nextIdx]);
  };

  const handlePrevLightbox = () => {
    const prevIdx = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxIndex(prevIdx);
    setLightboxItem(filteredItems[prevIdx]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden border border-farm-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-farm-900 text-white p-4 sm:p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Camera className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Sunday Basket Farm Gallery
              </h2>
              <p className="text-xs text-farm-200 flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Real Farm Photos & Videos from Pune Fields
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://photos.app.goo.gl/4xMtVQjkimeF2m6B6"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Google Album</span>
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="bg-cream-50 border-b border-cream-200 px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === 'all'
                  ? 'bg-farm-900 text-white shadow-md shadow-farm-900/20'
                  : 'bg-white text-slate-700 hover:bg-cream-200 border border-slate-200'
              }`}
            >
              All Media ({galleryItems.length})
            </button>
            <button
              onClick={() => setActiveCategory('photos')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'photos'
                  ? 'bg-farm-900 text-white shadow-md shadow-farm-900/20'
                  : 'bg-white text-slate-700 hover:bg-cream-200 border border-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              Farm Photos
            </button>
            <button
              onClick={() => setActiveCategory('videos')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === 'videos'
                  ? 'bg-farm-900 text-white shadow-md shadow-farm-900/20'
                  : 'bg-white text-slate-700 hover:bg-cream-200 border border-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Harvest Videos
            </button>
          </div>

          <a
            href="https://photos.app.goo.gl/4xMtVQjkimeF2m6B6"
            target="_blank"
            rel="noreferrer"
            className="sm:hidden text-xs text-farm-800 font-bold flex items-center gap-1 shrink-0"
          >
            <span>Google Album</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Gallery Grid Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gradient-to-b from-cream-50/50 to-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(item, idx)}
                className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
              >
                {/* Media Thumbnail Container */}
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-md border border-white/20">
                    {item.badge}
                  </span>

                  {/* Video Overlay Indicator */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-xs text-white font-medium line-clamp-2">{item.caption}</p>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-farm-800 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Callout Link to Original Album */}
          <div className="mt-8 p-4 rounded-2xl bg-farm-50 border border-farm-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-farm-800 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="font-bold text-farm-950 text-sm">100% Genuine Farm Photos</h4>
                <p className="text-xs text-farm-700">Explore full original high-resolution album directly on Google Photos.</p>
              </div>
            </div>

            <a
              href="https://photos.app.goo.gl/4xMtVQjkimeF2m6B6"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-farm-800 hover:bg-farm-900 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-farm-800/10 w-full sm:w-auto justify-center"
            >
              <span>Open Google Photos Album</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* LIGHTBOX POPUP MODAL */}
      {lightboxItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-900/80 p-2 rounded-full border border-slate-800 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-slate-900/80 hover:bg-slate-800 p-3 rounded-full border border-slate-700 shadow-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-slate-900/80 hover:bg-slate-800 p-3 rounded-full border border-slate-700 shadow-xl transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            {lightboxItem.type === 'video' ? (
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-slate-800">
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xl mb-4 animate-bounce">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{lightboxItem.title}</h3>
                  <p className="text-xs text-slate-300 max-w-md mb-6">{lightboxItem.caption}</p>
                  <a
                    href="https://photos.app.goo.gl/4xMtVQjkimeF2m6B6"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <span>Play Full Video on Google Photos</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl border border-slate-800 shadow-2xl"
              />
            )}

            <div className="mt-4 text-center text-white max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {lightboxItem.badge}
              </span>
              <h3 className="text-lg font-bold mt-2">{lightboxItem.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
