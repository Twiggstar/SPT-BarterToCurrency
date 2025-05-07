class BarterToRoubles {
    constructor() {
        this.mod = "TheSaladGuy-BarterToRoubles";
    }

    postDBLoad(container) {
        const db = container.resolve("DatabaseServer").getTables();
        const ragfairPriceService = container.resolve("RagfairPriceService");

        const getItemPrice = (tpl) => {
            return ragfairPriceService.getDynamicPriceForItem(tpl) ||
                db.templates.handbook.Items.find(x => x.Id === tpl)?.Price * 4 || 0;
        };

        for (const traderID in db.traders) {
            if (["ragfair", "fence"].includes(traderID)) continue;

            const trader = db.traders[traderID];
            const assort = trader.assort;
            if (!assort) continue;

            const itemsDict = assort.items.reduce((dict, itm) => {
                dict[itm._id] = itm;
                return dict;
            }, {});

            for (const item of assort.items) {
                let totalPrice = getItemPrice(item._tpl);

                // Safely add only installed attachments' prices
                if (item.parentId && itemsDict[item.parentId]) {
                    totalPrice += getItemPrice(itemsDict[item.parentId]._tpl);
                }

                for (const childItem of assort.items.filter(ci => ci.parentId === item._id)) {
                    totalPrice += getItemPrice(childItem._tpl);
                }

                if (totalPrice > 0) {
                    assort.barter_scheme[item._id] = [[{
                        _tpl: "5449016a4bdc2d6f028b456f",
                        count: Math.round(totalPrice)
                    }]];
                }
            }
        }
    }
}

module.exports = { mod: new BarterToRoubles() };
