// namespace
window.lib = {};

// all page
lib.checkSessionUser = function () {
    if (sessionStorage.getItem("username") != null && sessionStorage.getItem("username") != "null")
        ;
    else {
        window.open("login.html");
    }
};

lib.logOut = function () {
    sessionStorage.setItem("username", "null");
    setTimeout(function () {
        window.open("login.html");}, 100);
};

lib.open = function (file) {
    window.open(file);
    // window.close();
};

lib.usernameSession = function (id) {
    let name = sessionStorage.getItem("username");
    document.getElementById(id).innerHTML = "Hello " + name + ",";
};

lib.messageToUser = function (id, mes, color = "") {
    document.getElementById(id).innerHTML = mes;
    document.getElementById(id).style.color = color;
}


lib.focusColor = function (id) {
    document.getElementById(id).style.backgroundColor = "gold";
    document.getElementById(id).style.color = "blue";
}

lib.focusOff = function (id) {
    document.getElementById(id).style.backgroundColor = "";
}



//page home

lib.showText = function (text, color) {
    document.getElementById('message').innerHTML = text;
    document.getElementById('message').style.color = color;
}

lib.getItem = function () {
    // get data from user
    var sum = document.getElementById("sum").value;
    var category = document.getElementById("category").value;
    var description = document.getElementById("description").value;
    var date = document.getElementById("date").value;
    var id = new Date().getTime();
    var username = sessionStorage.getItem("username")


    // check input
    var message = "";
    if (sum.trim() == "" || sum < 0)
        message += "sum is empty or incorrect\n";
    if (category.trim() == "")
        message += "category is empty or incorrect\n";
    if (date.trim() == "")
        message += "date is empty or incorrect\n";


    // add or send message error
    if (message == "") {
        libCostItem.addCostItem(new CostItem(id, sum, category, description, date, username), lib.showText);
    } else {
        lib.showText(message, 'red');
    }

}

lib.restart = function () {
    document.getElementById("sum").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";

    document.getElementById('message').innerHTML = "";
}

//page table

lib.successCostsItems = function (items) {
    // reset message
    document.getElementById('message-table').innerHTML = "";

    // remove table
    let element = document.getElementById("tbody");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    // update table
    var tbody = document.getElementById('tbody');
    items.forEach(
        function (ob) {
            // add data to table
            var tr = document.createElement("tr");
            var td;
            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getSum()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getCategory()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getDate()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getDescription()));
            tr.appendChild(td);

            tbody.appendChild(tr);
        }
    );
    $('#tbody').listview('refresh');
}

lib.errorCostsItems = function (text) {
    document.getElementById('message-table').innerHTML = text;
    document.getElementById('message-table').style.color = "red";
}


// page per-month

lib.addPieChart = function (map) {
    // load
    google.charts.load('current', {'packages': ['corechart']});
    // array of category and sum
    var key = map.keys();
    var val = map.values();
    var vec = [['Type of Cost', 'Shekels']];
    // add data to array vec
    for (var i = 0; i < map.size; i++) {
        vec.push([key.next().value, val.next().value]);
    }
    // draw chart
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(vec);
        var options = {title: 'My costs'};
        var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }

}

