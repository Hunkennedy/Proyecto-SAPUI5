/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"academia2022/zluuc3_games/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
