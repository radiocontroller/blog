# 常用命令
---

#### 1. gz文件解压
```
gunzip filename.gz
```

#### 2. 显示file文件里匹配foo字串那行以及上下5行
```
grep -C 5 foo file
```

#### 3. 内存占用前20
```
ps auxw|head -1;ps auxw|sort -rn -k4|head -20
```

#### 4. 清空文件
```
: > access.log
```

#### 5. 解决rails console多行加载太慢
```
rails console -- --nomultiline
```

#### 6. 解决ruby irb多行加载太慢
```
irb --nomultiline
```

#### 7. 覆盖文件
```
cat > filename.txt <<EOF
......文件内容
EOF
```

#### 8. 提取文本中数字
```
cat tag |grep -oE '[0-9]+'
```

#### 9. docker进入容器可编辑中文
```
docker exec -it xxx env LANG=C.UTF-8 /bin/bash
```

#### 10. 查看内存消耗最多的前 10 个进程
```
ps auxw|head -1;ps auxw|sort -rn -k4|head -10  
```

#### 11. 查看各目录大小
```
mac：du -h -d 1 .
ubuntu：du -h --max-depth=1 .
```

#### 12. tar 打包
```
压缩：
   tar czvf all.gz *.txt          (c: create, z: gz压缩, v: verbose, f: filename)
解压
   tar xzvf all.gz *.txt
```

#### 13. vim sudo 保存
```
:w !sudo tee %
```
#### 14. 不匹配某些字符
```
grep -v "xx"
```

#### 15. mac蓝牙重启
```
sudo kill `ps -ef | grep bluetoothd | head -n 1 | awk '{ print $2; }'`
```
