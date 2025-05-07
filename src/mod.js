class BarterToRoubles {
    constructor() {
        this.mod = "TheSaladGuy-BarterToRoubles";
    }

    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const ragfairPriceService = container.resolve("RagfairPriceService");

        for (const traderID in db.traders) {
            if (["ragfair", "fence"].includes(traderID)) continue;

            const trader = db.traders[traderID];
            const assort = trader.assort;
            if (!assort) continue;

            for (const item of assort.items) {
                const itemID = item._tpl;
                let price = 0;

                // Check existing trader price first
                const traderPriceEntry = assort.barter_scheme[item._id];
                if (traderPriceEntry && traderPriceEntry[0][0]._tpl === "5449016a4bdc2d6f028b456f") {
                    price = traderPriceEntry[0][0].count;
                }

                // Include Armor plates prices (if they exist)
                if (db.templates.items[itemID]?._props?.Slots) {
                    for (const slot of db.templates.items[itemID]._props.Slots) {
                        if (slot._props?.filters[0]?.Filter) {
                            const plateIDs = slot._props.filters[0].Filter;
                            for (const plateID of plateIDs) {
                                const platePrice = ragfairPriceService.getDynamicPriceForItem(plateID) 
                                    || db.templates.handbook.Items.find(x => x.Id === plateID)?.Price;
                                if (platePrice) price += platePrice;
                            }
                        }
                    }
                }

                // Fallback to ragfair price if still zero
                if (!price) {
                    price = ragfairPriceService.getDynamicPriceForItem(itemID);
                }

                // Fallback to handbook price multiplied by a realistic modifier
                if (!price) {
                    const handbookItem = db.templates.handbook.Items.find(x => x.Id === itemID);
                    if (handbookItem) price = handbookItem.Price * 4;
                }

                // Set final price
                if (price > 0) {
                    assort.barter_scheme[item._id] = [[{
                        _tpl: "5449016a4bdc2d6f028b456f",
                        count: Math.round(price)
                    }]];
                }
            }
        }
    }
}

module.exports = { mod: new BarterToRoubles() };
