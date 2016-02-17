var bar = 0;
var line = "||";
var amount = "||";
loading();
function loading() {
	bar = bar + 2;
	amount = amount + line;

	if(document.getElementById("chartInfo")!=undefined){
		if (bar < 99) {
			setTimeout("loading()", 100);
		} else {
		}
		document.getElementById("chartInfo").value = amount;
		document.getElementById("percentInfo").value = bar + "%";
	}
};
