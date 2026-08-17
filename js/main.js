/**
 * NutriPlan - Main Entry Point
 */

import {
  renderCuisineFilters,
  renderCategoryCards,
  renderRecipesGrid,
  updateRecipesCount,
  renderMealDetails,
  renderNutritionFacts,
  renderProductCategories,
  renderProductsGrid,
  renderProductModal,
  renderProductIngredients,
  closeProductModal,
  renderTodaySummary,
  renderWeeklyOverview,
  renderLogMealModal,
  // updateLogMealEstimate,
  closeLogMealModal,
} from "./ui/components.js";

/* ============= State ============= */

const filters = {
  category: "",
  area: "",
};

const productFilters = {
  category: "",
};

let currentView = "grid";
let currentMeals = [];
let currentProducts = [];
let allProductCategories = [];

// آخر وصفة/منتج مفتوح، عشان نعرف نلوجه لو المستخدم دوس على الزرار
let currentMealForLog = null;
let currentProductForLog = null;

const USDA_API_KEY = "8KMPx3XnxEM54ZBzPeJq8CnuYf3aaeA0YpBIjbrU";

/* ============= Section Switching + Navigation ============= */

function switchSection(sectionName) {
  const mealsSections = [
    document.querySelector("#search-filters-section"),
    document.querySelector("#meal-categories-section"),
    document.querySelector("#all-recipes-section"),
  ];
  const productsSection = document.querySelector("#products-section");
  const foodlogSection = document.querySelector("#foodlog-section");
  const mealDetailsSection = document.querySelector("#meal-details");

  mealsSections.forEach((section) => section.classList.add("hidden"));
  productsSection.classList.add("hidden");
  foodlogSection.classList.add("hidden");
  mealDetailsSection.classList.add("hidden");

  if (sectionName === "meals"||sectionName === "foodlog#meals" ) {
    mealsSections.forEach((section) => section.classList.remove("hidden"));
  } else if (sectionName === "products") {
    productsSection.classList.remove("hidden");
  } else if (sectionName === "foodlog") {
    foodlogSection.classList.remove("hidden");
    renderFoodLogPage();
  } else if (sectionName === "meal-details") {
    mealDetailsSection.classList.remove("hidden");
  }

  highlightActiveNavLink(sectionName === "meal-details" ? "meals" : sectionName);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function highlightActiveNavLink(sectionName) {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    if (link.dataset.section === sectionName) {
      link.classList.add("bg-emerald-50", "text-emerald-700");
      link.classList.remove("text-gray-600");
    } else {
      link.classList.remove("bg-emerald-50", "text-emerald-700");
      link.classList.add("text-gray-600");
    }
  });
}

document.querySelectorAll(".nav-link").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const section = link.dataset.section;
    switchSection(section);

    if (section === "meals") {
      history.pushState({}, "", "/home");
    } else {
      history.pushState({}, "", `/${section}`);
    }
  });
});
function handleRoute() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (path === "/products") {
    switchSection("products");
  } else if (path === "/foodlog" && hash === "#meals") {
    switchSection("meals");
  } else if (path === "/foodlog") {
    switchSection("foodlog");
  } else if (path.startsWith("/meal/")) {
    if (history.state && history.state.mealId) {
      openMealDetails(history.state.mealId, false);
    } else {
      history.replaceState({}, "", "/home");
      switchSection("meals");
    }
  } else {
    switchSection("meals");
  }
}

window.addEventListener("popstate", handleRoute);


window.addEventListener("hashchange", handleRoute);

handleRoute();


document.querySelector("#back-to-meals-btn").addEventListener("click", function () {
  switchSection("meals");
  history.pushState({}, "", "/home");
});

/* ============= Cuisines ============= */

async function fetchCuisines() {
  const response = await fetch("https://nutriplan-api.vercel.app/api/meals/areas");
  const data = await response.json();
  return data.results;
}

async function initCuisines() {
  const cuisines = await fetchCuisines();

  renderCuisineFilters(cuisines);

  const container = document.querySelector(
    "#cuisine-filters"
  );

  container.addEventListener("click", function (e) {
    if (e.target.classList.contains("cuisine-filter-btn")) {
      filters.area = e.target.dataset.cuisine;
      renderCuisineFilters(cuisines, filters.area);
      loadMeals();
    }
  });
}

