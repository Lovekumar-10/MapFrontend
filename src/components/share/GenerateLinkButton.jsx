// import React, { useState } from "react";
// import { Share2, Check, QrCode, X } from "lucide-react";
// import { QRCodeSVG } from "qrcode.react"; // You'll need to install this

// function GenerateLinkButton({ sessionId, isSharing }) {
//   const [copied, setCopied] = useState(false);
//   const [showQR, setShowQR] = useState(false);

//   const shareUrl = `${window.location.origin}/track/view?session=${sessionId}`;

//   const handleCopy = () => {
//     if (!isSharing || !sessionId) return;
//     navigator.clipboard.writeText(shareUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="flex flex-col items-end gap-3 z-[5000]">
//       {/* MAIN SHARE BUTTON */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setShowQR(!showQR)}
//           className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl hover:bg-white transition-all text-slate-700 active:scale-90"
//         >
//           <QrCode size={20} />
//         </button>

//         <button
//           onClick={handleCopy}
//           disabled={!isSharing}
//           className={`
//             flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all 
//             active:scale-95 border backdrop-blur-md
//             ${copied 
//               ? "bg-green-500 text-white border-green-400" 
//               : "bg-white/90 text-slate-800 border-white hover:bg-white"
//             }
//             ${!isSharing ? "opacity-0 pointer-events-none" : "opacity-100 cursor-pointer"}
//           `}
//         >
//           {copied ? <Check size={18} /> : <Share2 size={18} />}
//           <span className="font-black text-xs uppercase tracking-widest">
//             {copied ? "Copied!" : "Share Link"}
//           </span>
//         </button>
//       </div>

//       {/* QR CODE POPUP */}
//       {showQR && (
//         <div className="bg-white p-4 rounded-[24px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 origin-top-right">
//           <div className="flex justify-between items-center mb-3">
//             <span className="text-[10px] font-black uppercase text-slate-400">Scan to Track</span>
//             <X size={14} className="cursor-pointer text-slate-400" onClick={() => setShowQR(false)} />
//           </div>
//           <div className="p-2 bg-slate-50 rounded-xl">
//             <QRCodeSVG 
//               value={shareUrl} 
//               size={120} 
//               level={"H"} 
//               includeMargin={true}
//               imageSettings={{
//                 src: "/logo192.png", // Optional: put your app logo in center
//                 x: undefined,
//                 y: undefined,
//                 height: 24,
//                 width: 24,
//                 excavate: true,
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default GenerateLinkButton;



import React, { useState } from "react";
import { Share2, Check, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Make sure this package is installed

function GenerateLinkButton({ sessionId, isSharing }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${window.location.origin}/track/view?session=${sessionId}`;

  const handleCopy = () => {
    if (!isSharing || !sessionId) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-end gap-3 z-[5000]">
      {/* MAIN SHARE BUTTONS */}
      <div className="flex items-center gap-2">
        {/* QR Code Toggle */}
        <button
          onClick={() => setShowQR(!showQR)}
          className="p-3 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl hover:bg-white transition-all text-slate-700 active:scale-90"
        >
          <QrCode size={20} />
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          disabled={!isSharing}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all 
            active:scale-95 border backdrop-blur-md
            ${copied 
              ? "bg-green-500 text-white border-green-400" 
              : "bg-white/90 text-slate-800 border-white hover:bg-white"
            }
            ${!isSharing ? "opacity-0 pointer-events-none" : "opacity-100 cursor-pointer"}
          `}
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          <span className="font-black text-xs uppercase tracking-widest">
            {copied ? "Copied!" : "Share Link"}
          </span>
        </button>
      </div>

      {/* QR CODE POPUP */}
      {showQR && (
        <div className="bg-white p-4 rounded-[24px] shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 origin-top-right">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase text-slate-400">Scan to Track</span>
            <X size={14} className="cursor-pointer text-slate-400" onClick={() => setShowQR(false)} />
          </div>
          <div className="p-2 bg-slate-50 rounded-xl">
            <QRCodeSVG 
              value={shareUrl} 
              size={120} 
              level={"H"} 
              includeMargin={true}
              imageSettings={{
                src: "/logo192.png", // Optional: app logo in center
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateLinkButton;