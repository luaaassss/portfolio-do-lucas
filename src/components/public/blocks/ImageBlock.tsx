import React, { useState } from 'react';
import { ZoomIn, X } from 'lucide-react';
import { ProjectBlock } from '../../../types';

interface ImageBlockProps {
  block: ProjectBlock;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!block.media_url) return null;

  const altText = block.alt_text || 'Imagem do projeto';

  return (
    <>
      <figure className="w-full my-8 text-center" role="group" aria-label={block.caption || altText}>
        <div className="relative group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 inline-block w-full shadow-xs">
          <img
            src={block.media_url}
            alt={altText}
            loading="lazy"
            className="w-full h-auto max-h-[700px] object-contain mx-auto"
          />

          {/* Zoom button */}
          <button
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-3 right-3 p-2.5 bg-zinc-900/90 hover:bg-zinc-900 text-white rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-white shadow-md"
            aria-label={`Ampliar imagem: ${altText}`}
            title="Ampliar imagem"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Caption */}
        {block.caption && (
          <figcaption
            className="mt-2.5 text-xs md:text-sm text-center italic opacity-80 max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-secondary, #5C5852)',
            }}
          >
            {block.caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização ampliada: ${altText}`}
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Fechar ampliação"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={block.media_url}
              alt={altText}
              className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
            />
            {block.caption && (
              <p className="mt-3 text-white text-sm text-center bg-black/60 px-4 py-1.5 rounded-full">
                {block.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
