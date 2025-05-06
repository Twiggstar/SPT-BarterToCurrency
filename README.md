# Barter To Roubles

This mod converts all barter-only trades from SPT traders into rouble-based purchases using flea market prices from Ragfair, with a fallback to handbook pricing.

## Features

- Converts barter-only trades to rouble purchases
- Uses flea market pricing (RagfairPriceService)
- Falls back to handbook pricing if flea data is missing
- Configurable price multiplier in config.json
- Skips all trades using roubles, dollars, or euros
- REF trader is excluded by default

## Configuration

Edit config.json:

{
  "multiplier": 4
}

Price formula:
(fleaPrice OR handbookPrice)  multiplier

## Installation

1. Extract the mod to:
   user/mods/TheSaladGuy-BarterToRoubles/

2. (Optional) Adjust the multiplier in config.json

3. Start the SPT server and confirm in logs:
   [BarterToRoubles] Converted barter-only trades using x4 flea-based price. REF trader excluded.

## Technical Details

- Uses RagfairPriceService for current flea prices
- Falls back to handbook data when necessary
- Rounds prices to the nearest 100

## Author

TheSaladGuy

Developed with scripting assistance, tested live. Community feedback welcome.

## License

MIT - free to use, modify, and redistribute.
