// import React, { useEffect } from 'react';
// import { X, AlertCircle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

// const Notification = ({ message, type = 'SUCCESS', onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(onClose, 5000); // Auto-close after 5s
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   // Maps backend error types to specific UI colors
//   const styles = {
//     SUCCESS: "bg-teal-500 border-teal-600 shadow-teal-200",
//     LIMIT_ERROR: "bg-amber-500 border-amber-600 shadow-amber-200",
//     NOT_FOUND: "bg-rose-500 border-rose-600 shadow-rose-200",
//     AUTH_ERROR: "bg-purple-600 border-purple-700 shadow-purple-200",
//     SERVER_ERROR: "bg-gray-800 border-black shadow-gray-300",
//     VALIDATION_ERROR: "bg-blue-500 border-blue-600 shadow-blue-200"
//   };

//   const icons = {
//     SUCCESS: <CheckCircle size={20} />,
//     LIMIT_ERROR: <Info size={20} />,
//     NOT_FOUND: <AlertCircle size={20} />,
//     AUTH_ERROR: <ShieldAlert size={20} />,
//     SERVER_ERROR: <X size={20} />,
//     VALIDATION_ERROR: <Info size={20} />
//   };

//   return (
//     <div className={`fixed bottom-6 right-6 z-[5000] flex flex-col min-w-[320px] max-w-[420px] rounded-2xl text-white shadow-2xl border-b-4 animate-in slide-in-from-right-10 duration-300 ${styles[type] || styles.SERVER_ERROR}`}>
      
//       <div className="flex items-center gap-4 px-6 py-4">
//         {/* Icon Circle */}
//         <div className="bg-white/20 p-2 rounded-full shrink-0">
//           {icons[type] || icons.SERVER_ERROR}
//         </div>

//         {/* Content */}
//         <div className="flex-1">
//           <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">
//             {type.replace('_', ' ')}
//           </p>
//           <p className="text-sm font-bold leading-tight">{message}</p>
//         </div>

//         {/* Close Button */}
//         <button 
//           onClick={onClose} 
//           className="p-1 hover:bg-white/10 rounded-lg transition-all hover:rotate-90"
//         >
//           <X size={18} />
//         </button>
//       </div>

//       {/* Auto-hide Progress Bar */}
//       <div className="h-1 bg-white/20 w-full overflow-hidden rounded-b-2xl">
//         <div className="h-full bg-white/40 animate-progress-shrink" />
//       </div>
//     </div>
//   );
// };

// export default Notification;













import React, { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react";

const Notification = ({ message, type = "SUCCESS", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    SUCCESS: "bg-teal-500 border-teal-600",
    LIMIT_ERROR: "bg-amber-500 border-amber-600",
    NOT_FOUND: "bg-rose-500 border-rose-600",
    AUTH_ERROR: "bg-purple-600 border-purple-700",
    SERVER_ERROR: "bg-gray-800 border-black",
    VALIDATION_ERROR: "bg-blue-500 border-blue-600"
  };

  const icons = {
    SUCCESS: <CheckCircle size={16} />,
    LIMIT_ERROR: <Info size={16} />,
    NOT_FOUND: <AlertCircle size={16} />,
    AUTH_ERROR: <ShieldAlert size={16} />,
    SERVER_ERROR: <X size={16} />,
    VALIDATION_ERROR: <Info size={16} />
  };

  return (
    <div
      className={`
        fixed 
        top-4 right-4 
        z-[5000]
        flex 
        items-start
        gap-3
        w-[90vw] 
        sm:w-[320px]
        max-w-[360px]
        text-white
        rounded-xl
        border-b-4
        shadow-xl
        px-4
        py-3
        animate-in slide-in-from-right-10 duration-300
        ${styles[type] || styles.SERVER_ERROR}
      `}
    >
      
      {/* Icon */}
      <div className="bg-white/20 p-2 rounded-full shrink-0">
        {icons[type] || icons.SERVER_ERROR}
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="text-[9px] uppercase font-bold opacity-70 tracking-wider">
          {type.replace("_", " ")}
        </p>
        <p className="text-xs font-semibold leading-tight">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="mt-2 h-[3px] bg-white/20 w-full overflow-hidden rounded-full">
          <div className="h-full bg-white/50 animate-progress-shrink" />
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-md transition"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Notification;