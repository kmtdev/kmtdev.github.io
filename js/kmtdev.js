(function (window) {
	"use strict";

	var document = window.document,
		location = window.location;

	var Template = function (element) {
		var source = element.innerHTML;

		source = source.replace(/\s{2,}/g, "");
		source = source.replace(/\{\{(.*?)\}\}/g, "',$1,'");
		source = source.split("{%").join("');");
		source = source.split("%}").join("a.push('");
		source = "var a=[];a.push('{}');return a.join('');".format(source);

		this.range = document.createRange();
		this.source = new Function(source);
	};

	var Request = function (success) {
		this.xhr = new XMLHttpRequest();
		this.xhr.addEventListener("load", success, false);
	};

	var $ = window.$ = {
		endpoint: "https://api.github.com/users/{user}/repos",
		main: function () {
			this.list = new Template(window.list);
			this.request = new Request(this.success);

			this.request.get({
				user: location.host.split(".")[0]
			});
		},
		success: function () {
			window.root.appendChild($.list.render(window.root, JSON.parse(this.response)));
		}
	};

	Template.prototype.render = function (parent, data) {
		this.range.selectNode(parent);
		return this.range.createContextualFragment(this.source.call(data));
	};

	Request.prototype.get = function (parameters) {
		this.xhr.open("GET", $.endpoint.format(parameters), true);
		this.xhr.setRequestHeader("Accept", "application/json");
		this.xhr.send(null);
	};

	window.addEventListener("DOMContentLoaded", $.main.bind($), false);
})(this);