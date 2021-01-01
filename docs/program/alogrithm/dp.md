# 动态规划
---

### [爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)
* 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
* 解：要想达到 n 阶，那么你前一次肯定是在n - 1阶或 n - 2 阶，因此将这两种的方法相加即可

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