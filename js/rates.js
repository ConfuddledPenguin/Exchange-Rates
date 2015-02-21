/*jslint node: true, browser: true */
"use strict";

function rates(controller) {

    var date,
        ratesMap = {}, // a map, isn't JS wonderful.
        updateTime;

    if (localStorage.getItem("com.tom-maxwell.rates.curs")) {
        var ratesMapString = localStorage.getItem("com.tom-maxwell.rates.curs");
        ratesMap = JSON.parse(ratesMapString);
    }

    if (localStorage.getItem("com.tom-maxwell.rates.updateTime")) {
        var updateTimeString = localStorage.getItem("com.tom-maxwell.rates.updateTime");
        updateTime = parseFloat(updateTimeString);
    } else {
        updateTime = 0;
    }

    this.getAvailableCurrencies = function() {

        var returnVals = new Array();

        for (var key in ratesMap) {
            returnVals.push(key);
        }

        return returnVals;
    }

    this.getRate = function(currency){
        return ratesMap[currency];
    }

    function getXmlHttpRequestObject() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else if(window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            alert("Your Browser Sucks!\nIt's about time to upgrade don't you think?");
        }
    }


    if(updateTime + (24*60*60*1000) < Date.now()){

        console.log("update");

        //Our XmlHttpRequest object to get the auto suggest
        var ajax = getXmlHttpRequestObject();

        ajax.onreadystatechange=function(){
            if(ajax.readyState==4 && ajax.status==200){

                updateTime = Date.now();
                if(localStorage){
                    localStorage.setItem("com.tom-maxwell.rates.updateTime", updateTime);
                }

                var XMLDoc = ajax.responseXML;
                var rootCube = XMLDoc.getElementsByTagName("Cube")[0];
                var time = rootCube.getElementsByTagName("Cube")[0];
                date = time.getAttribute("time");
                var cubes = time.getElementsByTagName("Cube");

                ratesMap = {};

                for(var i = 0; i < cubes.length; i++){
                    var exchange = cubes[i];
                    var cur = exchange.getAttribute("currency");
                    var rate = exchange.getAttribute("rate");


                    ratesMap[cur] = parseFloat(rate);
                }

                var ratesMapJSON = JSON.stringify(ratesMap);
                localStorage.setItem("com.tom-maxwell.rates.curs", ratesMapJSON);

                controller.displayFromCurrencies();
                controller.displayToCurrencies();
            }
        }

        ajax.open("GET", "https://devweb2014.cis.strath.ac.uk/~aes02112/ecbxml.php", 
                    true);
        ajax.send();

    }
}