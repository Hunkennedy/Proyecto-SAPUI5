sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, UIComponent) {
        "use strict";

        let userData = {}

        return Controller.extend("academia2022.zluuc3games.controller.Userdetail", {
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("usersdetails")
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function(oEvent) {
                let vServerId = oEvent.getParameter("arguments").ServerId
                let vRegion = oEvent.getParameter("arguments").Region
                let vUsername = oEvent.getParameter("arguments").Username

                userData.ServerId = vServerId
                userData.Region = vRegion
                userData.Username = vUsername
                
                this._getUser(vServerId, vRegion, vUsername)

                
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

            _getUser: function (serverId, region, username) {
                let oModel = this.getView().getModel();
                let sPath = `/GameUserSet(ServerId=${serverId},Region='${region}',Username='${username}')`;


                oModel.read(sPath, {
                    success: function(oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData);
                        this.getView().setModel(oModelLocalJson, "modeloLocalUsuario");
                    }.bind(this),

                    error: function() {
                        sap.m.MessageToast.show('Error al intentar obtener el usuario deseado');
                    }.bind(this)
                });
            },
                
            _updateUserInfo: function(oEvent) {

                
                let sendData = {
                }
                sendData.Username = this.getView().byId("idInputUsername").getValue() || ""
                sendData.Mail = this.getView().byId("idInputMail").getValue() || ""
                sendData.Password = this.getView().byId("idInputPassword").getValue() || ""
                
                let oModel = this.getView().getModel();
                let sPath = `/GameUserSet(ServerId=${userData.ServerId},Region='${userData.Region}',Username='${userData.Username}')`;
                // let CSRFToken = oModel.getSecurityToken()
                // oModel.setHeaders({
                //     'x-csrf-token': CSRFToken
                // })

                oModel.update(sPath, sendData)
                oModel.refresh(true);

                this.getView().byId("idInputMail").setValue("")
                this.getView().byId("idInputUsername").setValue("")
                this.getView().byId("idInputPassword").setValue("")

                this.onNavBack()
            }
            
        });
    });
