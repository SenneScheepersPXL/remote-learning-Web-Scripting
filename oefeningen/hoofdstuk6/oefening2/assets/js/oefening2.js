window.addEventListener("load", handleLoad);

function handleLoad() {
    let select = document.getElementById("personen_select");
    populateSelect(select);
    let zoekVriendenButton = document.getElementById("zoek_vrienden_button");
    zoekVriendenButton.addEventListener("click", handleZoekVriendenButton)
}

function populateSelect(select) {
    let url = "http://localhost:3000/persons/"
    fetch(url)
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw `error with status code ${response.status}`;
            }
        })
        .then((people) => {
            for (let person of people) {
                let element = document.createElement("option");
                element.value = person.id;
                element.appendChild(document.createTextNode(person.name));
                select.appendChild(element);
            }
        })
        .catch((error) => {
            document.getElementById("output").appendChild(document.createTextNode(error));
        });
}

/*
*   Problemen met vrienden weer te geven door async
*/

function handleZoekVriendenButton() {
    let url = "http://localhost:3000/persons/"
    let id = document.getElementById("personen_select").value;
    let output = document.getElementById("output");
    maakLeeg(output);
    fetch(url + id)
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw `error with status code ${response.status}`;
            }
        })
        .then((person) => {
            let friendsID = person.friends;
            let name = person.name;
            let string = ""
            if (friendsID.length > 0) {
                string = `${name} heeft als vrienden`;
                
            } else {
                string = `${name} heeft geen vrienden.`;
            }
            for (let friend of friendsID) {
                fetch(url + friend)
                    .then((response) => {
                        if (response.status == 200) {
                            return response.json();
                        } else {
                            throw `error with status code ${response.status}`;
                        }
                    })
                    .then((friend) => {
                        string += ` ${friend.name},`;
                    })
                    .catch((error) => {
                        output.appendChild(document.createTextNode(error));
                    });
            }
            return string;
        })
        .then((string) => {
            output.appendChild(document.createTextNode(string));
        })
        .catch((error) => {
            output.appendChild(document.createTextNode(error));
        });
}

function maakLeeg(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}