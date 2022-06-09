# 前缀和
#### 1. 前缀和用于区间求和问题
#### 2. 定义前缀和数组（下标从1开始）
```go
sum := make([]int, n+1)           // sum长度比nums多1位
for i := 1; i <= n; i++ {
  sum[i] = sum[i-1] + nums[i-1]   // nums[i]前缀和（包括自身）为sum[i+1]
}

// 举例：nums = [1, 2, 3, 4], sum = [0, 1, 3, 6, 10]
```
---

### [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)
* 给定一个含有 n 个正整数的数组和一个正整数 target 。
* 找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。
* **思路**：因为数组元素都大于0，因此前缀和单调递增。然后枚举前缀和数组元素下标r作为右端点下标，然后对[0, r]进行二分查找满足条件的最大l下标。时间复杂度O(nlog n)

```go
func minSubArrayLen(target int, nums []int) int {
  n := len(nums)
  res := n+1
  sum := make([]int, n+1)         // nums[i]前缀和等于sum[i+1]
  for i := 1; i <= n; i++ {
    sum[i] = sum[i-1] + nums[i-1]
  }
  // 以r作为nums的右端点，从[0, r]，在前缀和数组中二分寻找左端点（因为前缀和数组单调递增）
  // sum[r] - sum[x]代表 nums数组中 x-1 到 r-1 之间的区间和
  // 不等式：sum[r] - sum[x] >= target, 转换得到：sum[x] <= target - sum[r]
  for r := 1; r <= n; r++ {       
    l := lastLteq(sum[:r+1], sum[r] - target)
    if l < 0 || l >= n {          // 不符合条件的l过滤
      continue
    }
    // fmt.Println("l:", l)
    res = Min(res, r-l)
  }
  if res == n+1 {                 // 排除无解的情况
    return 0
  }
  return res
}

// arr数组中最后一个 <= x 的元素下标
func lastLteq(arr []int, x int) int {
  l := 0
  r := len(arr)-1
  for l <= r {
    mid := (l+r) >> 1
    if arr[mid] <= x {
      l = mid + 1
    } else {
      r = mid - 1
    }
  }
  return r
}

func Min(a, b int) int {
  if a < b {
    return a
  }
  return b
}
```

### [238. 除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/)
* 给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。
* 题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。
* 请不要使用除法，且在 O(n) 时间复杂度内完成此题。
* **思路**：定义prefix为每个元素前面所有元素乘积，suffix为每个元素后面所有元素乘积。对于i下标的结果，就是prefix[i] * suffix[i]
```go
func productExceptSelf(nums []int) []int {
  n := len(nums)
  res := make([]int, n)
  prefix := make([]int, n)
  suffix := make([]int, n)
  prefix[0] = 1                           // 第一项为1方便乘
  for i := 1; i < n; i++ {                // 从前往后遍历
    prefix[i] = prefix[i-1] * nums[i-1]
  }
  suffix[n-1] = 1                         // 最后一项为1方便乘
  for i := n-2; i >= 0; i-- {             // 从后往前遍历
    suffix[i] = suffix[i+1] * nums[i+1]
  }
  for i := 0; i < n; i++ {
    res[i] = prefix[i] * suffix[i]
  }
  return res
}
```

### [523. 连续的子数组和](https://leetcode.cn/problems/continuous-subarray-sum/)
* 给你一个整数数组 nums 和一个整数 k ，编写一个函数来判断该数组是否含有同时满足下述条件的连续子数组：
  * 子数组大小 至少为 2 ，且
  * 子数组元素总和为 k 的倍数。
  * 如果存在，返回 true ；否则，返回 false 。
* 如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。0 始终视为 k 的一个倍数。

* 要解这题要先知道 **同余定理**

```
若 a - b = k * m

则：a(mod m) = b(mod m）

证明如下：

设：
a - b = k * m,

则：
a = k * m + b,

两边对m取余得：
a(mod m) = 0 + b(mod m）
```

* 解题思路：
  * 先构造前缀和数组 sum
  * 然后右端点 i 从 2 开始遍历（因为数组最小长度为 2 ）
  * 每次往set中添加[左端点]前缀和对k的余数
  * 如果[右端点]前缀和对k的余数在set中存在，则返回true，否则返回false
  * 更直观的set添加举例：[a], [ab], [abc], [abcd], [abcde], [abcdef], [abcdefg]，如果[abc]和[abcde]余数相同，则答案为true

```go
type void struct{}
var member void

func checkSubarraySum(nums []int, k int) bool {
  n := len(nums)
  sum := make([]int, n+1)
  for i := 1; i <= n; i++ {           // 构造前缀和数组
    sum[i] = sum[i-1] + nums[i-1]
  }

  set := make(map[int]void)           // 前缀和余数set
  for i := 2; i <= n; i++ {           // 数组长度 >= 2，且前缀和数组sum从1开始，因此这里i := 2
    set[sum[i-2] % k] = member
    if _, ok := set[sum[i] % k]; ok {
      return true
    }
  }
  return false
}
```
