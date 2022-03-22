sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "academia2022/zluuc3games/model/formatter",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "academia2022/zluuc3games/utils/regionANumero",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, Fragment, History, UIComponent, MessageBox, regionANumero) {
        "use strict";

        let vServerId,
            vRegion;

        return Controller.extend("academia2022.zluuc3games.controller.Users", {
            formatter: formatter,
            onInit: function () {
                this.getOwnerComponent()
                    .getRouter("object")
                    .getRoute("users")
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                vServerId = oEvent.getParameter("arguments").ServerId;
                vRegion = oEvent.getParameter("arguments").Region;

                let vNumberRegion = 0;
                switch (vRegion) {
                    case 'EU WEST': vNumberRegion = 0; break;
                    case 'EU EAST': vNumberRegion = 1; break;
                    case 'LATAM NORTH': vNumberRegion = 2; break;
                    case 'LATAM SOUTH': vNumberRegion = 3; break;
                    case 'NORTH AMERICA WEST': vNumberRegion = 4; break;
                    case 'NORTH AMERICA EAST': vNumberRegion = 5; break;
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

            _getServerDetails: function (serverId, region) {
                let oModel = this.getView().getModel();
                let sPath = `/GameServerSet(ServerId=${serverId},Region='${region}')`;


                oModel.read(sPath, {
                    success: function (oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel()
                        oModelLocalJson.setData(oData)
                        this.getView().setModel(oModelLocalJson, "modeloLocalServidor")
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con sap');
                    }.bind(this)
                });


            },


            _getUsers: function (serverId, region) {
                let oModel = this.getView().getModel();
                let sPath = `/GameServerSet(ServerId=${serverId},Region='${region}')/GameUserSet`;


                oModel.read(sPath, {
                    success: function (oData) {
                        let oModelLocalJson = new sap.ui.model.json.JSONModel();
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("idUsuariosTable").setModel(oModelLocalJson, "modeloLocalUsuarios");
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show('Error al obtener todos los usuarios');
                    }.bind(this)
                });
            },




            onFilterUsers: function () {

                let aFilter = []
                let vEstado = ''
                let oModel = this.getView().getModel()
                let oModelLocalJson = new sap.ui.model.json.JSONModel();

                aFilter.push(new sap.ui.model.Filter("ServerId", 'EQ', vServerId))

                if (this.getView().byId("idTipo").getSelectedKey()) {
                    vEstado = this.getView().byId("idTipo").getSelectedKey()
                    aFilter.push(new sap.ui.model.Filter("TypeAccount", 'EQ', vEstado))
                }

                if (this.getView().byId("idEstado").getSelectedKey()) {
                    vEstado = this.getView().byId("idEstado").getSelectedKey()
                    aFilter.push(new sap.ui.model.Filter("AccountStatus", 'EQ', vEstado))
                }

                if (this.getView().byId("idNombreUsuarioFilter").getValue()) {
                    vEstado = this.getView().byId("idNombreUsuarioFilter").getValue()
                    aFilter.push(new sap.ui.model.Filter("Username", 'EQ', vEstado))
                }

                oModel.read("/GameUserSet", {
                    filters: aFilter,
                    success: function (oData) {
                        oModelLocalJson.setData(oData.results);
                        this.getView().byId("idUsuariosTable").setModel(oModelLocalJson, "modeloLocalUsuarios");
                    }.bind(this),

                    error: function () {
                        sap.m.MessageToast.show('Error al filtrar')
                    }.bind(this)
                })

            },

            navToCreateUser: function (oEvent) {
                // this.getOwnerComponent()
                //     .getRouter()
                //     .navTo("CreateUser")

                if (!this.oDialogCrear) {
                    this.oDialogCrear = new sap.m.Dialog({
                        title: '{i18n>title_crear_usuario}',
                        content: [
                            new sap.ui.layout.form.SimpleForm({
                                editable: true,
                                layout: 'ResponsiveGridLayout',
                                content: [
                                    new sap.m.Label({
                                        text: '{i18n>place_holder_usuario}'
                                    }),
                                    new sap.m.Input({
                                        width: '100%',
                                        value: '{oCrearUsuarioModel>/usuario}'
                                    }),
                                    new sap.m.Label({
                                        text: '{i18n>place_holder_mail}'
                                    }),
                                    new sap.m.Input({
                                        width: '100%',
                                        value: '{oCrearUsuarioModel>/mail}'
                                    }),
                                    new sap.m.Label({
                                        text: '{i18n>place_holder_password}'
                                    }),
                                    new sap.m.Input({
                                        width: '100%',
                                        value: '{oCrearUsuarioModel>/contrasena}',
                                        type: 'Password'
                                    }),
                                    new sap.m.Label({
                                        text: '{i18n>place_holder_re_password}'
                                    }),
                                    new sap.m.Input({
                                        width: '100%',
                                        value: '{oCrearUsuarioModel>/reingresocontrasena}',
                                        type: 'Password'
                                    }),
                                    new sap.m.Label({
                                        text: '{i18n>columna_TypeAccount}'
                                    }),
                                    new sap.m.ComboBox({
                                        width: '100%',
                                        items: [
                                            new sap.ui.core.Item({ text: 'V.I.P.' }),

                                            new sap.ui.core.Item({ text: 'Normal' })
                                        ],
                                        value: '{oCrearUsuarioModel>/tipocuenta}'
                                    })
                                ]
                            })
                        ],
                        beginButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: '{i18n>title_crear_usuario}',
                            press: this._onLlamarCreate.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            type: sap.m.ButtonType.Emphasized,
                            text: '{i18n>text_cancelar}',
                            press: function () {
                                this.oDialogCrear.close()
                            }.bind(this)
                        })
                    }).addStyleClass("sapUiContentPadding")
                    this.getView().addDependent(this.oDialogCrear)
                }

                this.oDialogCrear.setModel(new sap.ui.model.json.JSONModel({}), "oCrearUsuarioModel")
                this.oDialogCrear.open()
            },

            _onLlamarCreate: function (oEvent) {

                const oCrearModelo = this.oDialogCrear.getModel("oCrearUsuarioModel")
                const dataCreacion = oCrearModelo.getData()
                const oResourceBundle = this.getView().getModel('i18n').getResourceBundle()
                const close = this.oDialogCrear.close()

                let ok = false
                let oModel = this.getView().getModel()
                let sPath = `/GameUserSet`
                let successful = false
                let sendData


                if (dataCreacion.usuario && dataCreacion.mail && dataCreacion.contrasena && dataCreacion.reingresocontrasena) {
                    ok = true
                }
                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("allMandatoryFields"))
                }

                if(dataCreacion.contrasena != dataCreacion.reingresocontrasena) {
                    ok = false
                    sap.m.MessageToast.show(oResourceBundle.getText("passwordNotMatch"))
                }

                sendData = {
                    ServerId : Number(vServerId),
                    Region   : regionANumero(vRegion),
                    Username : dataCreacion.usuario,
                    Mail     : dataCreacion.mail,
                    Password : dataCreacion.contrasena,
                    TypeAccount : regionANumero(dataCreacion.tipocuenta)
                }

                if (ok) {
                    oModel.create(sPath, sendData, {
                        success: function(data, response){
                            successful = true
                            this.getView().byId("idUsuariosTable").getModel().refresh(true)
                            MessageBox.success("Data successfully created");
                        }.bind(this),
                        error: function(error){
                            MessageBox.error("El usuario ya existe");
                        }.bind(this)
                    })
                }

            },


            onDetailsUser: function (oEvent) {

                if (oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'BANNED') {

                    MessageBox.alert("No puedes editar a un usuario baneado!");
                }
                if (oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'GOOD') {

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

            onBannearUser: function (oEvent) {

                let sendData = {
                }
                let ServerId = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("ServerId")
                let Region = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Region")
                let Username = oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("Username")

                if (oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'BANNED') {

                    MessageBox.alert("No puedes banear a un usuario baneado xd!", {
                        title: "Cuidado!"
                    });
                }
                if (oEvent.getSource().getBindingContext("modeloLocalUsuarios").getProperty("AccountStatus") == 'GOOD') {
                    MessageBox.confirm(`Seguro que quieres banear al usuario ${Username}?`, {
                        title: "Atencion!",
                        initialFocus: sap.m.MessageBox.Action.CANCEL,
                        onClose: function (sButton) {
                            if (sButton === MessageBox.Action.OK) {

                                sendData.AccountStatus = "BANNED"

                                let oModel = this.getView().getModel();
                                let sPath = `/GameUserSet(ServerId=${ServerId},Region='${Region}',Username='${Username}')`;

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
