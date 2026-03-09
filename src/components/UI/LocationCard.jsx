

// import React, { useState } from 'react';
// import { X, Navigation, Share2, Star, MapPin, Copy, Check } from 'lucide-react';

// const LocationCard = ({ data, onClose, onGetDirections }) => {
//   const [copied, setCopied] = useState(false);

//   if (!data) return null;

//   const coordsString = `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`;

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(coordsString);
//       setCopied(true);
//       // Reset the "Check" icon back to "Copy" after 2 seconds
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy text: ', err);
//     }
//   };

//   return (
//     <div className="absolute top-6 left-6 z-[1003] w-[calc(100%-48px)] max-w-[380px] animate-in slide-in-from-left-5 duration-300">
//       <div className="bg-[var(--bg-card)] shadow-[var(--shadow-hover)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        
//         {/* Header Image / Pattern Area */}
//         <div className="h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] relative p-4 flex items-end">
//           <button 
//             onClick={onClose}
//             className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
//             aria-label="Close"
//           >
//             <X size={18} />
//           </button>
//           <h2 className="text-white font-bold text-xl truncate pr-8">{data.name}</h2>
//         </div>

//         {/* Content Body */}
//         <div className="p-5 flex flex-col gap-5">
          
//           {/* Info Section */}
//           <div className="flex flex-col gap-2">
//             <div className="flex items-center gap-3 text-[var(--text-secondary)]">
//               <MapPin size={16} className="text-[var(--color-primary)]" />
//               <span className="text-xs font-medium line-clamp-2">{data.fullAddress}</span>
//             </div>

//             {/* Copyable Coordinates Section */}
//             <button 
//               onClick={handleCopy}
//               className="group flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--color-primary)] transition-colors cursor-pointer w-fit"
//               title="Click to copy coordinates"
//             >
//               {copied ? (
//                 <Check size={16} className="text-green-500" />
//               ) : (
//                 <Copy size={16} className="group-hover:scale-110 transition-transform" />
//               )}
//               <span className="text-[11px] font-mono tracking-wider">
//                 {coordsString} {copied && <span className="ml-2 text-green-500 font-sans text-[10px] uppercase">Copied!</span>}
//               </span>
//             </button>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={onGetDirections}
//               className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
//             >
//               <Navigation size={18} fill="currentColor" />
//               <span>Directions</span>
//             </button>
            
//             <button className="p-3 bg-[var(--bg-soft)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer">
//               <Share2 size={20} />
//             </button>
            
//             <button className="p-3 bg-[var(--bg-soft)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer">
//               <Star size={20} />
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationCard;



import React, { useState } from 'react';
import { X, Navigation, Share2, Star, MapPin, Copy, Check } from 'lucide-react';

const LocationCard = ({ data, onClose, onGetDirections }) => {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!data) return null;

  const coordsString = `${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`;
  
  // Create a Google Maps link for sharing
  const mapUrl = `https://www.google.com/maps?q=${data.lat},${data.lng}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coordsString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: data.name,
      text: `Check out this location: ${data.name}\n${data.fullAddress}`,
      url: mapUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: Copy link to clipboard if Share API isn't supported
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${mapUrl}`);
        alert('Share link copied to clipboard!');
      } catch (err) {
        console.error('Share failed');
      }
    }
  };

  return (
    <div className="absolute top-6 left-6 z-[1003] w-[calc(100%-48px)] max-w-[380px] animate-in slide-in-from-left-5 duration-300">
      <div className="bg-[var(--bg-card)] shadow-[var(--shadow-hover)] rounded-[var(--radius-lg)] border border-[var(--border)] overflow-hidden">
        
        {/* Header with Gradient */}
        <div className="h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] relative p-4 flex items-end">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          <h2 className="text-white font-bold text-xl truncate pr-8">{data.name}</h2>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Info Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
              <MapPin size={16} className="text-[var(--color-primary)]" />
              <span className="text-xs font-medium line-clamp-2">{data.fullAddress}</span>
            </div>
            
            <button 
              onClick={handleCopy}
              className="flex items-center gap-3 text-[var(--text-light)] hover:text-[var(--color-primary)] transition-colors cursor-pointer group w-fit"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="group-hover:scale-110 transition-transform" />}
              <span className="text-[11px] font-mono tracking-wider">{coordsString}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onGetDirections}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Navigation size={18} fill="currentColor" />
              <span>Directions</span>
            </button>
            
            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="p-3 bg-[var(--bg-soft)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--border)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
              title="Share Location"
            >
              <Share2 size={20} />
            </button>
            
            {/* Favorite Star Button */}
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-3 bg-[var(--bg-soft)] rounded-xl transition-all cursor-pointer ${
                isFavorite ? 'text-yellow-500 scale-110' : 'text-[var(--text-secondary)] hover:bg-[var(--border)]'
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;