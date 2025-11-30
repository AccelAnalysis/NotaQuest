import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../routes/Home';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: null, login: vi.fn(), logout: vi.fn() })
}));

vi.mock('../services/gamification', () => ({
  getProfile: vi.fn()
}));

describe('Home mode selection', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('toggles mode selection when a different card is clicked', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const bassCard = screen.getByRole('button', { name: /Bass Clef/i });

    await user.click(bassCard);

    expect(within(bassCard).getByText(/Selected/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Selected/i)).toHaveLength(1);
  });

  it('navigates to play route with the selected mode', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const bothCard = screen.getByRole('button', { name: /Both Clefs/i });
    await user.click(bothCard);

    const startButton = screen.getByRole('button', { name: /Start Practicing/i });
    await user.click(startButton);

    expect(mockNavigate).toHaveBeenCalledWith('/play?mode=both');
  });
});
