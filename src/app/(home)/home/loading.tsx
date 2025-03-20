import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-gray-700">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;
