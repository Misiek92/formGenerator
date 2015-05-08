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
    /*
     * 
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
     *      # postalcode - for Poland
     *      # hidden
     *      # title - title for sectors
     *  - name: This value will be visible as placeholder,
     *  - description: short description before input,
     *  - regexp: validation based on regular expression,
     *  - class: CSS class,
     *  - length: field length,
     *  - break: false by default, set true if you want insert break line after field,
     *  - uppercase: false by default, set true if you want to change value to uppercase
     *  - lowercase: false by default, set true if you want to change value to lowercase,
     *      
     *      
     * *** EXAMPLE OF OBJECT ***
     * {id: "test", type: "text", name: "Imie", description: "Jakis opis", regexp: "\d", class: "input", length: 10, break: true, uppercase: true},
     * *** END ***
     * 
     * @returns html form with validation
     */
    $.fn.formGenerator = function (id, input) {

        var form = $("<form>").attr({id: id});

        $.each(input, function (i, val) {

            if (typeof val.id !== "undefined") { // input must have id
                /*
                 * List of variables
                 */
                var fieldId = val.id;
                var fieldType;
                var fieldPlaceholder = val.name;
                var fieldDescription = val.description;
                var fieldLength = val.length;
                typeof val.type !== "undefined" && val.type !== "number" ? fieldType = val.type : fieldType = "text";
                var fieldClass = val.class;
                //end

                /*
                 * create input field
                 */
                if (fieldType !== "select") {
                    var field = $("<input>")
                            .attr({
                                id: fieldId,
                                type: fieldType,
                                basetype: val.type,
                                placeholder: fieldPlaceholder,
                                maxlength: fieldLength
                            })
                            .addClass(val.class);

                    /*
                     * Number type based on text
                     */
                    if (val.type === "number") {
                        /*
                         * Support for ctrl + c & ctrl + v
                         */
                        var ctrlDown = false;
                        var ctrlKey = 17, vKey = 86, cKey = 67;
                        $(document).keydown(function (e)
                        {
                            if (e.keyCode === ctrlKey)
                                ctrlDown = true;
                        }).keyup(function (e)
                        {
                            if (e.keyCode === ctrlKey)
                                ctrlDown = false;
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
                            var pattern = /(^\d*\d*$|^\d+(\.|\,)?\d+$)/;
                            var element = this; // "paste" element
                            var before = $(element).val();
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
                                    // do nothing
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
                    var mailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    var r = val.regexp;
                    if (typeof val.regexp !== "undefined" || val.type === "mail") {
                        field.keyup(function () {
                            if (typeof r !== "undefined" && r !== null) {
                                if (r.test($(this).val())) {
                                    console.log($(this).id + " - regexp valid");
                                    $(this).removeClass("fg-error-input");
                                } else {
                                    console.log($(this).id + " - regexp don't valid");
                                    $(this).addClass("fg-error-input");
                                }
                            }
                            // mail validation
                            if ($(this).attr("basetype") === "mail") {
                                if (mailRegExp.test($(this).val())) {
                                    console.log($(this).attr("id") + " - mail valid");
                                    $(this).removeClass("fg-error-input");
                                } else {
                                    console.log($(this).attr("id") + " - value is not an mail address");
                                    $(this).addClass("fg-error-input");
                                }
                            }
                        });

                    }
                } else { // Create select object
                    if (typeof val.list !== "undefined" && val.list[0]) {
                        var field = $("<select>")
                                .attr({
                                    id: fieldId
                                })
                                .addClass(val.class);
                        ;

                        $.each(val.list, function (i, value) {
                            var option = $("<option>");
                            option.html(value);
                            $(field).append(option);
                        });
                    }
                }

                /*
                 * create label if necessarily
                 */
                var label = $("<label>")
                        .attr({
                            id: "label_" + fieldId,
                            for : fieldId
                        }).html(fieldDescription);
                /*
                 * append elements to form
                 */
                $(form).append(label);
                $(form).append(field);
                if (typeof val.break !== "undefined" && val.break === true) // if val.break
                    $(form).append($("<br>"));
                
                // set default values
                if (typeof val.value !== "undefined")
                    $(field).val(val.value);
            }

        });


        $(this).html(form); // insert generated form object to HTML element
    };
})(jQuery);
