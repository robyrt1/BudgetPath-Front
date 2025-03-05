// Header.tsx
'use client';
// src/app/Shared/components/Header.tsx
const Header = () => {
    return (
      <header className="bg-blue-500 text-white p-2  flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <h1 className="text-xl">Meu Dashboard</h1>
        <select className="p-2 rounded bg-white text-gray-700">
          <option value="opcao1">Opção 1</option>
          <option value="opcao2">Opção 2</option>
          <option value="opcao3">Opção 3</option>
        </select>
      </header>
    );
  };
  
  export default Header;
  