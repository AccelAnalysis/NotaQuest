import React from 'react';
import type { NoteType, NotationItem as SharedNotationItem } from '../types/notes';

type StemDirection = 'up' | 'down' | 'auto' | null;

export interface NotationItem extends Omit<SharedNotationItem, 'noteType' | 'stemDirection' | 'alter'> {
  isRest: boolean;
  stemDirection: StemDirection;
  alter: -1 | 0 | 1;  // -1 = flat, 0 = natural, 1 = sharp
  duration: number;   // Duration in beats
  noteType?: NoteType;
}

interface NoteRendererProps extends Omit<NotationItem, 'noteId' | 'staffPosition'> {
  noteId: string;
  staffPosition: number;
  className?: string;
  showStem?: boolean;
}

const NoteRenderer: React.FC<NoteRendererProps> = ({
  noteId,
  staffPosition,
  className = '',
  isRest = false,
  noteType = 'quarter',
  stemDirection = null, // null means auto-determine
  showStem = true,
  alter = 0,
}) => {
  
  // Auto-determine stem direction if not specified
  const actualStemDirection = isRest 
    ? 'up' // Rests typically have stems that go up by default
    : stemDirection !== null 
      ? stemDirection 
      : staffPosition >= 0 ? 'down' : 'up';

  // Calculate if we need ledger lines (outside the staff)
  const needsLedger = Math.abs(staffPosition) > 4;
  const ledgerLines = [];
  
  // Determine stem classes based on direction
  const stemClass = actualStemDirection === 'up' 
    ? 'h-20 -right-1 top-0' 
    : 'h-20 -right-1 bottom-0';
  
  if (needsLedger) {
    const lineCount = Math.floor((Math.abs(staffPosition) - 3) / 2) + 1;
    const direction = staffPosition > 0 ? 1 : -1;
    
    for (let i = 0; i < lineCount; i++) {
      // Calculate ledger line position (0 = middle line, 2 = first line above/below staff)
      const linePosition = direction * (4 + i * 2);
      const positionFromCenter = (linePosition - staffPosition) * 6; // 6% per line
      
      ledgerLines.push(
        <div 
          key={`ledger-${i}`}
          className="absolute left-1/2 transform -translate-x-1/2 w-10 h-px bg-black"
          style={{
            top: `calc(50% + ${positionFromCenter}%)`,
          }}
        />
      );
    }
  }

  // Render accidental symbol if needed
  const renderAccidental = () => {
    if (alter === 0) return null;
    
    const accidental = alter === 1 ? '♯' : '♭';
    return (
      <div 
        className="absolute text-2xl font-bold -left-6"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {accidental}
      </div>
    );
  };
  
  // Render rest symbol based on note type
  const renderRest = () => {
    // Try to use SVG first, fallback to CSS
    const restIcons: Record<string, string> = {
      whole: '/assets/rest-whole.svg',
      half: '/assets/rest-half.svg',
      quarter: '/assets/rest-quarter.svg',
      eighth: '/assets/rest-eighth.svg',
      sixteenth: '/assets/rest-sixteenth.svg',
      thirtySecond: '/assets/rest-thirtysecond.svg',
    };

    // Fallback CSS rendering if SVG not available
    const renderFallbackRest = () => {
      switch (noteType) {
        case 'whole':
          return (
            <div className="absolute w-6 h-2 bg-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          );
        case 'half':
          return (
            <div className="absolute w-4 h-8 border-2 border-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          );
        case 'eighth':
          return (
            <div className="relative w-6 h-10">
              <div className="absolute w-4 h-1 bg-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute w-1 h-6 bg-black top-1/2 left-3/4 transform -translate-y-1/2"></div>
              <div className="absolute w-4 h-1 bg-black top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          );
        case 'quarter':
        default:
          return (
            <div className="relative w-6 h-10">
              <div className="absolute w-1 h-6 bg-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute w-4 h-1 bg-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          );
      }
    };

    return (
      <div className="relative w-8 h-8">
        {restIcons[noteType] ? (
          <img 
            src={restIcons[noteType]} 
            alt={`${noteType} rest`} 
            className="w-full h-full"
            onError={(e) => {
              // If SVG fails to load, render the fallback
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.insertAdjacentHTML('afterend', `
                <div class="rest-fallback">
                  ${renderFallbackRest()}
                </div>
              `);
            }}
          />
        ) : (
          renderFallbackRest()
        )}
      </div>
    );
  };

  // Render note with stem
  const renderNote = () => {
    const stemHeight = noteType === 'eighth' ? 30 : 24; // Longer stem for eighth notes
    const isWholeNote = noteType === 'whole';
    
    return (
      <div className="relative w-12 h-12">
        {/* Note Head */}
        <div 
          className={`absolute w-6 h-3 bg-black ${isWholeNote ? 'rounded-full' : 'rounded-full'}`}
          style={{ 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            backgroundColor: isWholeNote ? 'transparent' : 'black',
            border: isWholeNote ? '2px solid black' : 'none',
            width: isWholeNote ? '20px' : '16px',
            height: isWholeNote ? '10px' : '10px'
          }}
        />
        
        {/* Stem */}
        {showStem && (
          <div 
            className="absolute w-1 bg-black"
            style={{
              height: `${stemHeight}px`,
              left: '50%',
              top: actualStemDirection === 'up' 
                ? '50%' 
                : `calc(50% - ${stemHeight}px)`,
              transform: 'translateX(-50%)',
            }}
          />
        )}
        
        {/* Flag for eighth notes */}
        {showStem && noteType === 'eighth' && (
          <div 
            className="absolute w-4 h-1 bg-black"
            style={{
              left: '50%',
              top: actualStemDirection === 'up' 
                ? `calc(50% - ${stemHeight}px)` 
                : '50%',
              transform: actualStemDirection === 'up'
                ? 'translateX(-50%) rotate(45deg)'
                : 'translateX(-50%) rotate(-45deg)',
              transformOrigin: 'left center',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div 
      className={`relative w-12 h-12 ${className}`}
      data-note={noteId}
      data-staff-position={staffPosition}
      data-stem-direction={actualStemDirection}
      data-note-type={isRest ? 'rest' : noteType}
    >
      {ledgerLines}
      {!isRest && renderAccidental()}
      {isRest ? renderRest() : renderNote()}
    </div>
  );
};

export default NoteRenderer;
