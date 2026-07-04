import React from 'react';

const GalleryFilter = ({ activeCategory, setActiveCategory, type }) => {
  const photoCategories = [
    'All',
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
  ];

  const videoCategories = [
    'All',
    'Paragliding',
    'Trekking',
    'Camping',
    'Hotels',
    'Cafes',
    'Travel Experiences',
  ];

  const categories = type === 'photos' ? photoCategories : videoCategories;

  return (
    <div className="flex flex-wrap gap-2 justify-center py-2 max-w-full overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-250 border whitespace-nowrap ${
            activeCategory === cat
              ? 'bg-[#008cff] text-white border-[#008cff] shadow-lg shadow-blue-600/10'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilter;