/* ============= Categories (Meals) ============= */

async function fetchCategories() {
  const response = await fetch("https://nutriplan-api.vercel.app/api/meals/categories");
  const data = await response.json();
  return data.results;
}

async function initCategories() {
  const categories = await fetchCategories();

  renderCategoryCards(categories);

  const container = document.querySelector("#categories-grid");

  container.addEventListener("click", function (e) {
    const card = e.target.closest(".category-card");
    if (!card) return;

    filters.category = card.dataset.category;
    renderCategoryCards(categories, filters.category);
    loadMeals();
  });
}

/* ============= Meals (Fetch + Render) ============= */

async function fetchMeals(category = "", area = "") {
  let response;

  if (category === "" && area === "") {
    response = await fetch("https://nutriplan-api.vercel.app/api/meals/random?count=25");
  } else {
    response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?category=${category}&area=${area}&limit=25`
    );
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

async function loadMeals() {
  const meals = await fetchMeals(filters.category, filters.area);
  currentMeals = meals;
  renderRecipesGrid(meals, currentView);
  updateRecipesCount(meals.length);
}

/* ============= Meals Search ============= */

async function fetchMealsBySearch(query) {
  const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${query}`);
  const data = await response.json();
  return data.results;
}

let searchTimer;
const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("input", function (e) {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(async function () {
    const query = e.target.value.trim();

    if (query === "") {
      loadMeals();
      return;
    }

    const meals = await fetchMealsBySearch(query);
    currentMeals = meals;
    renderRecipesGrid(meals, currentView);
    updateRecipesCount(meals.length);
  }, 500);
});

/* ============= Grid / List View Toggle ============= */

function switchView(view) {
  currentView = view;

  const gridBtn = document.querySelector("#grid-view-btn");
  const listBtn = document.querySelector("#list-view-btn");
  const recipesGrid = document.querySelector("#recipes-grid");

  if (view === "grid") {
    recipesGrid.classList.remove("grid-cols-2");
    recipesGrid.classList.add("grid-cols-4");

    gridBtn.classList.add("bg-white", "shadow-sm");
    listBtn.classList.remove("bg-white", "shadow-sm");
  } else {
    recipesGrid.classList.remove("grid-cols-4");
    recipesGrid.classList.add("grid-cols-2");

    listBtn.classList.add("bg-white", "shadow-sm");
    gridBtn.classList.remove("bg-white", "shadow-sm");
  }

  renderRecipesGrid(currentMeals, currentView);
}

document.querySelector("#grid-view-btn").addEventListener("click", function () {
  switchView("grid");
});

document.querySelector("#list-view-btn").addEventListener("click", function () {
  switchView("list");
});

/* ============= Meal Details + Nutrition ============= */

async function fetchMealById(id) {
  const response = await fetch(`https://nutriplan-api.vercel.app/api/meals/${id}`);
  const data = await response.json();
  return data.result;
}

function formatIngredientsForApi(ingredients) {
  return ingredients.map(function (item) {
    return `${item.measure} ${item.ingredient}`;
  });
}

async function fetchMealNutrition(recipeName, ingredients) {
  const response = await fetch("https://nutriplan-api.vercel.app/api/nutrition/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": USDA_API_KEY,
    },
    body: JSON.stringify({
      recipeName: recipeName,
      ingredients: ingredients,
    }),
  });

  const data = await response.json();

  if (data.data) {
    return data.data;
  }

  return data;
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function openMealDetails(mealId, updateUrl = true) {
  const meal = await fetchMealById(mealId);

  renderMealDetails(meal);
  switchSection("meal-details");

  if (updateUrl) {
    const slug = createSlug(meal.name);
    history.pushState({ mealId: mealId }, "", `/meal/${slug}`);
  }

  const formattedIngredients = formatIngredientsForApi(meal.ingredients);
  const nutrition = await fetchMealNutrition(meal.name, formattedIngredients);
  renderNutritionFacts(nutrition);

  currentMealForLog = { meal, nutrition };
}

document.querySelector("#recipes-grid").addEventListener("click", function (e) {
  const card = e.target.closest(".recipe-card");
  if (!card) return;

  openMealDetails(card.dataset.mealId);
});

/* ============= Browser Back/Forward (popstate) ============= */

