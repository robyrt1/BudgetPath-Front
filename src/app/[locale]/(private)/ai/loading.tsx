import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] w-full" style={{
      backgroundColor: "var(--background)",
      color: "var(--foreground)"
    }}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-semibold tracking-wide">Carregando IA...</p>
      </div>
    </div>
  );
};

export default Loading;
