// ==UserScript==
// @name         Luogu Ignore Enhanced - tiger0132
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  nope
// @author       tiger0132
// @match        https://www.luogu.org/
// @match        https://www.luogu.org/space*
// @match        https://www.luogu.org/discuss/show*
// @match        https://www.luogu.org/problemnew/show*
// @match        https://www.luogu.org/problemnew/solution*
// @match        https://www.luogu.org/recordnew/lists*
// @match        https://www.luogu.org/contestnew/show*
// @match        https://www.luogu.org/blog*
// @match        https://*.blog.luogu.org*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

/*
屏蔽位置:
- 首页犇犇、讨论
- 个人空间、通知、私信
- 讨论页面
- 题目相关讨论、提供者
- 题解及其评论
- 提交记录
- 比赛排行榜、出题人
- 博客及其评论
*/

(async function () {
	var ignoreList = await GM.getValue('LuoguIgnoreList', {});
	var ignoreEntirely = await GM.getValue('LuoguIgnoreEntirely', false);

	function procDiscuss() { // 安排讨论页面
		$("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > p").remove(); // 把上一次屏蔽的提示信息删除
		$("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > article").show(); // 把上一次屏蔽的评论解除隐藏
		var lz = $("#app-body-new > div.am-g.lg-main-content > div.am-u-md-4.lg-right > section > div > ul > li:nth-child(2) > span > a");
		lz.parent().show();
		var comments = $("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > article"); // 该页面的所有评论
		for (var i = 0; i < comments.length; i++) {
			(function (comment) {
				var id = $(".am-comment-meta > a:nth-child(2)", comment)[0].innerText;
				if (ignoreList[id] == true) { // 发现了小学生
					if (!ignoreEntirely) {
						var str = `屏蔽了来自 ${id} 的一条消息`;
						if (comments[i].classList.contains("am-comment-danger")) str += ' (主楼)'; // 如果屏蔽了主楼则标记
						var node = $(`<p style="color: gray;font-size: 14px;text-align: center;">${str}</p>`);
						node.click(function () { node.prev().toggle(); }); // 点击提示信息可以显示该条信息，再次点击可以重新屏蔽
						node.insertAfter(comment);
					}
					$(comment).hide();
				}
			})(comments[i]);
		}
		if (ignoreList[lz[0].innerText] == true && ignoreEntirely) { // 如果需要彻底屏蔽，那么删除楼主
			lz.parent().hide();
		}
	}
	function selectorInit() { // ID 选择器初始化
		// TODO: 在博客、题解评论中选择 ID
		GM_addStyle(`
a.lg-fg-brown:hover, a.lg-fg-gray:hover, a.lg-fg-bluelight:hover, a.lg-fg-green:hover, a.lg-fg-orange:hover, a.lg-fg-red:hover, a.lg-fg-purple:hover {
    background-color: lightgreen;
    color: #fff;
    text-decoration: none;
}
* {
	margin: 0;
	padding: 0;
}
.menu {
	width: 72px;
	border: 1px solid #ccc;
	position: absolute;
	box-shadow: 0 0 0 rgba(0, 0, 0, 0);
	background: white;
	padding: 0 0;
	transition: all .1s ease;
}
.menu li {
	list-style: none;
	width: 100%;
}
.menu li a {
	display: inline-block;
	text-decoration: none;
	color: #555;
	width: 100%;
	padding: 4px 0;
	text-align: center;
	font-size: 10px;
}
.menu li:first-of-type {
	border-radius: 5px 5px 0 0;
}
.menu li a:hover,
.menu li a:active {
	background: #eee;
	color: #0AAF88;
}`); // 鼠标移动到 ID 上就有绿框框~
		$(document.body).append(`<ul class="menu" id="menu"><li><a>屏蔽</a></li><li><a>解除</a></li></ul>`);
	}
	function idSelector() { // ID 选择器
		var ids = $("a.lg-fg-brown, a.lg-fg-gray, a.lg-fg-bluelight, a.lg-fg-green, a.lg-fg-orange, a.lg-fg-red, a.lg-fg-purple");
		var w = function () { return document.documentElement.clientWidth || document.body.clientWidth; };
		var h = function () { return document.documentElement.clientHeight || document.body.clientHeight; };
		var menu = $('#menu');
		menu.hide();
		menu.onclick = function (e) {
			var event = e || window.event;
			event.cancelBubble = true;
		};
		for (var i = 0; i < ids.length; i++) {
			(function (id) {
				ids[i].onclick = function () { menu.hide(); };
				ids[i].oncontextmenu = function (e) {
					menu.show();
					var event = event || e;
					var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
					menu[0].style.top = event.clientY + scrollTop + "px";
					var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
					menu[0].style.left = event.clientX + scrollLeft + "px";
					menu[0].children[0].onclick = function () { ignAdd(id); }
					menu[0].children[1].onclick = function () { ignDel(id); }
					return false;
				}
			})(ids[i].innerText);
		}
		document.onclick = function () {
			document.getElementById("menu").style.display = "none";
		}
	}
	function injectLoadFeed() {
		new MutationObserver(function (mutations) { idSelector(); }).observe(document.getElementById('feed'), { childList: true, subtree: true });
	}
	function proc() {
		if (window.location.href.match(/discuss/) != null) { // 讨论页面
			procDiscuss();
		}
	}

	selectorInit();
	setTimeout(function () {
		idSelector();
		injectLoadFeed();
	}, 1000);
	proc();

	function ignAdd(id) {
		ignoreList[id] = true;
		GM.setValue('LuoguIgnoreList', ignoreList);
		proc();
	}
	function ignDel(id) {
		delete ignoreList[id];
		GM.setValue('LuoguIgnoreList', ignoreList);
		proc();
	}
	function ignQuery(id) {
		return ignoreList[id];
	}
	function ignShow() {
		return ignoreList;
	}
	function ignAll() {
		ignoreEntirely = true;
		GM.setValue('LuoguIgnoreEntirely', ignoreEntirely);
		proc();
	}
	function ignPart() {
		ignoreEntirely = false;
		GM.setValue('LuoguIgnoreEntirely', ignoreEntirely);
		proc();
	}
	unsafeWindow.ignAdd = ignAdd;
	unsafeWindow.ignDel = ignDel;
	unsafeWindow.ignQuery = ignQuery;
	unsafeWindow.ignShow = ignShow;
	unsafeWindow.ignAll = ignAll;
	unsafeWindow.ignPart = ignPart;
})();