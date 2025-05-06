
const path = require("path");
const fs = require("fs");

class BarterToRoubles {
    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const logger = container.resolve("WinstonLogger");
        const ROUBLE_ID = "5449016a4bdc2d6f028b456f";
        const REF_TRADER_ID = "6617beeaa9cfa777ca915b7c";

        // Load config
        let multiplier = 4;
        try {
            const configPath = path.resolve(__dirname, "../config.json");
            const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
            multiplier = config.multiplier || 4;
            logger.info(`[BarterToRoubles] Loaded config. Multiplier: x${multiplier}`);
        } catch (err) {
            logger.error("[BarterToRoubles] Failed to load config.json. Using default multiplier x4.");
        }

        // Prepare handbook fallback values
        const handbook = db.templates.handbook.Items;
        const handbookValues = {};
        for (const entry of handbook) {
            handbookValues[entry.Id] = entry.Price;
        }

        for (const traderId in db.traders) {
            if (traderId === REF_TRADER_ID) continue;

            const assort = db.traders[traderId].assort;
            if (!assort?.barter_scheme || !assort?.items) continue;

            for (const item of assort.items) {
                const itemId = item._id;
                const itemTpl = item._tpl;

                const scheme = assort.barter_scheme[itemId];
                if (!scheme || !Array.isArray(scheme)) continue;

                // Skip items that already use roubles, euros, or dollars
                const containsCurrency = scheme[0].some(entry => {
                    return ["5449016a4bdc2d6f028b456f", "5696686a4bdc2da3298b456a", "569668774bdc2da2298b4568"].includes(entry._tpl);
                });
                if (containsCurrency) continue;

                const fallbackPrice = handbookValues[itemTpl] || 1;
                const finalPrice = Math.round((fallbackPrice * multiplier) / 100) * 100 || 1;

                assort.barter_scheme[itemId] = [[{ count: finalPrice, _tpl: ROUBLE_ID }]];
            }
        }

        logger.info(`[BarterToRoubles] ✅ Barter-only trades converted using x${multiplier} price. REF trader excluded.`);
    }
}

module.exports = { mod: new BarterToRoubles() };
