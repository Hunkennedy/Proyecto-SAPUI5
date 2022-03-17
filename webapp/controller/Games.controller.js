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

            onFragmentCreateServer: function (oEvent) {
                console.log("Hello World!")
                if (!this._valueHelpCreateServer) {
                    this._valueHelpCreateServer = sap.ui.xmlfragment("frgCreateServer",
                        "academia2022.zluuc3games.view.CreateServer",
                        this)
                    this.getView().addDependent(this._valueHelpCreateServer)
                }
                this._valueHelpCreateServer.open()

                
            },

            onCreateServer: function(oEvent) {
                let sendData = {}
                let region = oEvent.getParameters().selectedItem.getBindingContext().getProperty("DescEstadoSer")
                let oModel = this.getView().getModel();

                MessageBox.confirm(`Seguro que quieres crear el servidor en ${region}?`, {
                    title: "Atencion!",
                    initialFocus : sap.m.MessageBox.Action.CANCEL,
                    onClose : function(sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            
                            
                            switch (region) {
                                case 'EU WEST'              : region = '0'
                                    break
                                case 'EU EAST'              : region = '1' 
                                    break
                                case 'LATAM NORTH'          : region = '2'
                                    break
                                case 'LATAM SOUTH'          : region = '3'
                                    break
                                case 'NORTH AMERICA WEST'   : region = '4'
                                    break
                                case 'NORTH AMERICA EAST'   : region = '5'
                                    break
                                    
                            }

                            
                            sendData.Region = region
                            console.log(sendData);
                                
                            oModel.create('/GameServerSet', sendData)
                        } 
                    }
                });
                
            },


        });
    });
