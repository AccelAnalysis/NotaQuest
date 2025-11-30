import React, { ReactNode } from 'react';

interface StaffDisplayProps {
  children: ReactNode | ReactNode[];
  className?: string;
  noteOffset?: number;
}

const StaffDisplay: React.FC<StaffDisplayProps> = ({ 
  children, 
  className = '',
  noteOffset = 20 // Default offset between notes in pixels
}) => {
  // Convert children to array if it's a single element
  const notes = React.Children.toArray(children);
  
  // Calculate staff line positions
  const staffLinePositions = [...Array(5)].map((_, i) => 20 + i * 12);
  
  // Function to determine if a note needs ledger lines
  const getLedgerLines = (notePosition: number) => {
    const lines = [];
    
    // Check for ledger lines above staff
    if (notePosition < staffLinePositions[0]) {
      for (let i = staffLinePositions[0] - 12; i >= notePosition; i -= 12) {
        if (i < staffLinePositions[0] - 6) { // Only show ledger lines close to staff
          lines.push(i);
        }
      }
    }
    
    // Check for ledger lines below staff
    if (notePosition > staffLinePositions[4]) {
      for (let i = staffLinePositions[4] + 12; i <= notePosition; i += 12) {
        if (i > staffLinePositions[4] + 6) { // Only show ledger lines close to staff
          lines.push(i);
        }
      }
    }
    
    return lines;
  };

  return (
    <div className={`relative w-full h-48 bg-white rounded-lg p-4 ${className}`}>
      {/* Staff Lines */}
      {staffLinePositions.map((position, i) => (
        <div 
          key={`staff-line-${i}`}
          className="absolute left-0 right-0 h-px bg-black z-10"
          style={{
            top: `${position}%`,
            width: '100%'
          }}
        />
      ))}
      
      {/* Ledger Lines */}
      {notes.flatMap((note, index) => {
        // @ts-ignore - We know the note has a position prop
        const notePosition = note.props?.position;
        if (typeof notePosition !== 'number') return null;
        
        return getLedgerLines(notePosition).map((linePos, i) => (
          <div
            key={`ledger-${index}-${i}`}
            className="absolute h-px bg-black z-0"
            style={{
              top: `${linePos}%`,
              left: `calc(50% + ${index * noteOffset}px)`,
              width: '24px',
              transform: 'translateX(-50%)',
            }}
          />
        ));
      })}
      
      {/* Clef */}
      <div className="absolute left-4 text-5xl z-20" style={{ top: '15%' }}>𝄞</div>
      
      {/* Notes */}
      <div className="relative w-full h-full">
        {notes.map((note, index) => (
          <div 
            key={`note-${index}`}
            className="absolute left-1/2 transform -translate-x-1/2 z-30"
            style={{
              transform: `translateX(calc(-50% + ${index * noteOffset}px))`,
            }}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDisplay;
