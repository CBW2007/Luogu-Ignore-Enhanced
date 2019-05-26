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
		$("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > p").remove();
		var comments = $("#app-body-new > div.am-g.lg-main-content > div.am-u-md-8.lg-right > div > article");
		for (var i = 0; i < comments.length; i++) {
			var id = $(".am-comment-meta > a:nth-child(2)", comments[i])[0].innerText;
			if (ignoreList[id] == true) { // 发现了小学生
				if (ignoreEntirely) {
					$(comments[i]).remove();
				}
				else {
					var str = `屏蔽了来自 ${id} 的一条消息`;
					if (comments[i].classList.contains("am-comment-danger")) str += ' (主楼)'; // 如果屏蔽了主楼则标记
					var node = $(`<p style="color: gray;font-size: 14px;text-align: center;">${str}</p>`);
					node.click(function () { node.prev().show(); });
					node.insertAfter(comments[i]);
					$(comments[i]).hide();
				}
			}
		}
	}

	if (window.location.href.match(/discuss/) != null) { // 讨论页面
		procDiscuss();
	}

	function ignAdd(id) {
		ignoreList[id] = true;
		GM.setValue('LuoguIgnoreList', ignoreList);
		procDiscuss();
	}
	function ignDel(id) {
		delete ignoreList[id];
		GM.setValue('LuoguIgnoreList', ignoreList);
		procDiscuss();
	}
	function ignQuery(id) {
		return ignoreList[id];
	}
	function ignShow() {
		return ignoreList;
	}
	unsafeWindow.ignAdd = ignAdd;
	unsafeWindow.ignDel = ignDel;
	unsafeWindow.ignQuery = ignQuery;
	unsafeWindow.ignShow = ignShow;
})();