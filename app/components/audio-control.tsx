export type AudioControlProps = {
  isPlaying: boolean;
  onPrevClick: () => void;
  onNextClick: () => void;
  onPlayPauseClick: () => void;
};

export default function AudioControls({
  isPlaying,
  onPrevClick,
  onNextClick,
  onPlayPauseClick,
}: AudioControlProps) {
  return (
    <div className="audio-controls">
      <button
        type="button"
        className="prev"
        aria-label="Previous"
        onClick={onPrevClick}
      >
        <span className="material-symbols-outlined">skip_previous</span>
      </button>
      {isPlaying ? (
        <button
          type="button"
          className="pause"
          onClick={() => onPlayPauseClick()}
          aria-label="Pause"
        >
          <span className="material-symbols-outlined">pause</span>
        </button>
      ) : (
        <button
          type="button"
          className="play"
          onClick={onPlayPauseClick}
          aria-label="Play"
        >
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
      )}
      <button
        type="button"
        className="next"
        aria-label="Next"
        onClick={onNextClick}
      >
        <span className="material-symbols-outlined">skip_next</span>
      </button>
    </div>
  );
}
