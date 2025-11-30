import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Mnemonic from '../routes/Mnemonic';
import { getCardsByType, MNEMONIC_CARDS } from '../modes/mnemonic';

vi.mock('vexflow', () => {
  class MockContext {
    setBackgroundFillStyle() {}
    clear() {}
  }

  class MockRenderer {
    static Backends = { SVG: 'svg' };
    context = new MockContext();

    constructor(_element: HTMLElement) {}
    resize() {}
    getContext() {
      return this.context;
    }
  }

  class MockStave {
    addClef() { return this; }
    addTimeSignature() { return this; }
    setContext() { return this; }
    draw() { return this; }
  }

  class MockVoice {
    addTickables() { return this; }
    draw() { return this; }
  }

  class MockFormatter {
    joinVoices() { return this; }
    format() { return this; }
  }

  class MockStaveNote {
    addModifier() { return this; }
  }

  class MockAccidental {}

  return {
    Renderer: MockRenderer,
    Stave: MockStave,
    Voice: MockVoice,
    Formatter: MockFormatter,
    StaveNote: MockStaveNote,
    Accidental: MockAccidental
  };
});

vi.mock('../modes/mnemonic', async () => {
  const actual = await vi.importActual<typeof import('../modes/mnemonic')>('../modes/mnemonic');
  return {
    ...actual,
    getCardsByType: vi.fn(actual.getCardsByType)
  };
});

const mockedGetCardsByType = getCardsByType as vi.MockedFunction<typeof getCardsByType>;

const renderMnemonic = () =>
  render(
    <MemoryRouter>
      <Mnemonic />
    </MemoryRouter>
  );

describe('Mnemonic cards', () => {
  beforeEach(() => {
    mockedGetCardsByType.mockReset();
    mockedGetCardsByType.mockImplementation((type, clef) =>
      MNEMONIC_CARDS.filter(card => card.type === type && card.clef === clef)
        .sort((a, b) => a.position - b.position)
    );
  });

  it('renders mnemonic phrases, badges, and optional images', () => {
    renderMnemonic();

    expect(screen.getByText(/F is the first space/i)).toBeInTheDocument();
    expect(screen.getByText(/Treble Clef/i)).toBeInTheDocument();
    expect(screen.getByText(/Space 1/)).toBeInTheDocument();
    expect(screen.getByAltText(/F mnemonic illustration/i)).toBeInTheDocument();
  });

  it('shows fallback messaging when card content is missing', async () => {
    mockedGetCardsByType.mockReturnValueOnce([
      {
        note: 'Z',
        mnemonic: '',
        phrase: '',
        type: 'space',
        position: 0,
        clef: 'treble',
        labels: { clef: 'Treble Clef', staff: 'Space', position: 'Custom' }
      }
    ]);

    renderMnemonic();

    expect(screen.getByText(/Mnemonic missing/i)).toBeInTheDocument();
    expect(screen.getByText(/No phrase provided/i)).toBeInTheDocument();
    expect(screen.getByText(/Additional details will appear here/i)).toBeInTheDocument();
  });

  it('renders an empty state when no cards are available', () => {
    mockedGetCardsByType.mockReturnValueOnce([]);

    renderMnemonic();

    expect(screen.getByText(/No mnemonic data found/i)).toBeInTheDocument();
    expect(screen.getByText(/Try switching clef/i)).toBeInTheDocument();
  });
});
