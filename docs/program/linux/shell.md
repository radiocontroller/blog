# 常用命令
---

#### 命令行添加/清空DNS
```
networksetup -setdnsservers Wi-Fi 10.1.1.30
networksetup -setdnsservers Wi-Fi "Empty"
```

#### 解决rails console多行加载太慢
```
rails console -- --nomultiline
```

#### 解决ruby irb多行加载太慢
```
irb --nomultiline
```

#### docker进入容器可编辑中文
```
docker exec -it xxx env LANG=C.UTF-8 /bin/bash
```

#### mac蓝牙重启
```
sudo kill `ps -ef | grep bluetoothd | head -n 1 | awk '{ print $2; }'`
```

#### gz文件解压
```
gunzip filename.gz
```

#### 显示file文件里匹配foo字串那行以及上下5行
```
grep -C 5 foo file
```

#### 清空文件
```
: > access.log
```

#### 覆盖文件
```
cat > filename.txt <<EOF
......文件内容
EOF
```

#### 提取文本中数字
```
cat tag |grep -oE '[0-9]+'
```

#### 查看内存消耗最多的前 10 个进程
```
ps auxw|head -1;ps auxw|sort -rn -k4|head -10  
```

#### 查看目录下各文件夹的占用空间大小
```
sudo du -sh /*
```

#### tar 打包
```
压缩：
   tar czvf all.gz *.txt          (c: create, z: gz压缩, v: verbose, f: filename)
解压
   tar xzvf all.gz *.txt
```

#### vim sudo 保存
```
:w !sudo tee %

```
#### grep不匹配某些字符
```
grep -v "xx"
```
