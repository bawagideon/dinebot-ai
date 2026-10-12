const { test } = require('node:test');
const assert = require('node:assert');
const { DineBotEngine } = require('../src/index.js');

test('DineBotEngine: Allergen Matrix Screening', () => {
  const engine = new DineBotEngine();
  engine.addMenuItem({
    id: "MUSHROOM-RISOTTO",
    name: "Wild Forest Mushroom Risotto",
    price: 28000,
    allergens: [],
    isGlutenFree: true,
    isVegan: true
  });
  engine.addMenuItem({
    id: "TOMAHAWK",
    name: "24k Gold Tomahawk Ribeye",
    price: 145000,
    allergens: ["dairy"],
    isGlutenFree: true
  });
  engine.addMenuItem({
    id: "SOUFFLE",
    name: "Valrhona Molten Chocolate Soufflé",
    price: 16000,
    allergens: ["dairy", "gluten", "tree-nuts"]
  });

  const nutSafe = engine.filterSafeDishes({ excludeAllergens: ["tree-nuts"] });
  assert.strictEqual(nutSafe.length, 2);
  assert.ok(!nutSafe.some(d => d.id === "SOUFFLE"));
});

test('DineBotEngine: Sommelier Pairing Retrieval', () => {
  const engine = new DineBotEngine();
  engine.addWine({
    sku: "MARGAUX-2018",
    name: "2018 Château Margaux Premier Grand Cru",
    bottlePrice: 260000
  });
  engine.addMenuItem({
    id: "FILET-MIGNON",
    name: "Truffle Filet Mignon",
    price: 42000,
    suggestedWineSku: "MARGAUX-2018"
  });

  const pairing = engine.getWinePairing("FILET-MIGNON");
  assert.ok(pairing);
  assert.strictEqual(pairing.sku, "MARGAUX-2018");
});

test('DineBotEngine: Table Reservation & Deposit Checkout', () => {
  const engine = new DineBotEngine();
  const res = engine.createTableReservation({
    guestName: "Lady Folashade",
    guestPhone: "+2348033221100",
    partySize: 4,
    dateTime: "2026-10-16 20:00",
    seating: "window-terrace"
  });

  assert.strictEqual(res.depositAmount, 20000);
  assert.ok(res.checkoutUrl.includes("paystack"));
});
