sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "academia2022/zluuc3games/utils/regionANumero",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, regionANumero, History, UIComponent,MessageBox) {
        "use strict";
        let vRegion, vServerId, vUsername

        return Controller.extend("academia2022.zluuc3games.controller.Report", {
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter("object")
                    .getRoute("Reportes")
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                vRegion   = oEvent.getParameter("arguments").Region
                vServerId = oEvent.getParameter("arguments").ServerId
                vUsername = oEvent.getParameter("arguments").Username

                let vNumberRegion = regionANumero(vRegion)

                
                this._getReports(vServerId, vNumberRegion, vUsername)

            },

            _getReports: function (serverId, region, username) {
                let oModel = this.getView().getModel();
                let sPath = `/GameUserSet(ServerId=${Number(serverId)},Region='${region}',Username='${username}')/ReportSet`;


                oModel.read(sPath, {
                    success: function (oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("idReportesLista").setModel(oModelLocalJson, "modeloLocalReportes");
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show('Error al obtener los reportes del usuario');
                    }.bind(this)
                });
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

            navToCreateReport: function () {
                

                if (!this.oDialogReporte) {
                    this.oDialogReporte = new sap.m.Dialog({
                        title: '{i18n>report_title_frag}',
                        content: [
                            new sap.ui.layout.form.SimpleForm({
                                editable: true,
                                layout: 'ResponsiveGridLayout',
                                content: [                                    
                                    new sap.m.Label({
                                        text: '{i18n>report_description}'
                                    }),
                                    new sap.m.TextArea({
                                        width: '100%',
                                        value: '{oCrearReportModel>/descripcion}'
                                    })
                                ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: '{i18n>text_crear}',
                            press: this._onCreateReport.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: '{i18n>text_cancelar}',
                            press: function () {
                                this.oDialogReporte.close()
                            }.bind(this)
                        })
                    }).addStyleClass("sapUiContentPadding")
                    this.getView().addDependent(this.oDialogReporte)

                }

                this.oDialogReporte.setModel(new sap.ui.model.json.JSONModel({}), "oCrearReportModel")
                this.oDialogReporte.open()

                
            },

            _onCreateReport: function () {
                const oCrearModelo = this.oDialogReporte.getModel("oCrearReportModel")
                const dataCreacion = oCrearModelo.getData()
                const oResourceBundle = this.getView().getModel('i18n').getResourceBundle()
                const dialog = this.oDialogReporte

                let ok = false
                let oModel = this.getView().getModel()
                let sPath = `/ReportSet`
                let sendData


                if (dataCreacion.descripcion != '') {
                    ok = true
                }
                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("allMandatoryFields"))
                }

                

                sendData = {
                    ServerId : Number(vServerId),
                    Region   : regionANumero(vRegion),
                    Username : vUsername,
                    Description : dataCreacion.descripcion
                }

                if (ok) {
                    oModel.create(sPath, sendData, {
                        success: function(data, response){
                            
                            dialog.close()
                            // this.getOwnerComponent()
                            //     .getRouter()
                            //     .navTo("users", {
                            //         ServerId : Number(vServerId),
                            //         Region   : regionANumero(vRegion)
                            //     })

                            this.onNavBack()

                        }.bind(this),
                        error: function(error){
                            MessageBox.error("El usuario ya existe")
                        }.bind(this)
                    })

                }
            },

            onBanear: function (oEvent) {
                let sendData = {
                    ServerId: Number(vServerId), 
                    Region: vRegion, 
                    Username: vUsername
                }

                let oModel = this.getView().getModel()
                let sPath = `/GameUserSet(ServerId=${Number(vServerId)},Region='${vRegion}',Username='${vUsername}')`
                let back = this.getOwnerComponent()
                .getRouter()
                
                MessageBox.confirm(`Seguro que quieres banear al usuario ${vUsername}?`, {
                    title: "Atencion!",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            sendData.AccountStatus = "BANNED"
                            oModel.update(sPath, sendData)
                            
                            back.navTo("RouteGames", {
                                ServerId : Number(vServerId),
                                Region   : regionANumero(vRegion)
                            })
                        }
                    }
                })
                
            },

            onDesbanear: function () {
                let sendData = {
                    ServerId: Number(vServerId), 
                    Region: vRegion, 
                    Username: vUsername
                }

                let oModel = this.getView().getModel()
                let sPath = `/GameUserSet(ServerId=${Number(vServerId)},Region='${vRegion}',Username='${vUsername}')`
                let back = this.getOwnerComponent()
                .getRouter()
                
                MessageBox.confirm(`Seguro que quieres desbanear al usuario ${vUsername}?`, {
                    title: "Atencion!",
                    initialFocus: sap.m.MessageBox.Action.CANCEL,
                    onClose: function (sButton) {
                        if (sButton === MessageBox.Action.OK) {
                            sendData.AccountStatus = "GOOD"
                            oModel.update(sPath, sendData)
                            
                            back.navTo("RouteGames", {
                                ServerId : Number(vServerId),
                                Region   : regionANumero(vRegion)
                            })
                        }
                    }
                })
            }

        });
    });
