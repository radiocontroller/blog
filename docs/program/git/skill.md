# 奇淫技巧
---

#### 1. .git/info/exclude
* .gitignore可以忽略你不想提交的文件，但是.gitignore文件产生修改，并且可能会提交上去。因此
如果你想针对本地忽略一些文件，可以在.git/info/exclude中写上

#### 2. git stash apply --index
* --index 可以回到stash时的状态，如果不加，那么都是unstaged状态