
const path = require("path");
const fs = require("fs");

class BarterToRoubles {
    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const logger = container.resolve("WinstonLogger");
        const ragfairPriceService = container.resolve("RagfairPriceService");
        const ROUBLE_ID = "5449016a4bdc2d6f028b456f";
        const REF_TRADER_ID = "6617beeaa9cfa777ca915b7c";

        // Load multiplier from config
        let multiplier = 4;
        try {
            const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../config.json"), "utf-8"));
            multiplier = config.multiplier || 4;
        } catch (e) {
            logger.warning("[BarterToRoubles] Failed to load config.json. Using default multiplier x4.");
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

                const containsCurrency = scheme[0].some(entry => {
                    return ["5449016a4bdc2d6f028b456f", "5696686a4bdc2da3298b456a", "569668774bdc2da2298b4568"].includes(entry._tpl);
                });
                if (containsCurrency) continue;

                // Get flea price or fallback to handbook
                const fleaPrice = ragfairPriceService.getFleaPrice(itemTpl);
                const fallback = handbookValues[itemTpl] || 1;
                const basePrice = fleaPrice > 0 ? fleaPrice : fallback;
                const finalPrice = Math.round((basePrice * multiplier) / 100) * 100 || 1;

                assort.barter_scheme[itemId] = [[{ count: finalPrice, _tpl: ROUBLE_ID }]];
            }
        }

        logger.info(`[BarterToRoubles]  Converted barter-only trades using x${multiplier} flea-based price. REF trader excluded.`);
    }
}

module.exports = { mod: new BarterToRoubles() };
