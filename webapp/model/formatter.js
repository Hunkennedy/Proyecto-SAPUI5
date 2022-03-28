sap.ui.define([

], 
    
    function () {
        "use strict";

        return {
            formatearEstadoServidor: function (ServerStatus) {
                let vHighlight = '';
                switch (ServerStatus) {
                    case "SERVER CLEAN":
                        vHighlight = "Success" 
                        
                        break;
                    case "SERVER WITH REPORTS":
                        vHighlight = "Information" 
                        break;
                    case "SERVER DOWN":
                        vHighlight = "Error" 
                        break;
                    case "GOOD":
                        vHighlight = "Success" 
                        break;
                    case "BANNED":
                        vHighlight = "Error"
                        break;
                    default:
                        break;
                }
                return vHighlight;
            }
        }
    }
);