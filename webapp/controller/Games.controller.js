sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "academia2022/zluuc3games/model/formatter",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, MessageBox, Fragment) {
        "use strict";

        return Controller.extend("academia2022.zluuc3games.controller.Games", {
            formatter: formatter,
            onInit: function () {

            },

            _getServers: function () {
                var oModel = this.getView().getModel();

                oModel.read('/GameServerSet', {
                    success: function (oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId('idServersTable').setModel(oModelLocalJson, "ModeloLocalServidores");
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con sap');
                    }.bind(this)
                });
            },

            onVisualizarUsuarios: function (oEvent) {


                this.getOwnerComponent()
                    .getRouter()
                    .navTo("users", {
                        ServerId: oEvent.getSource().getBindingContext().getProperty("ServerId"),
                        Region: oEvent.getSource().getBindingContext().getProperty("Region")
                    })

            },

            



        });
    });