window.addEventListener("popstate", function (e) {
  const path = window.location.pathname;

  if (path === "/home" || path === "/") {
    switchSection("meals");
  } else if (path === "/products") {
    switchSection("products");
  } else if (path === "/foodlog") {
    switchSection("foodlog");
  } else if (path.startsWith("/meal/")) {
    if (e.state && e.state.mealId) {
      openMealDetails(e.state.mealId, false);
    } else {
      history.replaceState({}, "", "/home");
      switchSection("meals");
    }
  }
});

/* ============= Product Scanner: Categories ============= */

async function fetchProductCategories() {
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/products/categories?page=1&limit=50"
  );
  const data = await response.json();
  return data.results;
}

async function initProductCategories() {
  const categories = await fetchProductCategories();
  allProductCategories = categories;

  renderProductCategories(categories);

  const container = document.querySelector("#product-categories");

  container.addEventListener("click", function (e) {
    const btn = e.target.closest(".product-category-btn");
    if (!btn) return;

    productFilters.category = btn.dataset.categoryId;
    renderProductCategories(categories, productFilters.category);
    loadProducts();
  });
}

/* ============= Product Scanner: Load Products ============= */

async function fetchProductsByCategory(categoryId, page = 1) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/category/${categoryId}?page=${page}&limit=24`
  );
  const data = await response.json();
  return data.results;
}

async function loadProducts() {
  if (!productFilters.category) return;

  const products = await fetchProductsByCategory(productFilters.category);
  currentProducts = products;
  renderProductsGrid(products);
  document.querySelector("#products-count").textContent = `Showing ${products.length} products`;
}

/* ============= Product Scanner: Search ============= */

async function fetchProductsBySearch(query, page = 1) {
  const response = await fetch(
    `https://nutriplan-api.vercel.app/api/products/search?q=${query}&page=${page}&limit=24`
  );
  const data = await response.json();
  return data.results;
}

document.querySelector("#search-product-btn").addEventListener("click", async function () {
  const query = document.querySelector("#product-search-input").value.trim();

  if (query === "") return;

  productFilters.category = "";
  renderProductCategories(allProductCategories, "");

  const products = await fetchProductsBySearch(query);
  currentProducts = products;
  renderProductsGrid(products);

  document.querySelector("#products-count").textContent = `Showing ${products.length} products`;
});

document.querySelector("#product-search-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    document.querySelector("#search-product-btn").click();
  }
});

/* ============= Product Scanner: Barcode Lookup ============= */

async function fetchProductByBarcode(barcode) {
  const response = await fetch(`https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`);

  if (!response.ok) {
    throw new Error(`Product not found: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

// معلومة إضافية (نص المكونات الكامل) مش موجودة في الـ API بتاعتنا،
// فبنجيبها بشكل منفصل من Open Food Facts باستخدام نفس الباركود
async function fetchProductIngredients(barcode) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json?fields=ingredients_text`
  );
  const data = await response.json();

  if (data.status === 1 && data.product.ingredients_text) {
    return data.product.ingredients_text;
  }

  return null;
}

// نقطة دخول واحدة لفتح الـ Modal: بتعرض الداتا الأساسية فورًا،
// وبعدين تكمّل المكونات لما توصل (بدون ما توقف عرض باقي التفاصيل)
async function openProductModal(product) {
  renderProductModal(product);

  currentProductForLog = product;

  const ingredientsText = await fetchProductIngredients(product.barcode);
  renderProductIngredients(ingredientsText);
}

document.querySelector("#lookup-barcode-btn").addEventListener("click", async function () {
  const barcode = document.querySelector("#barcode-input").value.trim();

  if (barcode === "") return;

  try {
    const product = await fetchProductByBarcode(barcode);
    currentProducts = [product];
    renderProductsGrid([product]);
    document.querySelector("#products-count").textContent = `Showing 1 product`;
    openProductModal(product);
  } catch (error) {
    document.querySelector("#products-grid").innerHTML = `
      <div class="col-span-full text-center py-12 text-gray-500">
        <i class="fa-solid fa-barcode text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">Product not found</p>
        <p class="text-sm">Check the barcode number and try again</p>
      </div>
    `;
    document.querySelector("#products-count").textContent = `Showing 0 products`;
  }
});

document.querySelector("#products-grid").addEventListener("click", async function (e) {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const product = await fetchProductByBarcode(card.dataset.barcode);
  openProductModal(product);
});

document.querySelector("#product-modal-close-btn").addEventListener("click", closeProductModal);
document.querySelector("#product-modal-close-btn-2").addEventListener("click", closeProductModal);

document.querySelector("#product-modal").addEventListener("click", function (e) {
  if (e.target.id === "product-modal") {
    closeProductModal();
  }
});

/* ============= Product Scanner: Nutri-Score Filter ============= */

document.querySelectorAll(".nutri-score-filter").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const grade = btn.dataset.grade;

    document.querySelectorAll(".nutri-score-filter").forEach(function (b) {
      b.classList.remove("bg-emerald-600", "text-white");
    });
    btn.classList.add("bg-emerald-600", "text-white");

    let filtered;

    if (grade === "") {
      filtered = currentProducts;
    } else {
      filtered = currentProducts.filter(function (product) {
        return product.nutritionGrade === grade;
      });
    }

    renderProductsGrid(filtered);
    document.querySelector("#products-count").textContent = `Showing ${filtered.length} products`;
  });
});

