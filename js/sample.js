
var input = [
    {id: "test", type: "text", name: "Imie", description: "Jakis opis", regexp: /^[a-zA-Z]*[a-zA-Z]?$/, value: "Mateusz hehehe", class: "input", length: 10, break: false, uppercase: true},
    {id: "mail", type: "mail", name: "e-mail", description: "Adres e-mail", class: "input", length: 40, break: false, uppercase: true},
    {id: "test2", type: "number", class: "input", break: true, length: 3, description: "Wiek: "},
    {id: "test3", type: "checkbox", description: "checkbox opis"},
    {id: "test4", type: "hidden", name: "hidden name"},
    {id: "test5", type: "select", name: "lista rozwijana", list: ["Mateusz", "Jan", "Ania", "Kasia"], value: "Ania", class: "input"},
    {id: "haselko", type: "password", name: "haslo", length: 20, class: "input"}
];

$("#form").formGenerator("test", input);