lib.successPerMonth = function (items, map) {
    // reset message
    document.getElementById('message-permonth').innerHTML = "";
    // add Pie Chart
    lib.addPieChart(map);

    // delete table
    let element = document.getElementById("tbody2");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    // delete table
    element = document.getElementById("tbody3");
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }


    // tbody2 add table
    var tbody = document.getElementById('tbody2');
    var tr, td;
    items.forEach(
        function (ob) {
            tr = document.createElement("tr");

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getSum()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getCategory()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getDate()));
            tr.appendChild(td);

            td = document.createElement("td");
            td.appendChild(document.createTextNode(ob.getDescription()));
            tr.appendChild(td);

            tbody.appendChild(tr);
        }
    );


    // tbody3 add table
    var tbody3 = document.getElementById('tbody3');
    var key = map.keys();
    var val = map.values();
   // var sum = 0;
    for (var i = 0; i < map.size; i++) {
        tr = document.createElement("tr");

        td = document.createElement("td");
        td.appendChild(document.createTextNode(val.next().value));
        tr.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(key.next().value));

      //  sum += Number(val.next().value);
        tr.appendChild(td);

        tbody3.appendChild(tr);
    }
    /*
    tr = document.createElement("tr");

    td = document.createElement("td");
    td.appendChild(document.createTextNode(sum));
    tr.appendChild(td);

    td = document.createElement("td");
    td.appendChild(document.createTextNode("total"));
    tr.appendChild(td);

    tbody3.appendChild(tr);
    */


    // update
    $('#tbody3').listview('refresh');
    $('#tbody2').listview('refresh');
}

lib.errorPerMonth = function (text) {
    document.getElementById('message-permonth').innerHTML = text;
    document.getElementById('message-permonth').style.color = "red";
}

lib.getItemsPerMonth = function () {
    var month = document.getElementById("month-year").value;
    var arr;
    if (month != "") {
        arr = month.split("-");
        libCostItem.getCostsPerMonth(arr[0], arr[1], lib.successPerMonth, lib.errorPerMonth);
        document.getElementById('message-permonth').innerHTML = "";
    } else {
        document.getElementById('message-permonth').innerHTML = "Error in input";
        document.getElementById('message-permonth').style.color = "red";
    }


};


//new


// register
lib.register = function () {

    let username = document.getElementById('username-register').value.trim();
    let password = document.getElementById('password-register').value.trim();

    // check value
    let check = checkValue(username, password);
    // if exits users
    if (check == 0)
        return;

    // get users
    let users = localStorage.getItem("users");

    if (users != null) {
        //exits users - check if have name like
        let listUsers = JSON.parse(users);
        let Exists = nameExits(listUsers);

        if (Exists == 1)
            return;

        //  add user
        addUser(listUsers);
    }

    // Add for the first time
    if (users == null) {
        addUser([]);
    }


    function checkValue(username, password) {
        let check;
        if (username != "" && password != "") {
            check = 1;
        } else {
            lib.messageToUser('message-register',"Error- Missing or incorrect value","red");
            check = 0;
        }
        return check;
    }

    function addUser(listUsers) {
        let user = {username: username, password: password};
        listUsers.push(user)
        localStorage.setItem("users", JSON.stringify(listUsers));

        lib.messageToUser('message-register',"add successfully, username=" + username,"green");
    }

    function nameExits(listUsers) {
        let Exists = 0;
        listUsers.forEach(
            function (ob) {
                if (ob.username == username)
                    Exists = 1;
            }
        );
        if (Exists == 1) {
            lib.messageToUser('message-register',"Such a name already exists","red");
        }
        return Exists;
    }

}

//login

lib.loginToApp = function () {

    let username = document.getElementById('username-login').value.trim();
    let password = document.getElementById('password-login').value;

    let existsUser = ifExistsUser(username, password);
    if (existsUser == 1) {
        lib.messageToUser('message-login',"");
        addSession(username);
        window.open("add.html");
    } else {
        lib.messageToUser('message-login',"Error login","red");
    }

    function ifExistsUser(username, password) {
        var userExists = 0;
        let item = localStorage.getItem("users");
        if (item != null) {
            let users = JSON.parse(localStorage.getItem("users"));
            users.forEach(
                function (ob) {
                    if (ob.username == username && ob.password == password)
                        userExists = 1;
                }
            );
        }
        return userExists;
    }

    function addSession(username) {
        sessionStorage.setItem("username", username);
    }

}



//
lib.searchTable = function (){
    $(document).ready(function(){
        $("#myInput").on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $("#tbody tr").filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });

}
