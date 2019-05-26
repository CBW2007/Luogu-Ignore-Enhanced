// ==UserScript==
// @name         Luogu Ignore Enhanced - tiger0132
// @namespace    http://tampermonkey.net/
// @version      0.1
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

	function procDiscuss() {
		$("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > p").remove(); // 把上一次屏蔽的提示信息删除
		$("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > article").show(); // 把上一次屏蔽的评论解除隐藏
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
		var lz = $("#app-body-new > div.am-g.lg-main-content > div.am-u-md-4.lg-right > section > div > ul > li:nth-child(2) > span > a");
		if (ignoreList[lz[0].innerText] == true && ignoreEntirely) { // 如果需要彻底屏蔽，那么删除楼主
			lz.hide();
		}
	}

	process();
	function process() {
		if (window.location.href.match(/discuss/) != null) { // 讨论页面
			procDiscuss();
		}
	}

	function ignAdd(id) {
		ignoreList[id] = true;
		GM.setValue('LuoguIgnoreList', ignoreList);
		process();
	}
	function ignDel(id) {
		delete ignoreList[id];
		GM.setValue('LuoguIgnoreList', ignoreList);
		process();
	}
	function ignQuery(id) {
		return ignoreList[id];
	}
	function ignShow() {
		return ignoreList;
	}
	function ignAll() {
		ignoreEntirely = true;
		GM.setValue('LuoguIgnoreEntirely', ignoreList);
		process();
	}
	function ignPart() {
		ignoreEntirely = false;
		GM.setValue('LuoguIgnoreEntirely', ignoreList);
		process();
	}
	unsafeWindow.ignAdd = ignAdd;
	unsafeWindow.ignDel = ignDel;
	unsafeWindow.ignQuery = ignQuery;
	unsafeWindow.ignShow = ignShow;
	unsafeWindow.ignAll = ignAll;
	unsafeWindow.ignPart = ignPart;
})();