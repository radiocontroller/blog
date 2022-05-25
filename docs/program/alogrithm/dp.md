# 动态规划
---

### [爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)
* 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
* 解：要想达到 n 阶，那么你前一次肯定是在n - 1阶或 n - 2 阶，因此将这两种的方法相加即可
* dp[i]定义：到达第 i 个阶梯方法总数
```go
func climbStairs(n int) int {
	dp := map[int]int{}
	dp[1] = 1
	dp[2] = 2
	for i := 3; i <= n; i++ {
		dp[i] = dp[i-1] + dp[i-2]
	}
	return dp[n]
}
```

### [打家劫舍](https://leetcode-cn.com/problems/house-robber/solution/dong-tai-gui-hua-jie-ti-si-bu-zou-xiang-jie-cjavap/)
* 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

* 给定一个代表每个房屋存放金额的非负整数数组，计算你不触动警报装置的情况下，一夜之内能够偷窃到的最高金额。

* 解：状态转移方程：max(dp(n-1), dp(n-2) + nums[n-1])
* dp[i]定义：前 i 个房间能够偷盗的最高金额

```go
func rob(nums []int) int {
	  if len(nums) == 1 {
	      return nums[0]
	  }
	  dp := make([]int, len(nums))
	  dp[0] = nums[0]
	  dp[1] = Max(nums[0], nums[1])
	  for i := 2; i < len(nums); i++ {
	      dp[i] = Max(nums[i] + dp[i-2], dp[i-1])
	  }
	  return dp[len(nums)-1]
}

func Max(a, b int) int {
  	if a > b {
    	return a
  	}
  	return b
}
```

### [使用最小花费爬楼梯](https://leetcode-cn.com/problems/min-cost-climbing-stairs/solution/yi-bu-yi-bu-tui-dao-dong-tai-gui-hua-de-duo-chong-/)
* 数组的每个下标作为一个阶梯，第 i 个阶梯对应着一个非负数的体力花费值 cost[i]（下标从 0 开始）。
* 每当你爬上一个阶梯你都要花费对应的体力值，一旦支付了相应的体力值，你就可以选择向上爬一个阶梯或者爬两个阶梯。
* 请你找出达到楼层顶部的最低花费。在开始时，你可以选择从下标为 0 或 1 的元素作为初始阶梯。

* dp[i]定义：到达第 i 级阶梯的最小花费（不包含当前阶梯体力花费值cost[i]）

```go
func minCostClimbingStairs(cost []int) int {
    dp := make([]int, len(cost)+1)
    for i := 2; i <= len(cost); i++ {
        dp[i] = Min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2])
    }
    return dp[len(cost)]
}

func Min(x, y int) int {
    if x < y {
        return x
    }
    return y
}
```

### [最长递增子序列长度](https://leetcode-cn.com/problems/longest-increasing-subsequence)

* dp[i]定义：以下标i为结尾的最长递增子序列长度

```go
func lengthOfLIS(nums []int) int {
  dp := make([]int, len(nums))
  for i := 0; i < len(dp); i++ {
    dp[i] = 1
  }
  for i := 0; i < len(nums); i++ {
    for j := 0; j < i; j++ {
      if nums[j] < nums[i] {
        dp[i] = max(dp[i], dp[j]+1)
      }
    }
  }
  sort.Ints(dp)
  return dp[len(dp)-1]
}

func max(a, b int) int {
  if a > b {
    return a
  }
  return b
}
```

### [最长等差子序列长度](https://leetcode-cn.com/problems/longest-arithmetic-subsequence-of-given-difference)

* 该题和上一题最大的区别为，利用做差可以直接得到等差数列前一个值，不必进行一次循环，否则会超时

```go
func longestSubsequence(arr []int, difference int) (res int) {
  m := make(map[int]int)
  for _, num := range arr {
    m[num] = m[num - difference] + 1
    if m[num] > res {
      res = m[num]
    }
    // fmt.Println("m:", m)
  }
  return
}
```

### [环绕字符串中唯一的子字符串](https://leetcode.cn/problems/unique-substrings-in-wraparound-string/)
* 把字符串 s 看作是 “abcdefghijklmnopqrstuvwxyz” 的无限环绕字符串，所以 s 看起来是这样的：
	* "...zabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcd...." .
* 现在给定另一个字符串 p 。返回 s 中 唯一 的 p 的 非空子串 的数量 。
* 思路：定义dp[n]为以字符ch-'a'结尾的最大字符串长度，最后累加dp中各项和
* 例如"abcd"，dp[0] = 1, dp[1] = 2, dp[2] = 3, dp[3] = 4

```go
func findSubstringInWraproundString(p string) (res int) {
  dp := make([]int, 26)
  cnt := 1
  for i, ch := range p {
    if i > 0 && (byte(ch)-p[i-1]+26) % 26 == 1 {
      cnt++
    } else {
      cnt = 1
    }
    dp[ch-'a'] = Max(dp[ch-'a'], cnt)
  }
  for _, num := range dp {
    res += num
  }
  return
}
```
