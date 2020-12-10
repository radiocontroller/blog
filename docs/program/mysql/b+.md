# MySQL索引为什么要用B+树实现？
---

::: tip 建议先看完这个链接

[MySQL索引为什么要用B+树实现？](https://juejin.cn/post/6844903692802457607)

:::

### 二叉查找树（带有特殊属性的二叉树）
  1. 非叶子节点最多拥有两个子节点

  2. 非叶子节值大于左边子节点、小于右边子节点

  3. 没有值相等重复的节点

### 平衡二叉查找树(AVL树)
  1. 在二叉查找树的基础上多了一点：树的左右两边的层级数相差不会大于1

  2. 平衡二叉树的查找效率确实很快，但维护一颗平衡二叉树的代价是非常大的，
     需要1次或多次左旋和右旋来得到插入或更新后树的平衡性

### B树（平衡多路查找树）和B+树的区别
  1. B+树的非叶子节点不保存目标数据，这样使得B+树每个节点所能保存的键值大大增加
    
  2. B+树叶子节点保存了父节点的所有键值和目标数据，每个叶子节点的键值从小到大连接（链表）
    
  3. B+的非叶子节点只进行数据索引，不会存目标数据，所有数据必须要到叶子节点才能获取到，所以每次数据查询的次数都一样

### Mysql索引要用B+树原因如下
  1. 在B树的基础上每个节点存储的键值更多，树的层级更少，查询数据更快（总结：查询更快）
  
  2. B+树的查询效率更加稳定，因为数据放在叶子节点，每次查询的次数为树的高度（总结：查询次数稳定）
  
  3. B+树能提高范围查询的效率，因为叶子节点通过指针顺序连接（总结：范围查询效率高）
  
### 索引存储形式
  1. 主键索引：<id, row>
  
  2. 普通索引：<index, id>