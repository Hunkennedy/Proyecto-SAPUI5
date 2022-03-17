sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "academia2022/zluuc3games/model/formatter",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, Fragment, History, UIComponent, MessageBox) {
        "use strict";

        

        return Controller.extend("academia2022.zluuc3games.controller.Users", {
            formatter: formatter,
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter("object")
                    .getRoute("users")
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function(oEvent) {
                let vServerId = oEvent.getParameter("arguments").ServerId;
                let vRegion = oEvent.getParameter("arguments").Region;
                let vNumberRegion = 0;
                switch (vRegion) {
                    case 'EU WEST':
                        vNumberRegion = 0;
                        break;
                    case 'EU EAST':
                        vNumberRegion = 1;
                        break;                        
                    case 'LATAM NORTH':
                        vNumberRegion = 2;
                        break;
                    case 'LATAM SOUTH':
                        vNumberRegion = 3;
                        break;
                        
                    case 'NORTH AMERICA WEST':
                        vNumberRegion = 4;
                        break;                        
                    case 'NORTH AMERICA EAST':
                        vNumberRegion = 5;
                        break;
                    default:
                        break;
                }
                
                this._getServerDetails(vServerId, vNumberRegion)
                this._getUsers(vServerId, vNumberRegion)
                
            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteGames", {}, true);
                }
            },

            _getServerDetails: function(serverId, region) {
                let oModel = this.getView().getModel();
                let sPath = `/GameServerSet(ServerId=${serverId},Region='${region}')`;


                oModel.read(sPath, {
                    success: function(oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel()
                        oModelLocalJson.setData(oData)
                        this.getView().setModel(oModelLocalJson, "modeloLocalServidor")
                    }.bind(this),

                    error: function() {
                        sap.m.MessageToast.show('Error al conectar con sap');
                    }.bind(this)
                });

                
            },
            

            _getUsers: function (serverId, region) {
                let oModel = this.getView().getModel();
                let sPath = `/GameServerSet(ServerId=${serverId},Region='${region}')/GameUserSet`;


                oModel.read(sPath, {
                    success: function(oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("idUsuariosTable").setModel(oModelLocalJson, "modeloLocalUsuarios");
                    }.bind(this),

                    error: function() {
                        sap.m.MessageToast.show('Error al obtener todos los usuarios');
                    }.bind(this)
                });
            },

            


            onFilterUsers: function() {
                
                let aFilter = []
                let vEstado = ''
                let oModel = this.getView().getModel()

                if (this.getView().byId("idTipo").getSelectedKey()) {
                    vEstado = this.getView().byId("idTipo").getSelectedKey()
                    aFilter.push(new sap.ui.model.Filter("TypeAccount", 'EQ', vEstado))
                }

                if (this.getView().byId("idEstado").getSelectedKey()) {
                    vEstado = this.getView().byId("idEstado").getSelectedKey()
                    aFilter.push(new sap.ui.model.Filter("AccountStatus", 'EQ', vEstado))
                }

                oModel.read("/GameUserSet", {
                    filters: aFilter,
                    success: function(oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("idUsuariosTable").setModel(oModelLocalJson, "modeloLocalUsuarios");
                    }.bind(this),

                    error: function() {
                        sap.m.MessageToast.show('Error al filtrar')
                    }.bind(this)
                })

            },

            onCreateUser:function() {
                console.log("USUARIO CREADOOOO");
            },

            onDetailsUser: function(oEvent) {
                
                if(oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'BANNED') {
                    
                    MessageBox.alert("No puedes editar a un usuario baneado!");
                }
                if(oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'GOOD') {
                    
                    console.log("CAN EDIT");
                    this.getOwnerComponent()
                        .getRouter()
                        .navTo("usersdetails", {
                            ServerId: oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("ServerId"),
                            Region: oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Region"),
                            Username: oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Username")
                        })
                }

            },

            onBannearUser: function(oEvent) {

                let sendData = {
                }
                let ServerId = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("ServerId")
                let Region = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Region")
                let Username = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Username")

                if(oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'BANNED') {
                    
                    MessageBox.alert("No puedes banear a un usuario baneado xd!",{
                        title: "Cuidado!"
                    });
                }
                if(oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'GOOD') {
                    MessageBox.confirm(`Seguro que quieres banear al usuario ${Username}?`, {
                        title: "Atencion!",
                        initialFocus : sap.m.MessageBox.Action.CANCEL,
                        onClose : function(sButton) {
                            if (sButton === MessageBox.Action.OK) {
                                
                                sendData.AccountStatus = "BANNED"
                                
                                let oModel = this.getView().getModel();
                                let sPath = `/GameUserSet(ServerId=${ServerId},Region='${Region}',Username='${Username}')`;
                                console.log("Hello World BANNED");
                                console.log(sendData);
                                
                                oModel.update(sPath, sendData)
                            } 
                            if (sButton === MessageBox.Action.CANCEL) {
                                // Do something
                            }
                        }
                    });
                    
                }
                    
            }

        });
    });
