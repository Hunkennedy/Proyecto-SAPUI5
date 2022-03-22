sap.ui.define([

], 
    
    function () {
        "use strict";

        return function (ServerRegion) {
                let vNumberRegion = 0;
                switch (ServerRegion) {
                    case 'EU WEST': vNumberRegion = '0'; break;
                    case 'EU EAST': vNumberRegion = '1'; break;
                    case 'LATAM NORTH': vNumberRegion = '2'; break;
                    case 'LATAM SOUTH': vNumberRegion = '3'; break;
                    case 'NORTH AMERICA WEST': vNumberRegion = '4'; break;
                    case 'NORTH AMERICA EAST': vNumberRegion = '5'; break;
                    case 'V.I.P.': vNumberRegion = '1'; break;
                    case 'Normal': vNumberRegion = '0'; break;
                }

                return vNumberRegion
            }
        
    }
);