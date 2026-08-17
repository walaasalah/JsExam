/**
 * NutriPlan - UI Components
 * كل الدوال هنا مسؤولة بس عن الرندر (بناء HTML) مفيهاش أي fetch
 * main.js هو اللي بيجيب الداتا ويستدعي الدوال دي
 */

/* ============= Cuisines ============= */

export function renderCuisineFilters(cuisines, activeCuisine = "") {
  const container = document.querySelector(
     "#cuisine-filters"
  );

  let buttonsHTML = `
    <button 
        class="cuisine-filter-btn px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all
        ${activeCuisine === ""
            ? "bg-emerald-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"}"
        data-cuisine=""
    >
        All Cuisines
    </button>
  `;

  for (let i = 0; i < cuisines.length; i++) {
    buttonsHTML += `
        <button 
            class="cuisine-filter-btn px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all
            ${activeCuisine === cuisines[i].name
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}"
            data-cuisine="${cuisines[i].name}"
        >
            ${cuisines[i].name}
        </button>
    `;
  }

  container.innerHTML = buttonsHTML;
}

/* ============= Meal Categories ============= */

const categoryStyles = {
  Beef: { bg: "from-red-50 to-red-50", iconBg: "from-red-400 to-red-500", icon: "fa-drumstick-bite", border: "border-red-200" },
  Chicken: { bg: "from-amber-50 to-amber-50", iconBg: "from-amber-400 to-amber-500", icon: "fa-drumstick-bite", border: "border-amber-200" },
  Dessert: { bg: "from-pink-50 to-pink-50", iconBg: "from-pink-400 to-pink-500", icon: "fa-cake-candles", border: "border-pink-200" },
  Lamb: { bg: "from-orange-50 to-orange-50", iconBg: "from-orange-400 to-orange-500", icon: "fa-drumstick-bite", border: "border-orange-200" },
  Miscellaneous: { bg: "from-gray-100 to-gray-100", iconBg: "from-gray-400 to-gray-500", icon: "fa-bowl-rice", border: "border-gray-300" },
  Pasta: { bg: "from-yellow-50 to-yellow-50", iconBg: "from-yellow-400 to-yellow-500", icon: "fa-bowl-food", border: "border-yellow-200" },
  Pork: { bg: "from-rose-50 to-rose-50", iconBg: "from-rose-400 to-rose-500", icon: "fa-bacon", border: "border-rose-200" },
  Seafood: { bg: "from-blue-50 to-blue-50", iconBg: "from-blue-400 to-blue-500", icon: "fa-fish", border: "border-blue-200" },
  Side: { bg: "from-emerald-50 to-emerald-50", iconBg: "from-emerald-400 to-emerald-500", icon: "fa-bowl-rice", border: "border-emerald-200" },
  Starter: { bg: "from-teal-50 to-teal-50", iconBg: "from-teal-400 to-teal-500", icon: "fa-utensils", border: "border-teal-200" },
  Vegan: { bg: "from-green-50 to-green-50", iconBg: "from-green-400 to-green-500", icon: "fa-leaf", border: "border-green-200" },
  Vegetarian: { bg: "from-lime-50 to-lime-50", iconBg: "from-lime-400 to-lime-500", icon: "fa-carrot", border: "border-lime-200" },
};

export function renderCategoryCards(categories, activeCategory = "") {
  const container = document.querySelector("#categories-grid");

  let cards = "";

  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i].name;

    const style = categoryStyles[categoryName] || {
      bg: "from-gray-50 to-gray-50",
      iconBg: "from-gray-400 to-gray-500",
      icon: "fa-utensils",
      border: "border-gray-200",
    };

    cards += `
      <div
          class="category-card rounded-xl p-3 border cursor-pointer transition-all group
          ${
              activeCategory === categoryName
                  ? "bg-emerald-600 text-white border-emerald-400"
                  : `bg-gradient-to-br ${style.bg} ${style.border} hover:shadow-md`
          }"
          data-category="${categoryName}"
      >
          <div class="flex items-center gap-2.5">
              <div
                  class="text-white w-9 h-9 bg-gradient-to-br ${style.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
              >
                  <i class="fa-solid ${style.icon}"></i>
              </div>
              <div>
                  <h3 class="text-sm font-bold ${
                      activeCategory === categoryName
                          ? "text-white"
                          : "text-gray-900"
                  }">
                      ${categoryName}
                  </h3>
              </div>
          </div>
      </div>
    `;
  }

  container.innerHTML = cards;
}

