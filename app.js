// ======================================
// INSHA FOOD ORDERING SYSTEM
// Food Management: CRUD Operations
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const foodForm = document.getElementById("foodForm");
    const foodTableBody = document.getElementById("foodTableBody");

    const foodName = document.getElementById("food_name");
    const foodCategory = document.getElementById("category");
    const foodPrice = document.getElementById("price");
    const foodDescription = document.getElementById("description");
    const foodAvailability = document.getElementById("availability");

    const foodId = document.getElementById("food_id");
    const submitBtn = document.getElementById("submitBtn");

    const STORAGE_KEY = "inshaFoodItems";

    // Load saved food items from browser storage
    function getFoodItems() {
        try {
            const savedItems = localStorage.getItem(STORAGE_KEY);
            const items = savedItems ? JSON.parse(savedItems) : [];

            return Array.isArray(items) ? items : [];
        } catch (error) {
            console.error("Unable to load food items:", error);
            return [];
        }
    }

    let foodItems = getFoodItems();

    // Save food items in browser storage
    function saveFoodItems() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(foodItems)
            );
            return true;
        } catch (error) {
            alert("Unable to save data. Please check your browser storage.");
            return false;
        }
    }

    // Display food items in the table
    function displayFoodItems() {
        if (!foodTableBody) return;

        foodTableBody.replaceChildren();

        if (foodItems.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 7;
            cell.textContent = "No food items added yet.";

            row.appendChild(cell);
            foodTableBody.appendChild(row);
            return;
        }

        foodItems.forEach(function (food) {
            const row = document.createElement("tr");

            const values = [
                food.id,
                food.name,
                food.category,
                "₹" + Number(food.price).toFixed(2),
                food.description,
                food.availability
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            // Edit button
            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
                editFoodItem(food.id);
            });

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                deleteFoodItem(food.id);
            });

            actionCell.append(editButton, deleteButton);
            row.appendChild(actionCell);

            foodTableBody.appendChild(row);
        });
    }

    // CREATE and UPDATE food items
    if (foodForm) {
        foodForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = foodName.value.trim();
            const category = foodCategory.value;
            const price = Number(foodPrice.value);
            const description = foodDescription.value.trim();
            const availability = foodAvailability.value;

            if (!name || !category || !description ||
                !Number.isFinite(price) || price <= 0) {
                alert("Please enter valid food details.");
                return;
            }

            if (foodId.value) {
                // UPDATE existing item
                const id = Number(foodId.value);
                const index = foodItems.findIndex(function (item) {
                    return item.id === id;
                });

                if (index !== -1) {
                    foodItems[index] = {
                        id: id,
                        name: name,
                        category: category,
                        price: price,
                        description: description,
                        availability: availability
                    };
                }
            } else {
                // CREATE new item
                const newId = foodItems.length
                    ? Math.max(...foodItems.map(function (item) {
                        return Number(item.id) || 0;
                    })) + 1
                    : 1;

                foodItems.push({
                    id: newId,
                    name: name,
                    category: category,
                    price: price,
                    description: description,
                    availability: availability
                });
            }

            if (saveFoodItems()) {
                displayFoodItems();
                foodForm.reset();
                foodId.value = "";
                submitBtn.textContent = "Add Food Item";
                alert("Food item saved successfully!");
            }
        });
    }

    // EDIT a food item
    function editFoodItem(id) {
        if (!foodForm) return;

        const food = foodItems.find(function (item) {
            return item.id === id;
        });

        if (!food) return;

        foodId.value = food.id;
        foodName.value = food.name;
        foodCategory.value = food.category;
        foodPrice.value = food.price;
        foodDescription.value = food.description;
        foodAvailability.value = food.availability;

        submitBtn.textContent = "Update Food Item";
        foodForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // DELETE a food item
    function deleteFoodItem(id) {
        const confirmed = confirm(
            "Are you sure you want to delete this food item?"
        );

        if (!confirmed) return;

        const oldItems = [...foodItems];

        foodItems = foodItems.filter(function (item) {
            return item.id !== id;
        });

        if (saveFoodItems()) {
            displayFoodItems();
            alert("Food item deleted successfully!");
        } else {
            foodItems = oldItems;
        }
    }

    // Display saved items when the page opens
    displayFoodItems();

    // ======================================
    // CONTACT FORM DEMO
    // ======================================

    const contactForm = document.getElementById("contactForm");
    const contactStatus = document.getElementById("contactStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (contactStatus) {
                contactStatus.textContent =
                    "Your form is valid, but messages are not sent yet. " +
                    "Connect a backend or form service to receive messages.";
            } else {
                alert(
                    "The form is valid, but message delivery is not connected yet."
                );
            }

            // Do not claim that a message was sent.
            // Connect a backend or form service to enable delivery.
        });
    }

});