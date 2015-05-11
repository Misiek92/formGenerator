/*
 * jQuery plugin
 * Copyright (c) 2015 Mateusz Kuźnik
 *
 * *************************************************************************
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 *  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 *  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 * *************************************************************************
 *
 */

(function ($) {
    "use strict";
    /*
     * @param {type} id - value for form id attribute. *REQUIRED*
     * @param {type} input - array of objects. Each object describe one field. Below possible elements for object:
     *  - id: *REQUIRED*. Will be used to create field id attribute
     *  - type: text by default, possible types
     *      # text - standard html text input,
     *      # number - improved standard html number input. Base on text type
     *      # checkbox
     *      # select
     *      # mail
     *      # password
     *      # postalcode - for Poland - NOT AVAILABLE YET
     *      # hidden
     *      # title - title for sector - NOT AVAILABLE YET
     *      # phonenr - NOT AVAILABLE YET
     *      # textarea - textarea with counter
     *  - name: This value will be visible as placeholder,
     *  - description: short description before input,
     *  - regexp: validation based on regular expression,
     *  - className: CSS class,
     *  - labelClassName: CSS class for label
     *  - length: field length,
     *  - minLength: field minimum length,
     *  - breakLine: false by default, set true if you want insert breakLine line after field,
     *  - uppercase: false by default, set true if you want to change value to uppercase - NOT AVAILABLE YET
     *  - lowercase: false by default, set true if you want to change value to lowercase - NOT AVAILABLE YET
     *  - required: false by default, set true if you want to force fill this field before send form
     *
     *
     * *** EXAMPLE OF OBJECT ***
     * {id: "test", type: "text", name: "Imie", description: "Jakis opis", regexp: "\d", class: "input", length: 10, breakLine: true, uppercase: true},
     * *** END ***
     *
     * @returns html form with validation
     */
    $.fn.formGenerator = function (id, input, button, authorInfo) {


        var form = $("<form>").attr({
                id: id
            }),
            possibleToSend = function () {
                if ($("[valid='false']").length > 0) {
                    $("#send_" + id).addClass("button-inactive");
                    $("#send_" + id).attr("active", "false");
                } else {
                    $("#send_" + id).removeClass("button-inactive");
                    $("#send_" + id).attr("active", "true");
                }
            },
            clearForm = function () {
                $("[formGenerator]").each(function () {
                    $(this).val("");
                });
                /*                $("textarea").each(function () {
                                    $(this).val("");
                                });*/
            },
            setValid = function () {
                $("[required]").each(function () { // exception for default values
                    if ($(this).val().length < $(this).attr("minlength") || $(this).val().length === 0) {
                        $(this).attr("valid", "false");
                    } else {
                        $(this).attr("valid", "true");
                    }
                });
            };

        $.each(input, function (undefined, val) {

            if (typeof val.id !== "undefined") { // input must have id
                /*
                 * List of variables
                 */
                var fieldId = val.id.toLowerCase(),
                    fieldType = "text",
                    fieldPlaceholder = val.name,
                    fieldDescription = val.description,
                    fieldLength = val.length,
                    fieldMinLength = val.minLength,
                    fieldClass = val.className,
                    field,
                    ctrlDown = false,
                    ctrlKey = 17,
                    vKey = 86,
                    cKey = 67,
                    label,
                    mailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    smallLetterRegExp = /[a-z]/,
                    bigLetterRegExp = /[A-Z]/,
                    diacriticRegExp = /\d/,
                    specialCharRegExp = /\W/,
                    lengthFlag = true,
                    r = val.regexp,
                    wrapper,
                    additional,
                    required,
                    inlineClass = "fg-inline";
                if (typeof val.type !== "undefined" && val.type !== "number" && val.type !== "mail") {
                    fieldType = val.type.toLowerCase();
                }
                //end

                /*
                 * Create wrapper for elements around field + field
                 */

                if (fieldType === "title") {
                    inlineClass = "";
                }
                wrapper = $("<div>")
                    .attr({
                        id: "cell_" + fieldId
                    }).addClass(inlineClass);

                additional = $("<p>")
                    .attr({
                        id: "additional_" + fieldId
                    })
                    .addClass("fg-additional")
                    .html(" ");
                required = $("<span>")
                    .attr({
                        id: "req" + fieldId
                    }).addClass("fg-required")
                    .html("*");

                /*
                 * create input field
                 */
                if (fieldType !== "select" && fieldType !== "textarea" && fieldType !== "title") {
                    field = $("<input>")
                        .attr({
                            id: fieldId,
                            type: fieldType,
                            basetype: val.type,
                            placeholder: fieldPlaceholder,
                            maxlength: fieldLength,
                            minlength: fieldMinLength,
                            required: val.required === true ? true : false,
                            formGenerator: ""
                        })
                        .addClass(fieldClass);

                    /*
                     * Length validation
                     */
                    if (typeof fieldMinLength !== "undefined") {
                        field.keyup(function () {
                            console.log('length validation');
                            var actualField = $(this).val(),
                                actualLength = actualField.length,
                                notify;
                            $("#additional_" + val.id).removeClass();
                            $("#additional_" + val.id).addClass("fg-additional");
                            if (actualLength < fieldMinLength) {
                                lengthFlag = false;
                                if ($(this).prop("required")) {
                                    $(this).attr("valid", "false");
                                }
                                notify = "Value too short! (Min. " + fieldMinLength + " characters)";
                                $("#additional_" + val.id).html(notify);
                                $(this).addClass("fg-error-input");
                            } else {
                                lengthFlag = true;
                                notify = "";
                                $("#additional_" + val.id).html(notify);
                                if ($(this).prop("required")) {
                                    $(this).attr("valid", "true");
                                }
                                $(this).removeClass("fg-error-input");
                            }

                        });
                    }

                    /*
                     * Number type based on text
                     */
                    if (val.type === "number") {

                        /*
                         * Support for ctrl + c & ctrl + v
                         */

                        $(document).keydown(function (e) {
                            if (e.keyCode === ctrlKey) {
                                ctrlDown = true;
                            }
                        }).keyup(function (e) {
                            if (e.keyCode === ctrlKey) {
                                ctrlDown = false;
                            }
                        });
                        /*
                         * Actually i didn't find better solution for paste feature
                         */
                        field.on('paste', function (e) {
                            /*
                             * (^\d*\d+$|^\d+(\.|\,)?\d+$)
                             * Regexp supports patterns like
                             * 1234 OR 1.2 OR 1,2
                             */
                            var pattern = /(^\d*\d*$|^\d+(\.|\,)?\d+$)/,
                                element = this, // "paste" element
                                before = $(element).val();
                            setTimeout(function () {
                                var text = $(element).val();
                                console.log(text);
                                if (pattern.test(text)) {
                                    console.log('pasted!');
                                } else {
                                    console.log(text + " doesn't match");
                                    e.preventDefault();
                                    $(element).val(before);
                                }
                            }, 10);
                        });
                        // end


                        /*
                         * possible only numeric keys, and some exceptions :)
                         */
                        field.keydown(function (e) {
                            //var l = $(this).prop("maxlength");
                            var key = e.keyCode;
                            if ((key !== 8 &&
                                    key !== 9 &&
                                    key !== 13 &&
                                    key !== 46 &&
                                    key !== 110 &&
                                    key !== 190 &&
                                    key !== 188 &&
                                    key !== 17 &&
                                    !(key >= 35 && key <= 40) &&
                                    !(key >= 48 && key <= 57) &&
                                    !(key >= 96 && key <= 105)) || e.shiftKey) {
                                if (ctrlDown && (key === vKey || key === cKey)) {
                                    // do nothing/
                                    console.log('copy / paste detected');
                                } else {
                                    e.preventDefault();
                                }
                            }
                        });
                    } // END exception for number

                    /*
                     * Regular Expression validation
                     */
                    if (typeof val.regexp !== "undefined" || val.type === "mail") {
                        field.keyup(function () {
                            if (lengthFlag) {
                                if (typeof r !== "undefined" && r !== null) {
                                    if (r.test($(this).val())) {
                                        console.log($(this).id + " - regexp valid");
                                        $(this).removeClass("fg-error-input");
                                        console.log(this.id);
                                        $("#additional_" + val.id).html("Correct!");
                                        if ($(this).prop("required")) {
                                            $(this).attr("valid", "true");
                                            setValid(); // REQUIRED attribute have the biggest priority
                                        }
                                        $("#additional_" + val.id).addClass("fg-green");
                                    } else {
                                        console.log($(this).id + " - regexp don't valid");
                                        $(this).addClass("fg-error-input");
                                        $("#additional_" + val.id).html("Wrong input");
                                        if ($(this).prop("required")) {
                                            $(this).attr("valid", "false");
                                        }
                                        $("#additional_" + val.id).removeClass("fg-green");
                                    }
                                }
                                // mail validation
                                if ($(this).attr("basetype") === "mail") {
                                    if (mailRegExp.test($(this).val())) {
                                        console.log($(this).attr("id") + " - mail valid");
                                        $(this).removeClass("fg-error-input");
                                        $("#additional_" + val.id).html("Correct!");
                                        if ($(this).prop("required")) {
                                            $(this).attr("valid", "true");
                                        }
                                        $("#additional_" + val.id).addClass("fg-green");
                                    } else {
                                        console.log($(this).attr("id") + " - value is not an mail address");
                                        $(this).addClass("fg-error-input");
                                        $("#additional_" + val.id).html("This is not an e-mail");
                                        if ($(this).prop("required")) {
                                            $(this).attr("valid", "false");
                                        }
                                        $("#additional_" + val.id).removeClass("fg-green");
                                    }
                                }
                            }
                        });
                    }

                    /*
                     * Old Password check
                     */
                    /*
                     if (val.type === "password") {
                        field.keyup(function () {
                            if (lengthFlag) {
                                var balance = 0,
                                    password = $(this).val(),
                                    notify = "Weak",
                                    notifyClass = "";
                                $("#additional_" + val.id).removeClass();
                                $("#additional_" + val.id).addClass("fg-additional");
                                if (smallLetterRegExp.test(password)) {
                                    balance++;
                                }
                                if (bigLetterRegExp.test(password)) {
                                    balance+3;
                                }
                                if (specialCharRegExp.test(password)) {
                                    balance+4;
                                }
                                if (diacriticRegExp.test(password)) {
                                    ++balance;
                                }

                                if (balance <= 1) {
                                    notify = "Weak";
                                    notifyClass = "fg-red";
                                } else if (balance === 2) {
                                    notify = "Average";
                                    notifyClass = "fg-orange";
                                } else if (balance === 3) {
                                    notify = "Strong";
                                    notifyClass = "fg-yellow";
                                } else if (balance === 4) {
                                    notify = "Very Strong";
                                    notifyClass = "fg-green";
                                }

                                $("#additional_" + val.id).html(notify).addClass(notifyClass);
                            }
                        });
                    }    */
                    /*
                     * Password validation with power measurement
                     */
                    if (fieldType === "password") {
                        var requiredPower = (typeof val.power !== "undefined" ? val.power : 15); // value 14 is equal to 8 char length password with small letters + number
                        field.keyup(function () {
                            if (lengthFlag) {
                                var balance = 0,
                                    weight = 0,
                                    password = $(this).val(),
                                    pwLength = password.length,
                                    notifyClass = "",
                                    smallLetter = password.match(smallLetterRegExp),
                                    bigLetter = password.match(bigLetterRegExp),
                                    diacritic = password.match(diacriticRegExp),
                                    special = password.match(specialCharRegExp);
                                /*  countSmallLetter,
                                    countBigLetter,
                                    countDiacritic,
                                    countSpecial; */


                                if (smallLetter !== null) {
                                    //    countSmallLetter = smallLetter.length;
                                    weight += 26;
                                }
                                if (bigLetter !== null) {
                                    //    countBigLetter = bigLetter.length;
                                    weight += 26;
                                }
                                if (diacritic !== null) {
                                    //   countDiacritic = diacritic.length;
                                    weight += 10;
                                }
                                if (special !== null) {
                                    //    countSpecial = special.length;
                                    weight += 32;
                                }
                                $("#additional_" + val.id).removeClass();
                                $("#additional_" + val.id).addClass("fg-additional");
                                if ($(this).prop("required")) {
                                    $(this).attr("valid", "false");
                                }


                                weight = weight / 5;
                                console.log(weight);
                                balance = Math.floor(Math.log(Math.pow(weight, pwLength))); // measure power algorythm.
                                if (balance >= requiredPower) {
                                    notifyClass = "fg-green";
                                    if ($(this).prop("required")) {
                                        $(this).attr("valid", "true");
                                    }
                                }
                                $("#additional_" + val.id).html("Power: " + balance + " (min. " + requiredPower + ", recommended: 20)").addClass(notifyClass);
                            }
                        });
                        additional.html("Power: 0 (min. " + requiredPower + ", recommended: 20)");
                    }

                    /*
                     * Create Select field
                     */
                } else if (fieldType === "select") { // Create select object
                    if (typeof val.list !== "undefined" && val.list[0]) {
                        field = $("<select>")
                            .attr({
                                id: fieldId,
                                formGenerator: ""
                            })
                            .addClass(fieldClass);


                        $.each(val.list, function (undefined, value) {
                            var option = $("<option>");
                            option.html(value);
                            $(field).append(option);
                        });
                    }
                    /*
                     * Create textarea
                     */
                } else if (fieldType === "textarea") {
                    field = $("<textarea>")
                        .attr({
                            id: fieldId,
                            maxlength: fieldLength,
                            formGenerator: ""
                        })
                        .addClass(fieldClass)
                        .keyup(function () {
                            if (fieldLength) {
                                var actualLength = $(this).val().length;
                                $("#additional_" + fieldId).html("Characters " + actualLength + "/" + fieldLength).addClass("fg-green");
                            }
                        });
                    if (fieldLength) {
                        additional.html("Characters 0/" + fieldLength).addClass("fg-green");
                    }
                    /*
                     * Create title
                     */
                } else if (fieldType === "title") {
                    field = $("<h2>")
                        .attr({
                            id: fieldId
                        })
                        .addClass(fieldClass)
                        .html(fieldPlaceholder);
                }

                /*
                 * create label if necessarily
                 */
                label = $("<label>")
                    .attr({
                        id: "label_" + fieldId,
                        for: fieldId
                    }).html(fieldDescription)
                    .addClass(val.labelClassName);
                /*
                 * append elements to form
                 */
                if (typeof val.required !== "undefined" && val.required === true) {
                    $(wrapper).append(required);
                }
                if (fieldType !== "title") {
                    $(wrapper).append(label);
                }

                $(wrapper).append(field);

                /*
                 * Show password
                 */
                if (fieldType === "password") {
                    var toggleShow = $("<input>")
                        .attr({
                            id: "toggle_" + val.id,
                            type: "checkbox",
                            title: "show password"
                        })
                        .addClass("fg-inline")
                        .change(
                            function () {
                                if ($(this).is(':checked')) {
                                    $("#" + fieldId).attr({
                                        type: "text"
                                    });
                                } else {
                                    $("#" + fieldId).attr({
                                        type: "password"
                                    });
                                }
                            }
                        );
                    $(wrapper).append(toggleShow);
                }
                if (fieldType !== "title") {
                    $(wrapper).append(additional);
                }
                $(form).append(wrapper);
                if ((typeof val.breakLine !== "undefined" && val.breakLine === true) || fieldType === "title") // if val.breakLine
                    $(form).append($("<br>"));

                // set default values
                if (typeof val.value !== "undefined")
                    $(field).val(val.value);
            }

        });

        /*
         * create Buttons
         */
        if (typeof button !== "undefined") {
            /*
             * Clear button
             */
            var clear = $("<button>")
                .attr({
                    id: "clear_" + id
                })
                .addClass(button.className + " fg-inline")
                .html("Clear")
                .click(function (e) {
                    e.preventDefault();
                    if (confirm("Do you really want clear form?")) {
                        //clear
                        clearForm();
                    }
                });

            /*
             * Send button
             */
            var submit = $("<button>")
                .attr({
                    id: "send_" + id
                })
                .addClass(button.className + " fg-inline")
                .html("Send")
                .click(function (e) {
                    e.preventDefault();
                    if ($(this).attr("active") === "true") {
                        if (confirm("Do you really want send form?")) {
                            if (typeof button.action !== "undefined") { // do sth
                                if (button.action === "post" && typeof button.url !== "undefined" && typeof button.success !== "undefined" && typeof button.dataType !== "undefined") {
                                    var postData = {};
                                    $("[formGenerator]").each(function () {
                                        if ($(this).attr("type") !== "checkbox") {
                                            postData[$(this).attr("id")] = $(this).val();
                                        } else {
                                            postData[$(this).attr("id")] = $(this).is(':checked');
                                        }
                                    });
                                    /*                              $("select").each(function () {
                                                                      postData[$(this).attr("id")] = $(this).val();
                                                                  });
                                                                  $("textarea").each(function () {
                                                                      postData[$(this).attr("id")] = $(this).val();
                                                                  });*/
                                    $.post(button.url, postData, button.success, button.dataType);

                                } else {
                                    alert("Error before sending form");
                                    console.log("Nothing was send because you didn't provide correct data in button object");
                                }
                                clearForm();
                                setValid();
                                possibleToSend();
                            }

                        }
                    }
                }),
                author = $("<div>")
                .attr({
                    id: "formGenerator_author"
                })
                .addClass("fg-author")
                .html("Form generated by formGenerator - jQuery plugin. <a href='https://github.com/Misiek92/formGenerator' target='_blank'>GitHub</a>");

            $(form).append($("<br>"));
            $(form).append(clear);
            $(form).append(submit);

            if (typeof authorInfo !== "undefined" && authorInfo === true) {
                $(form).append(author);

            }


        }

        $(this).html(form); // insert generated form object to HTML element
        setValid();
        /*
         * block button on load
         */
        possibleToSend();
        /*
         * block button during changes on inputs
         */
        $("input").on("keyup", function () {
            possibleToSend();
        });
    };
})(jQuery);
