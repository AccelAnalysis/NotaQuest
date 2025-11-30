import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MNEMONIC_CARDS, MNEMONIC_PHRASES, getCardsByType } from '../modes/mnemonic';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaMusic, FaRandom } from 'react-icons/fa';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import { theme } from '../theme';

export default function Mnemonic() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showType, setShowType] = useState<'space' | 'line'>('space');
  const [clef, setClef] = useState<'treble' | 'bass'>('treble');
  const [cards, setCards] = useState<typeof MNEMONIC_CARDS>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const isInitialMount = useRef(true);

  // Initialize cards on mount and when showType or clef changes
  useEffect(() => {
    // For initial mount, set cards immediately
    if (isInitialMount.current) {
      const filteredCards = getCardsByType(showType, clef);
      setCards(filteredCards);
      setCurrentCardIndex(0);
      isInitialMount.current = false;
    } else {
      // For subsequent updates, use a timeout to batch state updates
      const timer = setTimeout(() => {
        const filteredCards = getCardsByType(showType, clef);
        setCards(filteredCards);
        setCurrentCardIndex(0);
        setShowMnemonic(false);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [showType, clef]);

  const currentCard = cards[currentCardIndex] || cards[0];

  const nextCard = () => {
    if (isAnimating || cards.length === 0) return;
    setIsAnimating(true);
    setShowMnemonic(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevCard = () => {
    if (isAnimating || cards.length === 0) return;
    setIsAnimating(true);
    setShowMnemonic(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const toggleMnemonic = () => {
    setShowMnemonic(!showMnemonic);
  };

  const toggleType = () => {
    setShowType(prev => prev === 'space' ? 'line' : 'space');
  };

  const toggleClef = () => {
    setClef(prev => prev === 'treble' ? 'bass' : 'treble');
  };

  const noteContainerRef = useRef<HTMLDivElement>(null);
  const [vf, setVf] = useState<{renderer: any, context: any} | null>(null);

  // Initialize VexFlow renderer
  useEffect(() => {
    if (noteContainerRef.current && !vf) {
      const renderer = new Renderer(
        noteContainerRef.current,
        Renderer.Backends.SVG
      );
      renderer.resize(200, 200);
      const context = renderer.getContext();
      context.setBackgroundFillStyle(theme.surfaces.contrast);
      setVf({ renderer, context });
    }
  }, [vf]);

  // Draw the note with VexFlow
  const drawNote = useCallback(() => {
    if (!vf || !currentCard) return;
    
    const { context } = vf;
    context.clear();
    
    // Create a new stave
    const stave = new Stave(10, 40, 180);
    stave.addClef(clef).addTimeSignature('4/4');
    
    // Convert note to VexFlow format
    const note = new StaveNote({
      clef: clef,
      keys: [`${currentCard.note}/${clef === 'treble' ? '4' : '3'}`],
      duration: 'q'
    });
    
    // Add accidental if needed (for notes like F# or Bb)
    if (currentCard.note.includes('#')) {
      note.addModifier(new Accidental('#'));
    } else if (currentCard.note.includes('b')) {
      note.addModifier(new Accidental('b'));
    }
    
    // Create a voice and format it
    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables([note]);
    
    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], 150);
    
    // Render
    stave.setContext(context).draw();
    voice.draw(context, stave);
  }, [currentCard, vf, clef]);
  
  // Redraw when current card or clef changes
  useEffect(() => {
    drawNote();
  }, [currentCard, clef, drawNote]);

  const clefAccent = clef === 'treble'
    ? {
        color: theme.palette.primaryStrong,
        backgroundColor: theme.surfaces.overlay,
        borderColor: theme.borders.strong
      }
    : {
        color: theme.palette.secondary,
        backgroundColor: theme.surfaces.overlay,
        borderColor: theme.borders.strong
      };

  const typeAccent = showType === 'space'
    ? {
        color: theme.palette.accent,
        backgroundColor: theme.surfaces.overlay,
        borderColor: theme.borders.strong
      }
    : {
        color: theme.palette.secondary,
        backgroundColor: theme.surfaces.overlay,
        borderColor: theme.borders.strong
      };

  const cardAccent = currentCard?.type === 'space'
    ? {
        borderColor: theme.borders.strong,
        backgroundColor: theme.surfaces.contrast
      }
    : {
        borderColor: theme.borders.subtle,
        backgroundColor: theme.surfaces.contrast
      };

  const isMissingContent = !currentCard?.phrase && !currentCard?.mnemonic && !currentCard?.image;

  if (!currentCard) {
    return (
      <div
        className="min-h-screen p-4 flex items-center justify-center"
        style={{ background: theme.gradients.pageOverlay, color: theme.palette.text }}
      >
        <div
          className="max-w-xl w-full rounded-xl shadow-lg p-6 text-center space-y-2"
          style={{ backgroundColor: theme.surfaces.contrast, border: `1px solid ${theme.borders.contrast}` }}
        >
          <p className="text-lg font-semibold" style={{ color: theme.palette.primaryStrong }}>
            No mnemonic data found.
          </p>
          <p className="text-sm" style={{ color: theme.palette.textMuted }}>
            Try switching clef or line/space type to reload the study deck.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: theme.gradients.pageOverlay, color: theme.palette.text }}>
      <div
        className="mx-auto space-y-4"
        style={{ maxWidth: 'clamp(320px, 95vw, 1100px)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 sm:mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 transition-colors text-sm sm:text-base"
            style={{ color: theme.palette.secondary }}
          >
            <FaArrowLeft /> Back to Home
          </button>
          <h1
            className="font-bold text-center sm:text-left"
            style={{ color: theme.palette.text, fontSize: 'clamp(1.35rem, 2vw + 1rem, 2.35rem)' }}
          >
            NotaQuest - Staff Position Mnemonics
          </h1>
          <div className="hidden sm:block w-24"></div>
        </div>

        <div
          className="rounded-xl shadow-lg overflow-hidden mb-6 sm:mb-8"
          style={{ backgroundColor: theme.surfaces.contrast, border: `1px solid ${theme.borders.contrast}` }}
        >
          <div className="relative h-64 p-4 sm:p-6">
            <div
              className="relative h-full"
              style={{ borderBottom: `2px solid ${theme.borders.contrast}`, borderTop: `2px solid ${theme.borders.contrast}` }}
            >
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute w-full h-0.5"
                  style={{ top: `${20 + line * 10}%`, backgroundColor: theme.borders.contrast }}
                ></div>
              ))}

              <div className="absolute left-4 text-5xl" style={{ top: '15%' }}>
                {clef === 'treble' ? '𝄞' : '𝄢'}
              </div>

              <div className="absolute left-0 right-0 top-0 bottom-0">
                <div 
                  ref={noteContainerRef} 
                  className="w-full h-full"
                  onClick={toggleMnemonic}
                >
                  {/* VexFlow will render here */}
                </div>
                <AnimatePresence mode="wait">
                  {showMnemonic && (
                    <motion.div
                      key="mnemonic"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="absolute bottom-4 left-0 right-0 text-center"
                    >
                      <div
                        className="inline-block px-4 py-3 rounded-lg shadow-md"
                        style={{ backgroundColor: theme.surfaces.contrast }}
                      >
                        <p
                          className="font-medium"
                          style={{ color: theme.palette.primaryStrong, fontSize: 'clamp(1rem, 1vw + 1rem, 1.25rem)' }}
                        >
                          {currentCard?.mnemonic || 'Mnemonic unavailable'}
                        </p>
                        <p
                          className="mt-1"
                          style={{ color: theme.palette.textMuted, fontSize: 'clamp(0.9rem, 1vw + 0.85rem, 1.05rem)' }}
                        >
                          {currentCard?.phrase || MNEMONIC_PHRASES[clef][showType] || 'No phrase provided for this card.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        <div
          className="p-4 sm:p-6 space-y-4"
          style={{ backgroundColor: theme.surfaces.overlayStrong, borderTop: `1px solid ${theme.borders.subtle}` }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold"
                style={clefAccent}
              >
                {currentCard.labels?.clef || `${clef === 'treble' ? 'Treble' : 'Bass'} Clef`}
              </span>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold"
                style={typeAccent}
              >
                {currentCard.labels?.staff || (showType === 'space' ? 'Space' : 'Line')}
              </span>
              <span
                className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold"
                style={{
                  borderColor: theme.borders.contrast,
                  backgroundColor: theme.surfaces.contrast,
                  color: theme.palette.text
                }}
              >
                {currentCard.labels?.position || 'Position data coming soon'}
              </span>
            </div>
            <div className="text-right text-xs" style={{ color: theme.palette.textMuted }}>
              <p>Legend</p>
              <p className="mt-1">Clef • Staff Type • Position</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <button
              onClick={toggleType}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                minHeight: '44px',
                backgroundColor: showType === 'space' ? theme.surfaces.contrast : theme.surfaces.overlay,
                color: showType === 'space' ? theme.palette.accent : theme.palette.secondary,
                border: `1px solid ${theme.borders.subtle}`
              }}
            >
              {showType === 'space' ? 'Space Notes' : 'Line Notes'}
            </button>

            <button
              onClick={toggleClef}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                minHeight: '44px',
                backgroundColor: theme.surfaces.contrast,
                color: theme.palette.text,
                border: `1px solid ${theme.borders.contrast}`
              }}
            >
              Switch to {clef === 'treble' ? 'Bass' : 'Treble'} Clef
            </button>

            <button
              onClick={toggleMnemonic}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                minHeight: '44px',
                backgroundColor: theme.surfaces.overlay,
                color: theme.palette.primaryStrong,
                border: `1px solid ${theme.borders.strong}`
              }}
            >
              {showMnemonic ? 'Show Note' : 'Show Mnemonic'}
            </button>
          </div>

          <div className="text-center">
            <p
              className="font-medium"
              style={{ color: theme.palette.text, fontSize: 'clamp(1.05rem, 1vw + 1rem, 1.35rem)' }}
            >
              {showType === 'space'
                ? clef === 'treble' ? 'F-A-C-E (Space notes)' : 'A-C-E-G (Space notes)'
                : clef === 'treble' ? 'E-G-B-D-F (Line notes)' : 'G-B-D-F-A (Line notes)'}
              </p>
            </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              onClick={prevCard}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isAnimating || cards.length === 0}
              style={{
                minHeight: '44px',
                backgroundColor: theme.surfaces.overlay,
                color: theme.palette.primary,
                border: `1px solid ${theme.borders.subtle}`
              }}
            >
              Previous
            </button>

            <div className="text-sm" style={{ color: theme.palette.textMuted }}>
              Card {currentCardIndex + 1} of {cards.length}
            </div>

            <button
              onClick={nextCard}
              className="px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isAnimating || cards.length === 0}
              style={{
                minHeight: '44px',
                backgroundColor: theme.palette.primaryStrong,
                color: theme.palette.text,
                border: `1px solid ${theme.borders.strong}`
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

        <div
          className="rounded-xl shadow-md border p-4 sm:p-6 mb-6"
          style={{
            ...cardAccent,
            boxShadow: theme.shadows.soft,
            maxWidth: 'clamp(320px, 95vw, 1100px)',
            margin: '0 auto'
          }}
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 items-start">
            <div className="space-y-3" style={{ maxWidth: 'min(540px, 100%)' }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: theme.palette.textMuted }}>
                Current Note
              </p>
              <p
                className="font-bold"
                style={{ color: theme.palette.primaryStrong, fontSize: 'clamp(2rem, 2.5vw + 1.5rem, 2.75rem)' }}
              >
                {currentCard.note}
              </p>
              <p
                className="font-semibold"
                style={{ color: theme.palette.text, fontSize: 'clamp(1.1rem, 1vw + 1rem, 1.4rem)' }}
              >
                {currentCard.mnemonic || 'Mnemonic missing'}
              </p>
              <p
                className="text-sm"
                style={{ color: theme.palette.textMuted, fontSize: 'clamp(0.95rem, 0.8vw + 0.9rem, 1.1rem)' }}
              >
                {currentCard.phrase || 'No phrase provided for this position.'}
              </p>
              {isMissingContent && (
                <p
                  className="text-xs rounded-md px-3 py-2"
                  style={{
                    color: theme.palette.accent,
                    backgroundColor: theme.surfaces.overlay,
                    border: `1px solid ${theme.borders.strong}`
                  }}
                >
                  Additional details will appear here once provided.
                </p>
              )}
            </div>
            <div className="w-full" style={{ maxWidth: 'min(520px, 100%)' }}>
              {currentCard.image ? (
                <img
                  src={currentCard.image}
                  alt={`${currentCard.note} mnemonic illustration`}
                  className="w-full max-h-56 object-contain rounded-lg shadow-sm mx-auto"
                  style={{ border: `1px solid ${theme.borders.contrast}` }}
                />
              ) : (
                <div
                  className="w-full h-40 sm:h-48 rounded-lg border border-dashed flex items-center justify-center text-sm"
                  style={{
                    borderColor: theme.borders.contrast,
                    color: theme.palette.textMuted,
                    backgroundColor: theme.surfaces.contrast
                  }}
                >
                  Illustration coming soon
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-sm" style={{ color: theme.palette.textMuted }}>
          <p>Click the staff to flip between the note and its mnemonic phrase.</p>
          <div className="mt-3 flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4 sm:gap-0">
            <button
              onClick={() => {
                if (!cards.length) return;
                const randomIndex = Math.floor(Math.random() * cards.length);
                setCurrentCardIndex(randomIndex);
                setShowMnemonic(false);
              }}
              className="flex items-center justify-center text-sm px-3 py-2 rounded-md"
              style={{ color: theme.palette.text }}
            >
              <FaRandom className="mr-1" /> Random Card
            </button>
            <button
              onClick={toggleMnemonic}
              className="flex items-center justify-center text-sm px-3 py-2 rounded-md"
              style={{ color: theme.palette.text }}
            >
              <FaMusic className="mr-1" /> {showMnemonic ? 'Show Note' : 'Show Mnemonic'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
