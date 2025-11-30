import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MNEMONIC_CARDS, MNEMONIC_PHRASES, getCardsByType } from '../modes/mnemonic';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaMusic, FaRandom } from 'react-icons/fa';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';

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
      context.setBackgroundFillStyle('#FFF');
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
    ? 'text-indigo-800 bg-indigo-50 border-indigo-200'
    : 'text-emerald-800 bg-emerald-50 border-emerald-200';

  const typeAccent = showType === 'space'
    ? 'text-amber-800 bg-amber-50 border-amber-200'
    : 'text-sky-800 bg-sky-50 border-sky-200';

  const cardAccent = currentCard?.type === 'space'
    ? 'border-amber-200 bg-amber-50'
    : 'border-sky-200 bg-sky-50';

  const isMissingContent = !currentCard?.phrase && !currentCard?.mnemonic && !currentCard?.image;

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 text-center space-y-2">
          <p className="text-lg font-semibold text-indigo-900">No mnemonic data found.</p>
          <p className="text-sm text-gray-600">Try switching clef or line/space type to reload the study deck.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </button>
          <h1 className="text-2xl font-bold text-center text-indigo-900">
            NotaQuest - Staff Position Mnemonics
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 bg-white p-6">
            <div className="relative h-full border-b-2 border-t-2 border-gray-800">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute w-full h-0.5 bg-gray-800"
                  style={{ top: `${20 + line * 10}%` }}
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
                      <div className="inline-block bg-white bg-opacity-90 px-4 py-2 rounded-lg shadow-md">
                        <p className="text-lg font-medium text-indigo-700">
                          {currentCard?.mnemonic || 'Mnemonic unavailable'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {currentCard?.phrase || MNEMONIC_PHRASES[clef][showType] || 'No phrase provided for this card.'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${clefAccent}`}>
                {currentCard.labels?.clef || `${clef === 'treble' ? 'Treble' : 'Bass'} Clef`}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${typeAccent}`}>
                {currentCard.labels?.staff || (showType === 'space' ? 'Space' : 'Line')}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700">
                {currentCard.labels?.position || 'Position data coming soon'}
              </span>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Legend</p>
              <p className="mt-1">Clef • Staff Type • Position</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={toggleType}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showType === 'space'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {showType === 'space' ? 'Space Notes' : 'Line Notes'}
              </button>
              
              <button
                onClick={toggleClef}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Switch to {clef === 'treble' ? 'Bass' : 'Treble'} Clef
              </button>

              <button
                onClick={toggleMnemonic}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
              >
                {showMnemonic ? 'Show Note' : 'Show Mnemonic'}
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-700">
                {showType === 'space' 
                  ? clef === 'treble' ? 'F-A-C-E (Space notes)' : 'A-C-E-G (Space notes)'
                  : clef === 'treble' ? 'E-G-B-D-F (Line notes)' : 'G-B-D-F-A (Line notes)'}
              </p>
            </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevCard}
              className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
              disabled={isAnimating || cards.length === 0}
            >
              Previous
            </button>

            <div className="text-sm text-gray-500">
                Card {currentCardIndex + 1} of {cards.length}
              </div>
              
            <button
              onClick={nextCard}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              disabled={isAnimating || cards.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

        <div className={`bg-white rounded-xl shadow-md border ${cardAccent} p-6 mb-6`}>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Current Note</p>
              <p className="text-4xl font-bold text-indigo-900">{currentCard.note}</p>
              <p className="text-lg font-semibold text-gray-800">{currentCard.mnemonic || 'Mnemonic missing'}</p>
              <p className="text-sm text-gray-600">{currentCard.phrase || 'No phrase provided for this position.'}</p>
              {isMissingContent && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">Additional details will appear here once provided.</p>
              )}
            </div>
            <div className="w-full">
              {currentCard.image ? (
                <img
                  src={currentCard.image}
                  alt={`${currentCard.note} mnemonic illustration`}
                  className="w-full h-40 object-cover rounded-lg shadow-sm border border-gray-200"
                />
              ) : (
                <div className="w-full h-40 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm bg-gray-50">
                  Illustration coming soon
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Click the staff to flip between the note and its mnemonic phrase.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <button
              onClick={() => {
                if (!cards.length) return;
                const randomIndex = Math.floor(Math.random() * cards.length);
                setCurrentCardIndex(randomIndex);
                setShowMnemonic(false);
              }}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaRandom className="mr-1" /> Random Card
            </button>
            <button
              onClick={toggleMnemonic}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaMusic className="mr-1" /> {showMnemonic ? 'Show Note' : 'Show Mnemonic'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
