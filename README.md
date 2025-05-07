# TheSaladGuy-BarterToRoubles

Converts barter-only trader deals into straight-rouble sales based on Ragfair market prices.

## Features
- Uses `RagfairOfferService.getMarketPrice(tpl)` for real-world price data.
- Falls back to item default price if no ragfair data.
- Configurable multiplier in `config.json`.
- Skips existing currency-only trades.
- Updates loyalty-level prices to match.

## Installation
1. Build with `npm run build`.
2. Zip and place into `user/mods/TheSaladGuy-BarterToRoubles`.
3. Launch SPT and check console for `[BarterToRoubles]` logs.

## Config (`config.json`)
```json
{
  "multiplier": 4
}
```
