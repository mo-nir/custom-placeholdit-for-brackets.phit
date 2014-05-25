define(function(require, exports, module) {

	//javascript strict mode
	'use strict';

	//load program modules
	var EditorManager = brackets.getModule("editor/EditorManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		Dialogs = brackets.getModule("widgets/Dialogs"),
		AppInit = brackets.getModule("utils/AppInit"),
		Menus = brackets.getModule("command/Menus"),
		Commands = brackets.getModule("command/Commands"),
		CommandManager = brackets.getModule("command/CommandManager");

	//load our module
	//html for modal dialog
	var dialogoModal = require("text!html/jaraphitdialog.html");

	//code for add menu option
	var OPEN_PH_DIALOG = "Insert custom image PH.it";
	//the command ID, which must be unique
	var OPEN_PH_COMMAND_ID = "toolkit.openPHdialog";

	// tell the CommandManager: execute the function jaraphWindow function when this menu item is selected
	CommandManager.register(OPEN_PH_DIALOG, OPEN_PH_COMMAND_ID, jaraphWindow);

	//add a menu item somewhere in the application Help menu
	var menu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
	//menu divider
	menu.addMenuDivider();
	menu.addMenuItem(OPEN_PH_COMMAND_ID, [], Menus.AFTER, Commands.HELP_FORUM);
	menu.addMenuDivider();

	//function returns random number between min-max
	function getIntAleatorio(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	//show modal
	//listener
	function jaraphWindow() {
		Dialogs.showModalDialogUsingTemplate(dialogoModal, true);
		$("#okph").click(generarUrl);
	}

	//function for generate placehold.it url
	function generarUrl() {
		//dimensions
		var anchoModal = $("input[name='ancho']").val();
		if (!anchoModal || isNaN(anchoModal) || anchoModal<=0 ) {
			anchoModal = getIntAleatorio(400, 900);
		}
		var altoModal = $("input[name='alto']").val();
		if (!altoModal || isNaN(altoModal) || altoModal<=0 ) {
			altoModal = getIntAleatorio(200, 500);
		}
		var dimensions = "";
		if (!$("input[name='alto']").val() && ($("input[name='ancho']").val() && !isNaN($("input[name='ancho']").val()))) {
			dimensions = anchoModal;
		} else {
			dimensions = anchoModal + "x" + altoModal;
		}
		//text
		var textoModal = $("input[name='texto']").val().replace(' ', '+');
		if ($("input[name='texto']").val()) {
			textoModal = "&text=" + textoModal;
		}
		//color
		var colorModal = $("#color").val();
		var colorFinal = "";
		if (colorModal != "default") {
			colorFinal = "/" + colorModal;
		}
		//final url
		var url = "http://placehold.it/" + dimensions + colorFinal + textoModal;
		var imgTag = '<img src="' + url + '">';
		//insert url in document
		var editor = EditorManager.getCurrentFullEditor();
		if (editor) {
			//at the current cursor position
			var insertionPos = editor.getCursorPos();
			editor.document.replaceRange(imgTag, insertionPos);
		};
	}

	//add icon to toolbar
	//listener
	AppInit.htmlReady(function() {
		var $iconPh;
		//load custom css
		ExtensionUtils.loadStyleSheet(module, "jaraphitstyle.css");
		//icon & listener 
		$iconPh = $("<a>").attr({
			id: "jaraphit-icon",
			href: "#"
		}).click(jaraphWindow).appendTo($("#main-toolbar .buttons"));
	});

});
