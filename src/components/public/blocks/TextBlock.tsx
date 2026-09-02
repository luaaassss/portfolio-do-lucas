import React from 'react';
import { ProjectBlock } from '../../../types';

interface TextBlockProps {
  block: ProjectBlock;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  if (!block.content) return null;

  // Simple and safe markdown parser to preserve semantic HTML hierarchy without unsafe dangerouslySetInnerHTML
  const lines = block.content.split('\n');

  return (
    <section aria-label="Texto do projeto" className="w-full my-6 text-left">
      <div
        className="prose max-w-none space-y-4"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-text-primary, #141414)',
          lineHeight: 'var(--line-height, 1.65)',
        }}
      >
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;

          // H2
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="text-xl md:text-2xl font-bold tracking-tight mt-6 mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #141414)' }}
              >
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          // H3
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="text-lg md:text-xl font-bold tracking-tight mt-4 mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #141414)' }}
              >
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // List item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-6 list-disc text-base leading-relaxed opacity-90">
                {renderInlineFormatting(trimmed.substring(2))}
              </li>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const text = trimmed.replace(/^\d+\.\s/, '');
            return (
              <li key={idx} className="ml-6 list-decimal text-base leading-relaxed opacity-90">
                {renderInlineFormatting(text)}
              </li>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-base leading-relaxed opacity-90">
              {renderInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    </section>
  );
};

function renderInlineFormatting(text: string): React.ReactNode {
  // Parse bold **text** and links [text](url)
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium hover:opacity-80 focus:outline-none focus:ring-2 rounded-xs"
          style={{ color: 'var(--color-accent, #B43E19)', outlineColor: 'var(--color-focus, #B43E19)' }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}
