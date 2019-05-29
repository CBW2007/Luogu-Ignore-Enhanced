# Luogu-Ignore-Enhanced

**注意，脚本仍在开发，目前公布的版本可能存在 BUG，或功能支持不完全，请见谅。**

众所周知，开放活跃的社区是洛谷最突出的特色。但是这也意味着相对于其它 OJ 来说，洛谷用户中的小学生[[1]](#脚注)占比较大。

规范和净化社区是一项艰巨的任务，作者太菜，只有一个 **治标不治本** 的方案：**屏蔽**。

这个脚本可以帮助您 **彻底地** 屏蔽指定的 ID 或 ID 列表，即可屏蔽以下类型的信息：

- 首页犇犇、讨论
- 个人空间、通知、私信
- 讨论页面
- 题目相关讨论、提供者
- 题解及其评论
- 提交记录
- 比赛排行榜、出题人
- 博客及其评论

## 使用方式

安装：[这里](https://github.com/tiger0132/Luogu-Ignore-Enhanced/raw/master/ignore.user.js)。

默认的屏蔽列表是空的，在 Console 中使用下列函数修改屏蔽列表：

函数名称 | 用途
:-: | :-:
`ignAdd(id)` | 将 `id` 加入屏蔽列表
`ignDel(id)` | 将 `id` 从屏蔽列表中删除
`ignQuery(id)` | 查询 `id` 是否在屏蔽列表中
`ignTog(id)` | 如果 `id` 在屏蔽列表中则添加，否则删除
`ignShow()` | 查询整个屏蔽列表
`ignClear()` | 清除整个屏蔽列表
`ignPart()` | 将屏蔽方式切换为部分屏蔽
`ignAll()` | 将屏蔽方式切换为完全屏蔽

## 目前的支持的功能

- 在犇犇和讨论中的每一层楼增加两个按钮「屏蔽」、「解除」
- 屏蔽讨论页面的评论
- 屏蔽洛谷首页和个人主页的犇犇

### 部分屏蔽

本脚本默认为部分屏蔽。

将屏蔽方式切换为部分屏蔽：在 Console 输入 `ignPart()`。

屏蔽后有提示信息。点击提示信息可以显示这条评论。

### 完全屏蔽

将屏蔽方式切换为完全屏蔽：在 Console 输入 `ignAll()`。

屏蔽后无提示信息。

## 已知 BUG

暂无，若发现 BUG 欢迎提出 issue。

## 贡献

本 repo 接受任何形式的贡献。

## 免责声明

**本脚本仅提供屏蔽功能，不限制其使用方式。作者不承担使用本脚本方式不当造成所的任何损失。作者保留本 repo 的最终解释权，感谢合作。**

# 脚注

[1]: 本 repo 中的「小学生」均指 **心理年龄** 而非 **学籍、生理年龄**。请勿擅自对号入座，感谢合作。