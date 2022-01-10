//creating our libCostItem namespace
window.libCostItem = {};

// names tables
libCostItem.nameDB = "CostManagement";
libCostItem.nameTableDB = "Cost";

//different web browsers might have different implementations
window.indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB;


libCostItem.request = window.indexedDB.open(libCostItem.nameDB, 1);


libCostItem.request.onerror = function (event) {
    libCostItem.costManagerException("Error: request")
};

libCostItem.request.onsuccess = function (event) {
    libCostItem.db = libCostItem.request.result;
    console.log("success: " + libCostItem.db);
};

libCostItem.request.onupgradeneeded = function (event) {
    console.log("on upgrade");
    var database = event.target.result;
    database.createObjectStore(libCostItem.nameTableDB, {keyPath: "id"});
};


libCostItem.addCostItem = function (item, showText) {
    // add item new
    var request = libCostItem.db.transaction([libCostItem.nameTableDB], "readwrite")
        .objectStore(libCostItem.nameTableDB)
        .add({
            id: item.getId(), sum: item.getSum(), category: item.getCategory(),
            description: item.getDescription(), date: item.getDate(), username: item.getUsername()
        });

    request.onsuccess = function (event) {
        console.log("Added successfully");
        showText("Added successfully", "green")
        //  window.open("#table","_top",'width=500, height=300');
    };

    request.onerror = function (event) {
        libCostItem.costManagerException("ERROR - In addition");
        showText("ERROR - In addition", "red")
    }

};

libCostItem.getCostsItems = function (success, error) {
    var objectStore = libCostItem.db.transaction(libCostItem.nameTableDB)
        .objectStore(libCostItem.nameTableDB);
    var items = [];

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        var item;
        if (cursor) {
            if (cursor.value.username == sessionStorage.getItem("username")) {
                item = new CostItem(cursor.value.id, cursor.value.sum, cursor.value.category
                    , cursor.value.description, cursor.value.date);
                items.push(item);
            }
            cursor.continue();
        }
        // After getting all the information which DB
        if (cursor == null) {
            success(items);
        }

    }

    objectStore.openCursor().onerror = function (event) {
        libCostItem.costManagerException("Error - in function getCostsItems");
        error("Error - cannot find data or empty data");
    }

};

libCostItem.getCostsPerMonth = function (year, month, success, error) {

    var objectStore = libCostItem.db.transaction(libCostItem.nameTableDB)
        .objectStore(libCostItem.nameTableDB);
    var items = [];

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        var item;
        if (cursor) {
            if (cursor.value.username == sessionStorage.getItem("username")) {
                item = new CostItem(cursor.value.id, cursor.value.sum, cursor.value.category
                    , cursor.value.description, cursor.value.date);
                items.push(item);
            }
            cursor.continue();
        }
        if (cursor == null) {
            // item only month specific
            items = items.filter(x => x.getYear() == year && x.getMonth() == month);

            var map = new Map()
            var number = 0;
            for (var i = 0; i < items.length; i++) {
                if (!map.has(items[i].getCategory())) {
                    map.set(items[i].getCategory(), Number(items[i].getSum()));
                } else {
                    number = Number(map.get(items[i].getCategory()));
                    map.set(items[i].getCategory(), Number(items[i].getSum()) + number);
                }
            }
            success(items, map);
        }

    }

    objectStore.openCursor().onerror = function (event) {
        libCostItem.costManagerException("Error - in function getCostsPerMonth")
        error("Error - cannot find data or empty data");
    }

};

class CostItem {
    #id;
    #sum;
    #category;
    #description;
    #date;
    #username;

    constructor(id, sum, category, description, date, username) {
        this.setId(id);
        this.setSum(sum);
        this.setCategory(category);
        this.setDescription(description);
        this.setDate(date);
        this.setUsername(username);
    }

    setId(id) {
        this.#id = id;
    }

    getId() {
        return this.#id;
    }

    setSum(sum) {
        this.#sum = sum;
    }

    getSum() {
        return this.#sum;
    }

    setCategory(category) {
        this.#category = category;
    }

    getCategory() {
        return this.#category;
    }

    setDescription(description) {
        this.#description = description;
    }

    getDescription() {
        return this.#description;
    }

    setDate(date) {
        this.#date = date;
    }

    getDate() {
        return this.#date;
    }

    setUsername(username) {
        this.#username = username;
    }

    getUsername() {
        return this.#username;
    }

    toString() {
        return "id=" + this.#id + " ," +
            "sum=" + this.#sum + " ," +
            "category=" + this.#category + " ," +
            "description=" + this.#description + " ," +
            "date=" + this.#date;
    }

    getYear() {
        return this.#date.substr(0, 4);
    }

    getMonth() {
        return this.#date.substr(5, 2);
    }

    getDay() {
        return this.#date.substr(8, 2);
    }


}

libCostItem.costManagerException = function (msg) {
    console.log(msg);
};
