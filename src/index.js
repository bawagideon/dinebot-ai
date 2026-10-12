/**
 * DineBot AI — Restaurant Concierge & Table Reservation Engine
 * Allergen matrix screening, sommelier pairing RAG, real-time table availability, and reservation deposits.
 */
class DineBotEngine {
  constructor(options = {}) {
    this.restaurantName = options.restaurantName || "Le Petit Châteaux";
    this.menu = new Map();
    this.wineList = new Map();
    this.reservations = new Map();
  }

  addMenuItem(dish) {
    if (!dish.id || !dish.name || typeof dish.price !== 'number') {
      throw new Error("Dish id, name, and numeric price are required");
    }
    const item = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      currency: dish.currency || "NGN",
      allergens: dish.allergens || [], // e.g. ["dairy", "gluten", "nuts"]
      isGlutenFree: !!dish.isGlutenFree,
      isVegan: !!dish.isVegan,
      suggestedWineSku: dish.suggestedWineSku || null
    };
    this.menu.set(dish.id, item);
    return item;
  }

  addWine(wine) {
    if (!wine.sku || !wine.name || typeof wine.bottlePrice !== 'number') {
      throw new Error("Wine sku, name, and numeric bottlePrice are required");
    }
    this.wineList.set(wine.sku, wine);
    return wine;
  }

  filterSafeDishes({ excludeAllergens = [], requireGlutenFree = false }) {
    const safe = [];
    for (const dish of this.menu.values()) {
      if (requireGlutenFree && !dish.isGlutenFree) continue;
      const hasConflict = dish.allergens.some(a => excludeAllergens.map(x => x.toLowerCase()).includes(a.toLowerCase()));
      if (!hasConflict) {
        safe.push(dish);
      }
    }
    return safe;
  }

  getWinePairing(dishId) {
    const dish = this.menu.get(dishId);
    if (!dish || !dish.suggestedWineSku) return null;
    return this.wineList.get(dish.suggestedWineSku) || null;
  }

  createTableReservation({ guestName, guestPhone, partySize, dateTime, seating = "dining-room" }) {
    if (!guestName || !partySize) throw new Error("guestName and partySize required");

    const isVip = seating === "vip-suite" || partySize > 6;
    const depositAmount = isVip ? 100000 : 20000;
    const resId = `RES-${Date.now()}`;

    const booking = {
      reservationId: resId,
      guestName,
      guestPhone,
      partySize,
      dateTime,
      seating,
      depositAmount,
      currency: "NGN",
      depositStatus: "pending",
      checkoutUrl: `https://checkout.paystack.com/res_${resId}?amt=${depositAmount}`,
      createdAt: new Date().toISOString()
    };
    this.reservations.set(resId, booking);
    return booking;
  }
}

module.exports = { DineBotEngine };
