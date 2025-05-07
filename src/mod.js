const path = require("path");
const fs = require("fs");

class BarterToCurrency {
    constructor() {
        this.mod = "TheSaladGuy-BarterToCurrency";
    }

    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const ragfairPriceService = container.resolve("RagfairPriceService");

        const configPath = path.resolve(__dirname, "../config.json");
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

        const getItemPrice = (tpl) => {
            return ragfairPriceService.getDynamicPriceForItem(tpl) ||
                db.templates.handbook.Items.find(x => x.Id === tpl)?.Price || 0;
        };

        const currencyTpls = {
            roubles: "5449016a4bdc2d6f028b456f",
            dollars: "5696686a4bdc2da3298b456a",
            euros:   "569668774bdc2da2298b4568",
            gpcoin:  "5d235b4d86f7742e017bc88a"
        };

        const gpCoinBasePrice = 38200;
        const hardcoreSkips = ["fence", "ragfair", "tushonka", "btr"];

        const idToName = {};
        for (const [id, trader] of Object.entries(db.traders)) {
            idToName[id] = trader.base?.nickname?.toLowerCase();
        }

        for (const traderID in db.traders) {
            if (hardcoreSkips.includes(traderID.toLowerCase())) continue;

            const trader = db.traders[traderID];
            const assort = trader.assort;
            if (!assort || !assort.items || !assort.barter_scheme) continue;

            const itemsDict = assort.items.reduce((dict, itm) => {
                dict[itm._id] = itm;
                return dict;
            }, {});

            const traderName = idToName[traderID];
            const traderCfg = config.traders[traderName];

            if (!traderCfg || !traderCfg.enabled || !currencyTpls[traderCfg.currency]) continue;

            const currency = traderCfg.currency;
            const currencyTpl = currencyTpls[currency];
            const rate = config.currencyRates[currency] || 1;
            const multiplier = traderCfg.multiplier !== undefined ? traderCfg.multiplier : config.priceMultiplier || 1;

            for (const item of assort.items) {
                const scheme = assort.barter_scheme[item._id];
                if (!scheme || !Array.isArray(scheme)) continue;

                const firstRequirement = scheme[0][0];
                const isAlreadyCurrency = Object.values(currencyTpls).includes(firstRequirement._tpl);
                if (isAlreadyCurrency) continue;

                let totalPrice = getItemPrice(item._tpl);

                if (item.parentId && itemsDict[item.parentId]) {
                    totalPrice += getItemPrice(itemsDict[item.parentId]._tpl);
                }

                for (const childItem of assort.items.filter(ci => ci.parentId === item._id)) {
                    totalPrice += getItemPrice(childItem._tpl);
                }

                if (totalPrice > 0) {
                    let adjustedPrice;
                    if (currency === "gpcoin") {
                        adjustedPrice = Math.ceil((totalPrice * multiplier) / gpCoinBasePrice);
                    } else {
                        adjustedPrice = Math.round(totalPrice * multiplier * rate);
                    }

                    assort.barter_scheme[item._id] = [[{
                        _tpl: currencyTpl,
                        count: adjustedPrice
                    }]];
                }
            }
        }
    }
}

module.exports = { mod: new BarterToCurrency() };