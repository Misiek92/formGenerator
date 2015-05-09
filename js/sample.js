
var input = [
    {id: "test", type: "text", name: "Imie", description: "Jakis opis", regexp: /^[a-zA-Z]*[a-zA-Z]?$/, value: "Mateusz", className: "input", length: 10, minLength: 5, breakLine: false},
    {id: "mail", type: "mail", name: "e-mail", description: "Adres e-mail", className: "input", length: 40, breakLine: true},
    {id: "test2", type: "number", className: "input", breakLine: true, length: 3, description: "Wiek: "},
    {id: "test3", type: "checkbox", description: "checkbox opis"},
    {id: "test4", type: "hidden", name: "hidden name"},
    {id: "test5", type: "select", name: "lista rozwijana", list: ["Mateusz", "Jan", "Ania", "Kasia"], value: "Ania", className: "input"},
    {id: "haselko", type: "password", name: "haslo", length: 20, className: "input"}
];

var button = {
    className: "button",
    action: "post",
    url: "http://lets-deliver.pl/dev_001/UAT/tester.php",
    dataType: "text",
    success: function(data) { $("#response").html(data) }
};

$("#form").formGenerator("test", input, button);
