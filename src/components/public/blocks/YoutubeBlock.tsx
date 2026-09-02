import React from 'react';
import { ProjectBlock } from '../../../types';

interface YoutubeBlockProps {
  block: ProjectBlock;
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const YoutubeBlock: React.FC<YoutubeBlockProps> = ({ block }) => {
  if (!block.media_url) return null;

  const videoId = extractYoutubeId(block.media_url);

  if (!videoId) {
    return (
      <div className="w-full my-6 p-4 border border-rose-200 bg-rose-50 text-rose-800 rounded-lg text-sm">
        <p className="font-semibold">URL de vídeo do YouTube inválida ou não reconhecida.</p>
        <p className="text-xs text-rose-600 mt-1">{block.media_url}</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const videoTitle = block.content || block.alt_text || 'Vídeo do YouTube do projeto';

  return (
    <figure className="w-full my-8 text-center" role="group" aria-label={videoTitle}>
      <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black shadow-md">
        <iframe
          src={embedUrl}
          title={videoTitle}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {(block.caption || block.content) && (
        <figcaption
          className="mt-2.5 text-xs md:text-sm text-center italic opacity-80 max-w-2xl mx-auto"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary, #5C5852)',
          }}
        >
          {block.caption || block.content}
        </figcaption>
      )}
    </figure>
  );
};
