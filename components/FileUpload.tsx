import React, { useState, useCallback } from 'react';
import { IconUpload, IconX } from './Icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  imageUrl: string | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, imageUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  if (imageUrl) {
    return (
      <div className="relative w-full aspect-video bg-gray-900/50 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
        <img src={imageUrl} alt="Pré-visualização do gráfico" className="w-full h-full object-contain" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
          aria-label="Limpar imagem"
        >
          <IconX className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative block w-full aspect-video rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-600 hover:border-gray-500'}`}
    >
      <div className="flex flex-col items-center justify-center h-full cursor-pointer">
        <IconUpload className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-lg font-semibold text-gray-300">
          <span className="text-indigo-400">Envie um arquivo</span> ou arraste e solte
        </p>
        <p className="text-sm text-gray-500">PNG, JPG, GIF até 10MB</p>
      </div>
      <input
        type="file"
        id="file-upload"
        name="file-upload"
        className="sr-only"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChange}
      />
    </label>
  );
};