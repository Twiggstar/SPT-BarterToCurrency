# BarterToCurrency

A clean and modular SPT mod that converts item-based barter trades into currency trades, using the trader's default currency. Fully configurable per trader with support for price multipliers, GP Coin valuation, and currency scaling.

**Note:** This is a complete overhaul of the original `TheSaladGuy-BarterToRoubles` mod. Due to the scale of changes, the mod name was changed to avoid conflicts and ensure clean installation. Please delete the old mod before using this one.

## Features

- Converts item-based barters to currency trades on server startup
- Respects each trader’s native currency (roubles, dollars, euros, or GP Coin)
- Supports per-trader enable/disable, currency, and price multipliers
- GP Coin trades use a fixed base value (₽38,200)
- Uses dynamic pricing from Flea Market or handbook if needed
- Designed for SPT-AKI 3.11.3

## Installation

1. Delete any previous version of the mod
2. Extract `TheSaladGuy-BarterToCurrency` into your `user/mods/` directory
3. Launch the server

## Configuration

The configuration file is located at:

```
user/mods/TheSaladGuy-BarterToCurrency/config.json
```

### Global Settings

```json
"priceMultiplier": 1.0,
"currencyRates": {
  "roubles": 1,
  "dollars": 0.00757,
  "euros": 0.00662
}
```

- `priceMultiplier`: Scales all converted trades unless overridden per trader (Used as fallback to control weird low or too high values.)
- `currencyRates`: Defines scaling per currency type (ignored for GP Coin, for balance reasons it's best to control it individually at the trader specific multiplier.)

### Trader Settings

Each trader can be individually controlled:

```json
"prapor": {
  "enabled": true,
  "currency": "roubles",
  "multiplier": 0.9
},
"peacekeeper": {
  "enabled": true,
  "currency": "dollars",
  "multiplier": 1.2
},
"ref": {
  "enabled": true,
  "currency": "gpcoin",
  "multiplier": 1.0
}
```

- `enabled`: Whether barter conversion is enabled for the trader
- `currency`: Use `"roubles"`, `"dollars"`, `"euros"`, or `"gpcoin"`
- `multiplier`: Overrides the global price multiplier for this trader

> GP Coin barters use a static base of ₽38,200 per coin and apply the trader's multiplier.