/* ============= Food Log: Storage (localStorage) ============= */

const FOODLOG_STORAGE_KEY = "nutriplan_foodlog_entries";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0]; // "2026-08-16"
}

function getDateString(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function formatTimeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getAllFoodLogEntries() {
  const raw = localStorage.getItem(FOODLOG_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAllFoodLogEntries(entries) {
  localStorage.setItem(FOODLOG_STORAGE_KEY, JSON.stringify(entries));
}

function addFoodLogEntry(entry) {
  const entries = getAllFoodLogEntries();
  entries.push(entry);
  saveAllFoodLogEntries(entries);
}

function removeFoodLogEntry(entryId) {
  const entries = getAllFoodLogEntries().filter(function (entry) {
    return entry.id !== entryId;
  });
  saveAllFoodLogEntries(entries);

  //--
  const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#155dfc",
  color: "#f9fefd",
  width: "300px",
  padding: "12px 16px",

  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

Toast.fire({
  title:"Item Remove from log"
});
}

function clearTodayFoodLogEntries() {
  const today = getTodayDateString();
  const entries = getAllFoodLogEntries().filter(function (entry) {
    return entry.date !== today;
  });
  saveAllFoodLogEntries(entries);
}

/* ============= Food Log: Render Page ============= */

function renderFoodLogPage() {
  const allEntries = getAllFoodLogEntries();
  const today = getTodayDateString();

  const todayEntries = allEntries.filter(function (entry) {
    return entry.date === today;
  });

  renderTodaySummary(todayEntries);

  // آخر 7 أيام (من الأقدم للأحدث، النهارده في الآخر)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const dateStr = getDateString(i);
    const dayEntries = allEntries.filter(function (entry) {
      return entry.date === dateStr;
    });

    const dayCalories = dayEntries.reduce(function (sum, entry) {
      return sum + entry.calories;
    }, 0);

    const dateObj = new Date(dateStr);

    weekData.push({
      dayLabel: dayLabels[dateObj.getDay()],
      dateLabel: dateObj.getDate(),
      calories: dayCalories,
      itemsCount: dayEntries.length,
      isToday: dateStr === today,
    });
  }

  renderWeeklyOverview(weekData);
}

/* ============= Food Log: Log This Meal / Log This Food ============= */

/* ============= Food Log: Success Alert (SweetAlert2) ============= */

function showLoggedAlert(title, message, calories) {
  Swal.fire({
    icon: "success",
    title: title,
    html: `
      <p style="color:#6b7280; margin-bottom: 8px;">${message}</p>
      <p style="color:#059669; font-weight:600;">+${Math.round(calories)} calories</p>
    `,
    confirmButtonText: "Great!",
    confirmButtonColor: "#059669",
    timer: 3000,
    timerProgressBar: true,
  });
}

/* ============= Food Log: Log This Meal (with servings modal) ============= */

document.querySelector("#log-meal-btn").addEventListener("click", function () {
  if (!currentMealForLog) return;

  const { meal, nutrition } = currentMealForLog;
  renderLogMealModal(meal, nutrition.perServing, 1);
});

document.querySelector("#log-meal-servings-minus").addEventListener("click", function () {
  const input = document.querySelector("#log-meal-servings-input");
  const newValue = Math.max(1, parseInt(input.value) - 1);
    // console.log(newValue);
  input.value = newValue;
});

document.querySelector("#log-meal-servings-plus").addEventListener("click", function () {
  const input = document.querySelector("#log-meal-servings-input");
  const newValue = parseInt(input.value) + 1;
  // console.log(newValue);
  input.value = newValue;
});

document.querySelector("#log-meal-servings-input").addEventListener("input", function (e) {
  let value = parseInt(e.target.value);
  if (!value || value < 1) value = 1;
});

document.querySelector("#log-meal-cancel-btn").addEventListener("click", closeLogMealModal);

document.querySelector("#log-meal-modal").addEventListener("click", function (e) {
  if (e.target.id === "log-meal-modal") {
    closeLogMealModal();
  }
});

document.querySelector("#log-meal-confirm-btn").addEventListener("click", function () {
  if (!currentMealForLog) return;

  const { meal, nutrition } = currentMealForLog;
  const servings = Math.max(1, parseInt(document.querySelector("#log-meal-servings-input").value) || 1);
  const perServing = nutrition.perServing;

  const totalCalories = Math.round(perServing.calories * servings);

  addFoodLogEntry({
    id: Date.now().toString(),
    date: getTodayDateString(),
    time: formatTimeNow(),
    name: meal.name,
    subtitle: `${servings} serving${servings > 1 ? "s" : ""}`,
    type: "meal",
    image: meal.thumbnail,
    calories: perServing.calories * servings,
    protein: perServing.protein * servings,
    carbs: perServing.carbs * servings,
    fat: perServing.fat * servings,
  });

  closeLogMealModal();

  showLoggedAlert(
    "Meal Logged!",
    `${meal.name} (${servings} serving${servings > 1 ? "s" : ""}) has been added to your daily log.`,
    totalCalories
  );
});

/* ============= Food Log: Log This Food (Product) ============= */

const today = new Date();

  document.querySelector("#foodlog-date").textContent =
    today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    });

