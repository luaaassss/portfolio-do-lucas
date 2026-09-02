import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, FileText, RotateCcw } from 'lucide-react';
import { ProjectBlock } from '../../../types';

interface AudioBlockProps {
  block: ProjectBlock;
}

export const AudioBlock: React.FC<AudioBlockProps> = ({ block }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restartAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!block.media_url) return null;

  const audioTitle = block.content || block.alt_text || 'Faixa de áudio do projeto';

  return (
    <section
      aria-label={`Player de áudio: ${audioTitle}`}
      className="w-full my-8 p-6 rounded-xl border transition-all"
      style={{
        backgroundColor: 'var(--color-surface, #FFFFFF)',
        borderColor: 'var(--color-border, #E2DDD3)',
        borderRadius: 'var(--border-radius, 8px)',
        borderWidth: 'var(--border-width, 1px)',
        borderStyle: 'var(--border-style, solid)' as any,
        boxShadow: 'var(--box-shadow, none)',
      }}
    >
      <audio ref={audioRef} src={block.media_url} preload="metadata" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h4
            className="text-base font-bold"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-primary, #141414)',
            }}
          >
            {audioTitle}
          </h4>
          {block.caption && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {block.caption}
            </p>
          )}
        </div>

        {/* Accessibility badge & transcript toggle */}
        {block.transcript && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border, #E2DDD3)',
              backgroundColor: showTranscript ? 'var(--color-secondary, #E8E4DC)' : 'transparent',
              color: 'var(--color-text-primary, #141414)',
              outlineColor: 'var(--color-focus, #B43E19)',
            }}
            aria-expanded={showTranscript}
            aria-controls={`transcript-${block.id}`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
            <span>{showTranscript ? 'Ocultar Transcrição' : 'Ver Transcrição Textual'}</span>
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-3 rounded-full text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0"
          style={{
            backgroundColor: 'var(--color-primary, #1A1816)',
            outlineColor: 'var(--color-focus, #B43E19)',
          }}
          aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Restart Button */}
        <button
          onClick={restartAudio}
          className="p-2 text-neutral-500 hover:text-neutral-900 rounded-full focus:outline-none focus:ring-2"
          aria-label="Reiniciar áudio para o início"
          title="Reiniciar áudio"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Progress scrub bar */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs font-mono tabular-nums text-neutral-500 min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-white focus:outline-none focus:ring-2"
            aria-label="Controle de posição do áudio"
          />
          <span className="text-xs font-mono tabular-nums text-neutral-500 min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-2 text-neutral-600 hover:text-neutral-900 rounded-full focus:outline-none focus:ring-2"
          aria-label={isMuted ? 'Ativar som' : 'Silenciar áudio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Accessible Textual Transcript (WCAG requirement) */}
      {showTranscript && block.transcript && (
        <div
          id={`transcript-${block.id}`}
          className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs md:text-sm leading-relaxed"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary, #5C5852)',
          }}
          aria-label="Transcrição textual completa do áudio"
        >
          <div className="font-semibold text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Transcrição Textual Acessível:
          </div>
          <p className="whitespace-pre-line bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded border border-neutral-200 dark:border-neutral-800">
            {block.transcript}
          </p>
        </div>
      )}
    </section>
  );
};