/* ============= Recipes Grid ============= */

export function renderRecipesGrid(meals, view = "grid") {
  const container = document.querySelector("#recipes-grid");
  let cardsHTML = "";

  for (let i = 0; i < meals.length; i++) {
    if (view === "list") {
      cardsHTML += `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex" data-meal-id="${meals[i].id}">
          <div class="relative w-48 shrink-0 overflow-hidden">
            <img
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="${meals[i].thumbnail}"
              alt="${meals[i].name}"
              loading="lazy"
            />
          </div>
          <div class="p-4 flex-1">
            <h3 class="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
              ${meals[i].name}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">Delicious recipe to try!</p>
            <div class="flex items-center gap-4 text-xs">
              <span class="font-semibold text-gray-900">
                <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                ${meals[i].category}
              </span>
              <span class="font-semibold text-gray-500">
                <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                ${meals[i].area}
              </span>
            </div>
          </div>
        </div>
      `;
    } else {
      cardsHTML += `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meals[i].id}">
          <div class="relative h-48 overflow-hidden">
            <img
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="${meals[i].thumbnail}"
              alt="${meals[i].name}"
              loading="lazy"
            />
            <div class="absolute bottom-3 left-3 flex gap-2">
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                ${meals[i].category}
              </span>
              <span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">
                ${meals[i].area}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              ${meals[i].name}
            </h3>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">Delicious recipe to try!</p>
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-900">
                <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                ${meals[i].category}
              </span>
              <span class="font-semibold text-gray-500">
                <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                ${meals[i].area}
              </span>
            </div>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = cardsHTML;
}

export function updateRecipesCount(count) {
  const countElement = document.querySelector("#recipes-count");
  countElement.textContent = `Showing ${count} recipe${count === 1 ? "" : "s"}`;
}

/* ============= Meal Details ============= */

export function renderMealDetails(meal) {
  document.querySelector("#meal-hero-image").src = meal.thumbnail;
  document.querySelector("#meal-hero-image").alt = meal.name;
  document.querySelector("#meal-hero-title").textContent = meal.name;

  const tagsContainer = document.querySelector("#meal-hero-tags");
  tagsContainer.innerHTML = `
    <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
    <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>
  `;

  const ingredientsContainer = document.querySelector("#meal-ingredients-list");
  let ingredientsHTML = "";

  for (let i = 0; i < meal.ingredients.length; i++) {
    ingredientsHTML += `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
        <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
        <span class="text-gray-700">
          <span class="font-medium text-gray-900">${meal.ingredients[i].measure}</span>
          ${meal.ingredients[i].ingredient}
        </span>
      </div>
    `;
  }

  ingredientsContainer.innerHTML = ingredientsHTML;

  document.querySelector("#meal-ingredients-count").textContent = `${meal.ingredients.length} items`;

  const instructionsContainer = document.querySelector("#meal-instructions-list");
  let instructionsHTML = "";

  for (let i = 0; i < meal.instructions.length; i++) {
    instructionsHTML += `
      <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
          ${i + 1}
        </div>
        <p class="text-gray-700 leading-relaxed pt-2">
          ${meal.instructions[i]}
        </p>
      </div>
    `;
  }

  instructionsContainer.innerHTML = instructionsHTML;

  const videoSection = document.querySelector("#meal-video-section");

  if (meal.youtube && meal.youtube !== "") {
    const videoId = getYoutubeId(meal.youtube);
    document.querySelector("#meal-video-iframe").src = `https://www.youtube.com/embed/${videoId}`;
    videoSection.classList.remove("hidden");
  } else {
    videoSection.classList.add("hidden");
  }
}

function getYoutubeId(url) {
  const parts = url.split("v=");
  return parts[1];
}

/* ============= Meal Nutrition Facts ============= */

export function renderNutritionFacts(nutrition) {
  const perServing = nutrition.perServing;
  const totals = nutrition.totals;

  const dailyValues = {
    protein: 50,
    carbs: 300,
    fat: 78,
    fiber: 28,
    sugar: 50,
    saturatedFat: 20,
  };

  document.querySelector("#hero-servings").textContent = `${nutrition.servings} servings`;
  document.querySelector("#hero-calories").textContent = `${perServing.calories} cal/serving`;

  document.querySelector("#nutrition-calories").textContent = perServing.calories;
  document.querySelector("#nutrition-total-calories").textContent = `Total: ${totals.calories} cal`;

  document.querySelector("#nutrition-protein").textContent = `${perServing.protein}g`;
  document.querySelector("#nutrition-carbs").textContent = `${perServing.carbs}g`;
  document.querySelector("#nutrition-fat").textContent = `${perServing.fat}g`;
  document.querySelector("#nutrition-fiber").textContent = `${perServing.fiber}g`;
  document.querySelector("#nutrition-sugar").textContent = `${perServing.sugar}g`;
  document.querySelector("#nutrition-saturated-fat").textContent = `${perServing.saturatedFat}g`;

  document.querySelector("#nutrition-cholesterol").textContent = `${perServing.cholesterol}mg`;
  document.querySelector("#nutrition-sodium").textContent = `${perServing.sodium}mg`;

  setBarWidth("#nutrition-protein-bar", perServing.protein, dailyValues.protein);
  setBarWidth("#nutrition-carbs-bar", perServing.carbs, dailyValues.carbs);
  setBarWidth("#nutrition-fat-bar", perServing.fat, dailyValues.fat);
  setBarWidth("#nutrition-fiber-bar", perServing.fiber, dailyValues.fiber);
  setBarWidth("#nutrition-sugar-bar", perServing.sugar, dailyValues.sugar);
  setBarWidth("#nutrition-saturated-fat-bar", perServing.saturatedFat, dailyValues.saturatedFat);

  document.querySelector("#meal-nutrition-section").classList.remove("hidden");
}

function setBarWidth(selector, value, maxValue) {
  let percentage = (value / maxValue) * 100;

  if (percentage > 100) {
    percentage = 100;
  }

  document.querySelector(selector).style.width = `${percentage}%`;
}

/* ============= Product Scanner: Categories ============= */

const productCategoryStyles = {
  snacks: { color1: "#a855f7", color2: "#d946ef", icon: "fa-cookie" },
  beverages: { color1: "#0ea5e9", color2: "#2563eb", icon: "fa-bottle-water" },
  dairies: { color1: "#3b82f6", color2: "#4f46e5", icon: "fa-cheese" },
  cheeses: { color1: "#eab308", color2: "#d97706", icon: "fa-cheese" },
  yogurts: { color1: "#f472b6", color2: "#f43f5e", icon: "fa-ice-cream" },
  chocolates: { color1: "#b45309", color2: "#713f12", icon: "fa-cookie-bite" },
  biscuits: { color1: "#fb923c", color2: "#d97706", icon: "fa-cookie" },
  "ice-creams": { color1: "#f472b6", color2: "#a855f7", icon: "fa-ice-cream" },
  "breakfast-cereals": { color1: "#fb923c", color2: "#ef4444", icon: "fa-wheat-awn" },
  breads: { color1: "#f59e0b", color2: "#ea580c", icon: "fa-bread-slice" },
  waters: { color1: "#22d3ee", color2: "#3b82f6", icon: "fa-droplet" },
  sodas: { color1: "#ef4444", color2: "#e11d48", icon: "fa-bottle-droplet" },
  coffees: { color1: "#92400e", color2: "#1c1917", icon: "fa-mug-saucer" },
  teas: { color1: "#16a34a", color2: "#047857", icon: "fa-mug-hot" },
  fruits: { color1: "#ef4444", color2: "#db2777", icon: "fa-apple-whole" },
  vegetables: { color1: "#22c55e", color2: "#059669", icon: "fa-carrot" },
  meats: { color1: "#dc2626", color2: "#be123c", icon: "fa-drumstick-bite" },
  fishes: { color1: "#3b82f6", color2: "#0891b2", icon: "fa-fish" },
  "plant-based-foods": { color1: "#84cc16", color2: "#16a34a", icon: "fa-leaf" },
  "chips-and-fries": { color1: "#eab308", color2: "#f97316", icon: "fa-bacon" },
  sauces: { color1: "#ef4444", color2: "#ea580c", icon: "fa-jar" },
  spreads: { color1: "#f59e0b", color2: "#ea580c", icon: "fa-bread-slice" },
  pastas: { color1: "#facc15", color2: "#d97706", icon: "fa-bowl-food" },
  desserts: { color1: "#ec4899", color2: "#e11d48", icon: "fa-cake-candles" },
};

export function renderProductCategories(categories, activeCategory = "") {
  const container = document.querySelector("#product-categories");

  let buttonsHTML = "";

  for (let i = 0; i < categories.length; i++) {
    const categoryId = categories[i].id;
    const categoryName = categories[i].name;

    const style = productCategoryStyles[categoryId] || {
      color1: "#9ca3af",
      color2: "#4b5563",
      icon: "fa-box",
    };

    const isActive = activeCategory === categoryId;

    buttonsHTML += `
      <button
        class="product-category-btn flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white whitespace-nowrap transition-all ${
          isActive ? "ring-2 ring-offset-2 ring-emerald-500" : "hover:opacity-90"
        }"
        style="background: linear-gradient(to right, ${style.color1}, ${style.color2})"
        data-category-id="${categoryId}"
      >
        <i class="fa-solid ${style.icon}"></i>
        ${categoryName}
      </button>
    `;
  }

  container.innerHTML = buttonsHTML;
}

/* ============= Product Scanner: Products Grid ============= */

export function renderProductsGrid(products) {
  const container = document.querySelector("#products-grid");

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-500">
        No products found
      </div>
    `;
    return;
  }

  let cardsHTML = "";

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const gradeColors = {
      a: "bg-green-500",
      b: "bg-lime-500",
      c: "bg-yellow-500",
      d: "bg-orange-500",
      e: "bg-red-500",
    };

    const gradeColor = gradeColors[product.nutritionGrade] || "bg-gray-400";
    const imageUrl = product.image || "https://placehold.co/300x300?text=No+Image";

    cardsHTML += `
      <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
        <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            src="${imageUrl}"
            alt="${product.name}"
            loading="lazy"
          />
          <div class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase">
            Nutri-Score ${product.nutritionGrade}
          </div>
        </div>

        <div class="p-4">
          <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
            ${product.brand || "Unknown brand"}
          </p>
          <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            ${product.name}
          </h3>

          <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(product.nutrients.calories.toFixed(2))} kcal/100g</span>
          </div>

          <div class="grid grid-cols-4 gap-1 text-center">
            <div class="bg-emerald-50 rounded p-1.5">
              <p class="text-xs font-bold text-emerald-700">${product.nutrients.protein.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Protein</p>
            </div>
            <div class="bg-blue-50 rounded p-1.5">
              <p class="text-xs font-bold text-blue-700">${product.nutrients.carbs.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Carbs</p>
            </div>
            <div class="bg-purple-50 rounded p-1.5">
              <p class="text-xs font-bold text-purple-700">${product.nutrients.fat.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Fat</p>
            </div>
            <div class="bg-orange-50 rounded p-1.5">
              <p class="text-xs font-bold text-orange-700">${product.nutrients.sugar.toFixed(2)}g</p>
              <p class="text-[10px] text-gray-500">Sugar</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = cardsHTML;
}

/* ============= Product Scanner: Product Modal ============= */

const productGradeInfo = {
  a: { label: "Excellent", bg: "bg-green-100", text: "text-green-700", badge: "bg-green-500" },
  b: { label: "Good", bg: "bg-lime-100", text: "text-lime-700", badge: "bg-lime-500" },
  c: { label: "Average", bg: "bg-yellow-100", text: "text-yellow-700", badge: "bg-yellow-500" },
  d: { label: "Poor", bg: "bg-orange-100", text: "text-orange-700", badge: "bg-orange-500" },
  e: { label: "Bad", bg: "bg-red-100", text: "text-red-700", badge: "bg-red-500" },
};

export function renderProductModal(product) {
  document.querySelector("#modal-product-image").src =
    product.image || "https://placehold.co/100x100?text=No+Image";
  document.querySelector("#modal-product-image").alt = product.name;
  document.querySelector("#modal-product-brand").textContent = product.brand || "Unknown brand";
  document.querySelector("#modal-product-name").textContent = product.name;

  const info = productGradeInfo[product.nutritionGrade];
  const badgeContainer = document.querySelector("#modal-nutriscore-badge");

  if (info) {
    badgeContainer.className = `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${info.bg}`;
    badgeContainer.innerHTML = `
      <span class="${info.badge} text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center">
        ${product.nutritionGrade.toUpperCase()}
      </span>
      <div>
        <p class="text-xs font-semibold ${info.text}">Nutri-Score</p>
        <p class="text-xs ${info.text}">${info.label}</p>
      </div>
    `;
    badgeContainer.classList.remove("hidden");
  } else {
    badgeContainer.classList.add("hidden");
  }

  const n = product.nutrients;

  document.querySelector("#modal-calories").textContent = Math.round(n.calories);
  document.querySelector("#modal-protein").textContent = `${n.protein.toFixed(2)}g`;
  document.querySelector("#modal-carbs").textContent = `${n.carbs.toFixed(2)}g`;
  document.querySelector("#modal-fat").textContent = `${n.fat.toFixed(2)}g`;
  document.querySelector("#modal-sugar").textContent = `${n.sugar.toFixed(2)}g`;
  document.querySelector("#modal-fiber").textContent = `${n.fiber.toFixed(2)}g`;
  document.querySelector("#modal-saturated-fat").textContent = "N/A";

  const salt = n.sodium * 2.5;
  document.querySelector("#modal-salt").textContent = `${salt.toFixed(2)}g`;

  const dailyValues = { protein: 50, carbs: 300, fat: 78, sugar: 50 };
  setModalBarWidth("#modal-protein-bar", n.protein, dailyValues.protein);
  setModalBarWidth("#modal-carbs-bar", n.carbs, dailyValues.carbs);
  setModalBarWidth("#modal-fat-bar", n.fat, dailyValues.fat);
  setModalBarWidth("#modal-sugar-bar", n.sugar, dailyValues.sugar);

  // نخفي قسم الـ Ingredients افتراضيًا كل مرة - main.js هيظهرها لو لقى داتا
  document.querySelector("#modal-ingredients-section").classList.add("hidden");

  document.querySelector("#product-modal").classList.remove("hidden");
  document.querySelector("#product-modal").classList.add("flex");
}

function setModalBarWidth(selector, value, maxValue) {
  let percentage = (value / maxValue) * 100;
  if (percentage > 100) percentage = 100;
  document.querySelector(selector).style.width = `${percentage}%`;
}

export function renderProductIngredients(ingredientsText) {
  const section = document.querySelector("#modal-ingredients-section");

  if (ingredientsText) {
    document.querySelector("#modal-ingredients-text").textContent = ingredientsText;
    section.classList.remove("hidden");
  } else {
    section.classList.add("hidden");
  }
}

export function closeProductModal() {
  document.querySelector("#product-modal").classList.add("hidden");
  document.querySelector("#product-modal").classList.remove("flex");
}

/* ============= Food Log ============= */

const FOODLOG_GOALS = { calories: 2000, protein: 50, carbs: 250, fat: 65 };

function setProgressBar(nutrient, value) {
  const goal = FOODLOG_GOALS[nutrient];
  let percentage = Math.round((value / goal) * 100);
  if (percentage > 100) percentage = 100;
  if (percentage < 0) percentage = 0;

  document.querySelector(`#foodlog-${nutrient}-bar`).style.width = `${percentage}%`;
  document.querySelector(`#foodlog-${nutrient}-percent`).textContent = `${percentage}%`;

  const unit = nutrient === "calories" ? "kcal" : "g";
  document.querySelector(`#foodlog-${nutrient}-value`).textContent = `${Math.round(value)} ${unit}`;
}

export function renderTodaySummary(todayEntries) {
  const totals = todayEntries.reduce(
    function (acc, entry) {
      acc.calories += entry.calories;
      acc.protein += entry.protein;
      acc.carbs += entry.carbs;
      acc.fat += entry.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  setProgressBar("calories", totals.calories);
  setProgressBar("protein", totals.protein);
  setProgressBar("carbs", totals.carbs);
  setProgressBar("fat", totals.fat);

  document.querySelector("#foodlog-items-count").textContent = todayEntries.length;

  const clearBtn = document.querySelector("#clear-foodlog");
  if (todayEntries.length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  renderLoggedItemsList(todayEntries);
}

function renderLoggedItemsList(todayEntries) {
  const container = document.querySelector("#logged-items-list");

  if (todayEntries.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page or scan products</p>
      </div>
    `;
    return;
  }

  const typeInfo = {
    meal: { label: "Recipe", color: "text-emerald-600", icon: "fa-utensils", iconBg: "bg-emerald-100 text-emerald-600" },
    product: { label: "Product", color: "text-blue-600", icon: "fa-barcode", iconBg: "bg-blue-100 text-blue-600" },
  };

  let itemsHTML = "";

  for (let i = 0; i < todayEntries.length; i++) {
    const entry = todayEntries[i];
    const info = typeInfo[entry.type];

    const imageHTML = entry.image
      ? `<img src="${entry.image}" alt="${entry.name}" class="w-14 h-14 rounded-xl object-cover" />`
      : `<div class="w-14 h-14 rounded-xl ${info.iconBg} flex items-center justify-center"><i class="fa-solid ${info.icon} text-xl"></i></div>`;

    itemsHTML += `
      <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
        ${imageHTML}
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 truncate">${entry.name}</h4>
          <p class="text-sm text-gray-500">
            ${entry.subtitle} <span class="text-gray-300">•</span> <span class="${info.color} font-medium">${info.label}</span>
          </p>
          <p class="text-xs text-gray-400">${entry.time}</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <p class="font-bold text-emerald-600">${Math.round(entry.calories)}</p>
            <p class="text-xs text-gray-400">kcal</p>
          </div>
          <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">${Math.round(entry.protein)}g P</span>
          <span class="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">${Math.round(entry.carbs)}g C</span>
          <span class="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded">${Math.round(entry.fat)}g F</span>
          <button class="delete-log-entry-btn text-gray-400 hover:text-red-500 transition-colors" data-entry-id="${entry.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = itemsHTML;
}

export function renderWeeklyOverview(weekData) {
  // weekData: array من 7 عناصر { dayLabel, dateLabel, calories, itemsCount, isToday }
  const container = document.querySelector("#weekly-days-container");

  const maxCalories = Math.max(...weekData.map((d) => d.calories), 1);

  let daysHTML = "";

  for (let i = 0; i < weekData.length; i++) {
    const day = weekData[i];
    const hasData = day.calories > 0;

    daysHTML += `
      <div class="text-center rounded-xl p-3 ${day.isToday ? "bg-indigo-100" : ""}">
        <p class="text-xs font-medium text-gray-500 mb-1">${day.dayLabel}</p>
        <p class="text-sm font-bold text-gray-700 mb-2">${day.dateLabel}</p>
        <p class="text-lg font-bold ${hasData ? "text-emerald-600" : "text-gray-300"}">${Math.round(day.calories)}</p>
        <p class="text-xs text-gray-400 mb-1">kcal</p>
        <p class="text-xs text-gray-400">${day.itemsCount} item${day.itemsCount === 1 ? "" : "s"}</p>
      </div>
    `;
  }

  container.innerHTML = daysHTML;

  const totalCalories = weekData.reduce((sum, d) => sum + d.calories, 0);
  const totalItems = weekData.reduce((sum, d) => sum + d.itemsCount, 0);
  const daysOnGoal = weekData.filter(
    (d) => d.calories >= FOODLOG_GOALS.calories * 0.8 && d.calories <= FOODLOG_GOALS.calories * 1.1
  ).length;

  document.querySelector("#weekly-average-value").textContent = `${Math.round(totalCalories / 7)} kcal`;
  document.querySelector("#weekly-total-items-value").textContent = `${totalItems} items`;
  document.querySelector("#weekly-days-goal-value").textContent = `${daysOnGoal} / 7`;
}

/* ============= Log Meal Modal (اختيار عدد الحصص) ============= */

export function renderLogMealModal(meal, perServing, servings) {
  document.querySelector("#log-meal-modal-image").src = meal.thumbnail;
  document.querySelector("#log-meal-modal-name").textContent = meal.name;
  document.querySelector("#log-meal-servings-input").value = servings;

  updateLogMealEstimate(perServing, servings);

  document.querySelector("#log-meal-modal").classList.remove("hidden");
  document.querySelector("#log-meal-modal").classList.add("flex");
}

export function updateLogMealEstimate(perServing, servings) {
  document.querySelector("#log-meal-est-calories").textContent = Math.round(perServing.calories * servings);
  document.querySelector("#log-meal-est-protein").textContent = `${Math.round(perServing.protein * servings)}g`;
  document.querySelector("#log-meal-est-carbs").textContent = `${Math.round(perServing.carbs * servings)}g`;
  document.querySelector("#log-meal-est-fat").textContent = `${Math.round(perServing.fat * servings)}g`;
}

export function closeLogMealModal() {
  document.querySelector("#log-meal-modal").classList.add("hidden");
  document.querySelector("#log-meal-modal").classList.remove("flex");
}
