/*jslint node: true, browser: true */
"use strict";

function rateModel(controller) {

    var userValue = -1,
        userCurrency = "GBP",
        exchangedValue = -1,
        exchangedCurrency = "EUR",
        exchanged = false,
        cut = 2,
        cutMultiplier = 1,
        cutEnabled = false;

    var rate = {};

    if(localStorage.getItem("com.tom-maxwell.rates.exchangedCurrency")){
        exchangedCurrency = localStorage.getItem("com.tom-maxwell.rates.exchangedCurrency");
    }


    if(localStorage.getItem("com.tom-maxwell.rates.userCurrency")){
        userCurrency = localStorage.getItem("com.tom-maxwell.rates.userCurrency");
    }

    if(localStorage.getItem("com.tom-maxwell.rates.cut")){
        userCurrency = parseInt(localStorage.getItem("com.tom-maxwell.rates.cut"));
        cutMultiplier = (100 - cut) / 100;
    }

    this.refreshRates = function() {

        rate = new rates(controller);

        controller.displayToCurrencies();
        controller.displayFromCurrencies();
    };

    this.convert = function() {

        if (userValue === -1) {
            return;
        }

        if (userCurrency === "EUR") {
            exchangedValue = userValue * rate.getRate(exchangedCurrency);
        } else if (exchangedCurrency === "EUR") {
            exchangedValue = userValue / rate.getRate(userCurrency);
        } else {
            exchangedValue = (userValue / rate.getRate(userCurrency)) * rate.getRate(exchangedCurrency);
        }

        exchanged = true;

        exchangedValue = exchangedValue * cutMultiplier;

        var multiplier = Math.pow(10, 2);
        exchangedValue = Math.round(exchangedValue * multiplier) / multiplier;
    };

    this.addToUserValue = function(int) {

        if (userValue === -1) {
            userValue = int;
        } else {
            userValue += int;
        }

        userValue = parseInt(userValue);
    };

    this.getUserValue = function() {

        if (userValue === -1) {
            return 0;
        } else {
            return userValue;
        }
    };

    this.getUserCurrency = function() {
        
        return userCurrency;
    };

    this.setUserCurrency = function(currency) {
        
        userCurrency = currency;

        if ( localStorage ) {
            localStorage.setItem("com.tom-maxwell.rates.userCurrency", userCurrency);
        }
    };

    this.setCut = function(cutpercentage) {
        
        cut = cutpercentage;
        cutMultiplier = (100 - cut) / 100;

        if(localStorage){
           localStorage.setItem("com.tom-maxwell.rates.cut", cut);
        }
    };

    this.toggleCut = function(){
        
        if (cutEnabled) {
            cutEnabled = false;
            cutMultiplier = 1;
        } else {
            cutEnabled = true;
            cutMultiplier = (100 - cut) / 100;
        }
    }

    this.getCut = function() {
        
        return cut;
    };

    this.getExchangedValue = function() {
        return exchangedValue;
    };

    this.getExchangedCurrency = function() {
        return exchangedCurrency;
    };

    this.setExchangedCurrency = function(currency) {
        exchangedCurrency = currency;

        if ( localStorage ) {
            localStorage.setItem("com.tom-maxwell.rates.exchangedCurrency", exchangedCurrency);
        }
    };

    this.getAvailableCurrencies = function() {
        var rates = new Array();
        rates[0] = "EUR";
        var temp = rates.concat(rate.getAvailableCurrencies());

        return temp;
    };

    this.clearUserValue = function() {
        userValue = -1;
        exchangedValue = -1;
        exchanged = false;
    };

    this.exchanged = function() {
        return exchanged;
    };
}