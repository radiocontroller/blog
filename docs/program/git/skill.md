# 小技巧
---

#### .git/info/exclude
* .gitignore可以忽略你不想提交的文件，但是.gitignore文件产生修改，并且可能会提交上去。因此如果你想针对本地忽略一些文件，可以在.git/info/exclude中写上
* **只适用未被 git 追踪的文件，如果要想忽略看下面第2点**

#### git update-index 两种用法区别
* **--assume-unchanged** is the flag which means the files should not change locally.
* **--skip-worktree** is the flag which means the files should change locally. **一般情况下都用这个**
* [How to ignore files already managed with Git locally](https://dev.to/nishina555/how-to-ignore-files-already-managed-with-git-locally-19oo)
* [https://fallengamer.livejournal.com/93321.html](https://fallengamer.livejournal.com/93321.html)

#### git stash apply --index
* --index 可以回到stash时的状态，如果不加，那么都是unstaged状态

#### 删除远程分支
* git push origin --delete feature/login

#### git log匹配message
```
git log --grep=message
```

#### 撤销某个merge
```
git revert <id> -m 1
```

#### [Restoring deleted files in Git](https://www.git-tower.com/learn/git/faq/restoring-deleted-files)

#### commit规范建议
```
feat: 新功能（feature）
fix: 修补 bug
docs: 文档（documentation）
style: 格式（不影响代码运行的变动）
refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
test: 增加测试
chore: 构建过程、辅助工具的变动
perf: 提高性能
```
