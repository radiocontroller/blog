# DFS
#### Depth-First-Search（深度优先遍历）
#### 三个重点
* 剪枝
* 向下递归
* 往上回溯
---

### [复原 IP 地址](restore-ip-addresses)

<details>

<summary>点击展开go实现</summary>

```go
func restoreIpAddresses(s string) []string {
  res := []string{}
  segments := []string{}
  execute(s, 0, segments, &res)
  return res
}

func execute(s string, startIndex int, segments []string, res *[]string) {
  if startIndex >= len(s) {
    if len(segments) == 4 {
      ip := strings.Join(segments, ".")
      *res = append(*res, ip)
    }
    return
  }

  // 剪枝：ip段长度已经 >= 4
  if len(segments) >= 4 {
    return
  }

  // 剪枝：当前要分割的长度太长，即使都是3位ip，也多余，因此无效
  if len(s)-startIndex > (4-len(segments))*3 {
    return
  }

  if s[startIndex] == '0' {
    segments = append(segments, "0")
    // 向下递归
    execute(s, startIndex+1, segments, res)
    return
  }

  // ip最长3位
  for i := startIndex; i <= startIndex+2; i++ {
    if i == len(s) {
      break
    }

    ip, _ := strconv.Atoi(s[startIndex:i+1])
    if ip > 255 {
      break
    }

    segments = append(segments, s[startIndex:i+1])
    fmt.Println("i:", i, "segments:", segments)

    // 向下递归
    execute(s, i+1, segments, res)

    // 往上回溯
    segments = segments[:len(segments)-1]
  }
}
```

</details>

### [N 皇后](https://leetcode-cn.com/problems/n-queens/)

<details>

<summary>点击展开go实现</summary>

```go
func solveNQueens(n int) [][]string {
  chess := make([][]int, n)
  for i := 0; i < n; i++ {
    chess[i] = make([]int, n)
  }
  res := make([][]string, 0)
  Backtrace(n, 0, chess, &res)
  fmt.Println("res:", res)
  return res
}

// row代表行，每一行只能有一个皇后，因此当前条件满足后，递归的时候直接向下一行
// 避免了双重循环暴力尝试每一个点，重复导致的超时现象
func Backtrace(n int, row int, chess [][]int, res *[][]string) {
  if row == n {
    TransferResult(chess, res)
    fmt.Println("chess: ", chess)
    return
  }
  for j := 0; j < n; j++ {
    if !IsAvailable(chess, row, j) {
      continue
    } else {
      chess[row][j] = 1
      Backtrace(n, row+1, chess, res)
      chess[row][j] = 0
    }
  }
}

func IsAvailable(chess [][]int, i, j int) bool {
  for n := 0; n < len(chess); n++ {
    // j列上是否有棋子
    if chess[n][j] == 1 {
      return false
    }
    for m := 0; m < len(chess[0]); m++ {
      // i行上是否有棋子
      if chess[i][m] == 1 {
        return false
      }
      // 两条斜线上是否有棋子
      if (n - m == i - j || n + m == i + j) && chess[n][m] == 1 {
        return false
      }
    }
  }
  return true
}

func TransferResult(chess [][]int, res *[][]string) {
  subRes := make([]string, 0)
  for i := 0; i < len(chess); i++ {
    var row []byte
    for j := 0; j < len(chess[0]); j++ {
      if chess[i][j] == 1 {
        row = append(row, 'Q')
      } else {
        row = append(row, '.')
      }
    }
    subRes = append(subRes, string(row))
  }
  *res = append(*res, subRes)
  return
}
```

</details>


### [划分为k个相等的子集](https://leetcode.cn/problems/partition-to-k-equal-sum-subsets/)
* 思路：想象有k个桶，不断把num往里加，如果加不进去则不满足，否则能划分为k个相等子集（区别于以上的dfs模版）
* 题解：https://leetcode.cn/problems/partition-to-k-equal-sum-subsets/solution/by-lcbin-92ll/
```go
func canPartitionKSubsets(nums []int, k int) bool {
  var sum int
  for _, v := range nums {
    sum += v
  }
  if sum % k > 0 {  // 不能整除
    return false
  }
  sum /= k
  n := len(nums)
  cur := make([]int, k)

  var dfs func(i int) bool
  dfs = func(i int) bool {
    if i == n {
      return true
    }

    for j := 0; j < k; j++ {
      if j > 0 && cur[j] == cur[j-1] { // 优化
        continue
      }

      cur[j] += nums[i]
      if cur[j] <= sum && dfs(i+1) {
        return true
      }
      cur[j] -= nums[i]
    }

    return false
  }

  sort.Sort(sort.Reverse(sort.IntSlice(nums))) // 倒序排序，让大的先往里加，可以提早退出
  return dfs(0)
}
```
