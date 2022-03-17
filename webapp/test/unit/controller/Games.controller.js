/*global QUnit*/

sap.ui.define([
	"academia2022/zluuc3_games/controller/Games.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Games Controller");

	QUnit.test("I should test the Games controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
