# Mnemonic mode data contract

Mnemonic card data should include the following fields so that frontend rendering and any future backend responses stay aligned:

- `phrase` (string): The descriptive sentence shown on the card.
- `note` (string): The staff note letter (e.g., `F`, `G`, `Bb`).
- `clef` ("treble" | "bass"): Indicates which clef the mnemonic targets.
- `type` ("space" | "line"): Distinguishes space vs. line mnemonics.
- `mnemonic` (string): The short prompt or keyword displayed with the note.
- `position` (number): Ordering helper for sorting within a clef/type.
- `labels` (object): Clef/staff/position labels for UI badges.
- Optional: `image` (string URL) for card art and `color` (string) for theme overrides.

Keep this contract in sync with any backend mnemonic API responses and the shared `MnemonicCard` interface in `src/types/mnemonic.ts`.
