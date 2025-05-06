
# Barter To Roubles – SPT Mod by TheSaladGuy

This mod automatically converts all **barter-only trades** offered by traders in **Single Player Tarkov (SPT)** into clean, rouble-based purchases — using a configurable multiplier.

---

## ✅ Features

- Replaces barter-only trades with rouble equivalents
- Uses the item's handbook value × a multiplier from `config.json`
- Skips trades that already use roubles, euros, or dollars
- Excludes specific modded traders like REF by ID
- Clean logging to server console

---

## ⚙️ Configuration

The included `config.json` lets you change the rouble price multiplier:

```json
{
  "multiplier": 4
}
```

---

## 📂 Installation

1. Extract to:
   ```
   user/mods/TheSaladGuy-BarterToRoubles/
   ```
2. Optional: Edit `config.json` to change the multiplier
3. Launch SPT server and look for:
   ```
   [BarterToRoubles] ✅ Barter-only trades converted using x4 price. REF trader excluded.
   ```

---

## ℹ️ Details

- Only affects trades that use **barter items** (e.g. wires, GP coins)
- Leaves all **money-based trades** untouched
- REF trader (`6617beeaa9cfa777ca915b7c`) is hardcoded to be excluded

---

## 👤 Author

**TheSaladGuy**

Mod logic built collaboratively with scripting assistance and real-time testing.  
Open to contributions and adjustments based on SPT updates.

---

## 📜 License

MIT — feel free to modify and share.
