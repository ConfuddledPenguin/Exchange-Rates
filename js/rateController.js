/*jslint node: true, browser: true */
"use strict";

function controller() {

    var menu = document.getElementsByClassName("menu-icon")[0];

    var model = {};
    var view = {};
    var menuOut = false;
    var exchanged = false;

    /* numberButton
     *
     * A handy we function to represent the buttons on the screen which have
     * numbers attached to them.
     */
    function numberButton(controller, button) {

        var value = button.firstChild.nodeValue;

        button.addEventListener("click", function() {
                model.addToUserValue(value);
                if (model.exchanged()) {
                    model.convert();
                }
                controller.updateDisplay();
            });
    }

    function menuContent(menuItem, content) {

        var visible = false;

        menuItem.addEventListener("click", function(){
            if (visible) {
                visible = false;
                view.hideMenuContent(content);
            } else {
                visible = true;
                view.hideAllMenus();
                view.showMenuContent(content);
            }
        });
    }

    function currencyOption(cur, call, controller, model, view, content){

        var value = cur.firstChild.firstChild.nodeValue;

        cur.addEventListener("click", function(){

            call(value);
            model.convert();
            controller.updateDisplay();
            controller.menuSwitch();
            view.hideMenuContent(content);
        });
    }

    this.updateDisplay = function() {

        var html = "<p>" + model.getUserValue() + "<span>" + model.getUserCurrency() + "</span></p>";

        if (model.exchanged()) {
            view.updateSecDisplay(html);
            html = "<p>" + model.getExchangedValue() + "<span>" + model.getExchangedCurrency() + "</span></p>";
            view.updateMainDisplay(html);
        }

        if (!model.exchanged()) {
            view.updateSecDisplay("<p></p>");
            view.updateMainDisplay(html);
        }
    };

    this.menuSwitch = function() {
        if (!menuOut) {
            view.showMenu();
            menuOut = true;
        } else {
            view.hideMenu();
            menuOut = false;
        }
    };

    this.displayToCurrencies = function(){

        var availableCur = model.getAvailableCurrencies();
        var html = "";

        for (var i = 0; i < availableCur.length; i++) {

            html += '<div class="currency to"><span>' + availableCur[i] + "</span></div>";
        }

        view.updateToCurs(html);

        //now that its part of the dom
        //we can add listeners

        var curs = document.getElementsByClassName("to");
        var content = document.getElementsByClassName("content")[1];

        for (var i = 0; i < curs.length; i++) {
            new currencyOption(curs[i], model.setExchangedCurrency, this, model, view, content);
        };
    };

    this.displayFromCurrencies = function(){
     
        var availableCur = model.getAvailableCurrencies();
        var html = "<div>";

        for (var i = 0; i < availableCur.length; i++) {

            html += '<div class="currency from"><span>' + availableCur[i] + "</span></div>";
        }

        html += "</div>";

        view.updateFromCurs(html);

        //now that its part of the dom
        //we can add listeners

        var curs = document.getElementsByClassName("from");
        var content = document.getElementsByClassName("content")[0];

        for (var i = 0; i < curs.length; i++) {
            new currencyOption(curs[i], model.setUserCurrency, this, model, view, content);
        };
    };

    this.init = function() {

        model = new rateModel(this);
        view = new rateView();
        var controller = this; //needed for the anon functions...WOOO JS....

        model.refreshRates();
        this.updateDisplay();

        //menu
        menu.addEventListener("click", this.menuSwitch);

        //numbers
        var numbers = document.getElementsByClassName("number");

        for (var i = 0; i < numbers.length; i++) {
            var value = numbers[i].firstChild.nodeValue;
            new numberButton(this, numbers[i]);
        }

        //clear
        var clearButton = document.getElementsByClassName("clear")[0];
        clearButton.addEventListener("click", function(){
            model.clearUserValue();
            controller.updateDisplay();
        });

        //equals
        var equalsButton = document.getElementsByClassName("equals")[0];
        equalsButton.addEventListener("click", function(){
            model.convert();
            controller.updateDisplay();
        });

        //menuitems
        var menuItems = document.getElementsByClassName("menu-item");

        for (var i = 0; i < menuItems.length; i++) {
            var label = menuItems[i].getElementsByClassName("menu-label")[0];
            var content = menuItems[i].getElementsByClassName("content")[0];
            new menuContent(label, content);
        }

        var cutEnabled = document.getElementById("slide");
        cutEnabled.addEventListener("click", function(){
            model.toggleCut();
        });
    }

    this.init();
};


window.addEventListener("load", new controller());