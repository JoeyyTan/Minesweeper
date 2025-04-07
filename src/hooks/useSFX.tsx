import { useCallback, useMemo } from 'react';

type SoundEffect = 
  | 'FLAG_PLACE' 
  | 'FLAG_REMOVE' 
  | 'REVEAL_NUMBER' 
  | 'REVEAL_EMPTY' 
  | 'GAME_WIN' 
  | 'GAME_OVER';

const useSFX = () => {
  const sounds = useMemo(() => {
    return {
      FLAG_PLACE: new Audio('/sounds/flag-place.mp3'),
      FLAG_REMOVE: new Audio('/sounds/flag-remove.mp3'),
      REVEAL_NUMBER: new Audio('/sounds/reveal-number.mp3'),
      REVEAL_EMPTY: new Audio('/sounds/reveal-empty.mp3'),
      GAME_WIN: new Audio('/sounds/game-win.mp3'),
      GAME_OVER: new Audio('/sounds/game-over.mp3'),
    };
  }, []);

  const playSoundEffect = useCallback((sound: SoundEffect) => {
    try {
      // Add this check to prevent errors in environments where audio isn't available
      if (typeof window !== 'undefined' && sounds[sound]) {
        sounds[sound].currentTime = 0;
        sounds[sound].play().catch(error => {
          // Silently catch errors - often due to user interaction requirements
          console.log(`Error playing sound: ${error.message}`);
        });
      }
    } catch (error) {
      console.error('Error playing sound effect:', error);
    }
  }, [sounds]);

  return { playSoundEffect };
};

export default useSFX;
