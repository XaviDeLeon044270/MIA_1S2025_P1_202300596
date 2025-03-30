'use client';
import { Editor } from '@monaco-editor/react';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5065';

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const handleExecute = () => {
    try {
      fetch(`${API_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
        .then(response => {
          if (!response.ok)
            return response.text().then(text => { throw new Error(text) });
          return response.json();
        })
        .then(data => setOutput(data.result))
        .catch(err => {
          const formattedMessage = err.message.replace(/[{}"]/g, '').replace(/^error:/i, 'Error:\t');
          setOutput(formattedMessage);
        });
    } catch (err) {
      const formattedMessage = err instanceof Error ? err.message.replace(/[{}"]/g, '').replace(/^error:/i, 'Error:\t') : 'Error desconocido';
      setOutput(formattedMessage);
    }
  }

  const handleOpenFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  }

  const handleSaveFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.glt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleNewFile = () => {
    if (code && !confirm('¿Deseas guardar el archivo antes de crear uno nuevo?')) {
      return;
    }
    setCode('');
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 text-white'>
      {/* Barra superior */}
      <div className='bg-gray-800 p-2 flex justify-between items-center'>
        <div className='flex space-x-4'>
          {/* Menú Archivo */}
          <div className='relative group'>
            <button className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded w-65'>
              Archivo
            </button>
            <div className='absolute hidden group-hover:block bg-gray-700 mt-1 rounded z-50 w-65'>
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".glt"
                onChange={handleOpenFile}
              />
              <label
                htmlFor="file-input"
                className='block px-4 py-2 hover:bg-gray-600 cursor-pointer'
              >
                Abrir Archivo
              </label>
              <button
                onClick={handleSaveFile}
                className='block w-full px-4 py-2 hover:bg-gray-600 text-left'
              >
                Guardar Archivo
              </button>
              <button
                onClick={handleNewFile}
                className='block w-full px-4 py-2 hover:bg-gray-600 text-left'
              >
                Crear Archivo
              </button>
            </div>
          </div>

          {/* Menú Reportes */}
          <div className='relative group'>
            <button className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded w-65'>
              Reportes
            </button>
            <div className='absolute hidden group-hover:block bg-gray-700 mt-1 rounded z-50 w-65'>
              <button className='block w-full px-4 py-2 hover:bg-gray-600 text-left'>
                Reporte de Errores
              </button>
              <button className='block w-full px-4 py-2 hover:bg-gray-600 text-left'>
                Reporte de Tabla de Símbolos
              </button>
              <button className='block w-full px-4 py-2 hover:bg-gray-600 text-left'>
                Reporte de AST
              </button>
            </div>
          </div>
        </div>

        {/* Botón Run */}
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={handleExecute}
        >
          Run
        </button>
      </div>

      {/* Contenido principal */}
      <div className='flex flex-1 p-4 space-x-4'>
        {/* Editor */}
        <div className='flex-1 flex flex-col'>
          <label className='text-sm font-bold mb-2'>Editor:</label>
          <Editor
            height="70vh"
            defaultLanguage="go"
            theme='vs-dark'
            value={code}
            onChange={(value) => setCode(value || '')}
          />
        </div>

        {/* Consola */}
        <div className='flex-1 flex flex-col'>
          <label className='text-sm font-bold mb-2'>Consola:</label>
          <div className='bg-gray-800 p-4 rounded flex-1 overflow-auto'>
            <pre className='text-white'>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}