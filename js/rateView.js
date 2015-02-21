/*jslint node: true, browser: true */
"use strict";

function rateView() {

    var menu = document.getElementById("menu");

    var mainDisplay = document.getElementById("mainDisplay"),
        secDisplay = document.getElementById("secDisplay");

    this.updateMainDisplay = function(value) {
        mainDisplay.innerHTML = value;
    }

    this.updateSecDisplay = function(value) {
            secDisplay.innerHTML = value;
    }

    this.showMenu = function() {
        menu.className = " menu-visible";
    }

    this.hideMenu = function() {
        menu.className = "";
    }

    this.showMenuContent = function(content) {

        content.className += " content-visible";
    }

    this.hideMenuContent = function(content) {
        content.className = "content";
    }

    this.hideAllMenus = function(){
        var contents = document.getElementsByClassName("content");

        for (var i = 0; i < contents.length; i++) {
            contents[i].className = "content";
        }
    }

    this.updateToCurs = function(string){
        var menuItems = document.getElementsByClassName("menu-item");
        var content = menuItems[1].getElementsByClassName("content")[0];

        content.innerHTML = string;
    }

    this.updateFromCurs = function(string){
        var menuItems = document.getElementsByClassName("menu-item");
        var content = menuItems[0].getElementsByClassName("content")[0];

        content.innerHTML = string;
    }
}