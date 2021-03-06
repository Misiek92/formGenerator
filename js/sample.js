
var input = [

    {id: "name", type: "text", name: "Imię", description: "Imię", regexp: /^[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]*[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]?$/, className: "input capitalize", labelClassName: "label", length: 20, required: true},
    {id: "surname", type: "text", name: "Nazwisko", description: "Nazwisko: ", regexp: /^[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]*[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]?$/, className: "input capitalize", length: 30, minLength: 3, required: false, breakLine: true},

    {id: "mail", type: "mail", name: "E-mail", description: "Adres e-mail: ", className: "input", length: 40},
    {id: "sampletitle", name: "Sample title", class: "title", type: "title"},
    {id: "phoneNr", type: "number", name: "Numer telefonu", description: "Numer telefonu: ", className: "input", length: 9, minLength: 9, required: true, breakLine: true},
    {id: "age", type: "number", name: "Wiek", className: "input", breakLine: false, length: 3, minLength: 1, regexp: /^[1-9]+[0-9]?$/, description: "Wiek: "},
    {id: "sex", type: "select", name: "Płeć", description: "Płeć: ", list: ["Mężczyzna", "Kobieta"], className: "input", breakLine: true},
    {id: "login", type: "text", name: "Login", description: "Login: ", length: 20, className: "input"},
    {id: "password", type: "password", name: "haslo", description: "Hasło: ", length: 30, className: "input", breakLine:true},
    {id: "comment", type: "textarea", name: "komentarz", description: "Komentarz: ", className: "input", breakLine: true},
    {id: "acceptRules", type: "checkbox", description: "Zapoznałem się z regulaminem i akceptuję jego załozenia "}
];

var button = {
    className: "button",
    action: "post",
    url: "http://example.com/",
    dataType: "text",
    success: function(data) { $("#response").html(data) }
};

$("#form").formGenerator("test", input, button, true);
