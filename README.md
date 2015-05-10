# formGenerator

formGenerator was created for school reasons, but i decided to develop it for myself and share it. 

Plugin provides possibility to easy create HTML form with jQuery (JavaScript) validation and AJAX post support. With formGenerator you can easily create any form to send an e-mails, or send data to database. You don't care about any validation. Everything is, or will be in the nearest feature, solved by this plugin. Just write requirements for every field and that's it!

### Sample usage

```js
var input = [
    {id: "name", type: "text", name: "Imię", description: "Imię", regexp: /^[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]*[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]?$/, className: "input capitalize", labelClassName: "label", length: 20, required: true},
    {id: "surname", type: "text", name: "Nazwisko", description: "Nazwisko: ", regexp: /^[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]*[a-zA-ZążźśźćęńłóĄŻŹŚŹĘĆŃÓŁ]?$/, className: "input capitalize", length: 30, minLength: 3, required: false, breakLine: true},
    {id: "mail", type: "mail", name: "E-mail", description: "Adres e-mail: ", className: "input", length: 40},
    {id: "phoneNr", type: "number", name: "Numer telefonu", description: "Numer telefonu: ", className: "input", length: 9, minLength: 9, required: true, breakLine: true},
    {id: "age", type: "number", name: "Wiek", className: "input", breakLine: false, length: 3, minLength: 1, regexp: /^[1-9]+[0-9]?$/, description: "Wiek: "},
    {id: "sex", type: "select", name: "Płeć", description: "Płeć: ", list: ["Mężczyzna", "Kobieta"], className: "input", breakLine: true},
    {id: "login", type: "text", name: "Login", description: "Login: ", length: 20, className: "input"},
    {id: "password", type: "password", name: "haslo", description: "Hasło: ", length: 30, className: "input", breakLine:true},
    {id: "comment", type: "textarea", name: "komentarz", description: "Komentarz: ", length: 15, className: "input", breakLine: true},
    {id: "acceptRules", type: "checkbox", description: "Zapoznałem się z regulaminem i akceptuję jego załozenia "}
];

var button = {
    className: "button",
    action: "post",
    url: "http://lets-deliver.pl/dev_001/UAT/tester.php",
    dataType: "text",
    success: function(data) { $("#response").html(data) }
};

$("#form").formGenerator("test", input, button, true);
```

- First argument for `formGenerator` is `id` of the form - *REQUIRED*
- `input` - array of objects. Each object describe one field. Below possible elements for object:
     *  `id`: *REQUIRED*. Will be used to create field id attribute
     *  `type`: text by default, possible types
    - `text` - standard html text input,
    - `number` - improved standard html number input. Base on text type
    - `checkbox`
    - `select`
    - `mail`
    - `password`
    - `postalcode` - for Poland - NOT AVAILABLE YET
    - `hidden`
    - `title` - title for sector - NOT AVAILABLE YET
    - `phonenr` - NOT AVAILABLE YET
    - `textarea` - textarea with counter
     *   `name`: This value will be visible as placeholder,
     *   `description`: short description before input,
     *   `regexp`: validation based on regular expression,
     *   `className`: CSS class,
     *   `labelClassName`: CSS class for label
     *   `length`: field length,
     *   `minLength`: field minimum length,
     *   `breakLine`: false by default, set true if you want insert breakLine line after field,
     *   `uppercase`: false by default, set true if you want to change value to uppercase - NOT AVAILABLE YET
     *   `lowercase`: false by default, set true if you want to change value to lowercase - NOT AVAILABLE YET
     *   `required`: false by default, set true if you want to force fill this field before send form
- `button` - object similar to normal `$.ajax` jQuery Object. If not defined, buttons will be not shown.
- Agreement for insert author note. `Boolean`, true or false. false by default.


### Version
1.0.2

### MIT License
I provide this plugin for free without restriction. Just please keep author note as comment in plugin file (^^,)