document.querySelector("#modal-log-food-btn").addEventListener("click", function () {
  if (!currentProductForLog) return;

  const product = currentProductForLog;

  addFoodLogEntry({
    id: Date.now().toString(),
    date: getTodayDateString(),
    time: formatTimeNow(),
    name: product.name,
    subtitle: product.brand || "Unknown brand",
    type: "product",
    image: product.image,
    calories: product.nutrients.calories,
    protein: product.nutrients.protein,
    carbs: product.nutrients.carbs,
    fat: product.nutrients.fat,
  });

  closeProductModal();

const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "rgba(0, 154, 103, 1)",
  color: "#f9fefd",
  width: "520px",
  padding: "12px 16px",

  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

Toast.fire({
  title: `${product.name} Logged to your daily intake.`
});

});

/* ============= Food Log: Delete / Clear ============= */

document.querySelector("#logged-items-list").addEventListener("click", function (e) {
  const btn = e.target.closest(".delete-log-entry-btn");
  if (!btn) return;

  removeFoodLogEntry(btn.dataset.entryId);
  renderFoodLogPage();
});

document.querySelector("#clear-foodlog").addEventListener("click", function () {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Clear it!",
  }).then((result) => {
    if (result.isConfirmed) {
      clearTodayFoodLogEntries();
      renderFoodLogPage();
      Swal.fire({
        title: "Deleted!",
        text: "Your food log has been deleted.",
        icon: "success",
      });
    }
  });
});

document.querySelector("#btn-scan-product").addEventListener("click", function () {
  switchSection("products");
  history.pushState({}, "", "/products");
});


document.querySelector("#btn-add-log-food").addEventListener("click", function () {
  history.pushState({}, "", "/foodlog#meals");
  handleRoute();
});


/* ============= App Init ============= */

async function initApp() {
  const path = window.location.pathname;

  if (path.startsWith("/meal/")) {
    history.replaceState({}, "", "/home");
  }

  await Promise.all([initCuisines(), initCategories(), loadMeals(), initProductCategories()]);

  highlightActiveNavLink("meals");

  const loadingOverlay = document.querySelector("#app-loading-overlay");
  loadingOverlay.style.display = "none";
}

initApp();

