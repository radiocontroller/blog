# 图搜索算法(DFS, BFS)
---

![](/images/program/alogrithom/graph.png)

### TreeNode定义
```go
type TreeNode struct {
   Val int
   Left *TreeNode
   Right *TreeNode
}
```
### DFS
```go
// s表示从哪个点出发
func DFS(graph map[string][]string, s string) {
  stack := []string{s}
  seen := []string{s}
  for(len(stack) > 0) {
    length := len(stack)
    vertex := stack[length-1]
    stack = stack[:length-1]
    fmt.Println("vertex: ", vertex)

    nodes := graph[vertex]
    for _, node := range nodes {
      if !Contains(seen, node) {
        stack = append(stack, node)
        seen = append(seen, node)
      }
    }
  }
  return
}

func Contains(slice []string, target string) bool {
  for _, item := range slice {
    if item == target {
      return true
    }
  }
  return false
}

func main() {
  graph := make(map[string][]string)
  graph["A"] = []string{"B", "C"}
  graph["B"] = []string{"A", "C", "D"}
  graph["C"] = []string{"A", "B", "D", "E"}
  graph["D"] = []string{"B", "C", "E"}
  graph["E"] = []string{"C", "D", "F"}
  graph["F"] = []string{"E"}
  DFS(graph, "F")
  // 输出
  // vertex:  F
  // vertex:  E
  // vertex:  D
  // vertex:  B
  // vertex:  A
  // vertex:  C
}
```

### BFS
```go
// s表示从哪个点出发
func BFS(graph map[string][]string, s string) {
  queue := []string{s}
  seen := []string{s}
  for(len(queue) > 0) {
    vertex := queue[0]
    queue = queue[1:]
    fmt.Println("vertex: ", vertex)

    nodes := graph[vertex]
    for _, node := range nodes {
      if !Contains(seen, node) {
        queue = append(queue, node)
        seen = append(seen, node)
      }
    }
  }
  return
}

func Contains(slice []string, target string) bool {
  for _, item := range slice {
    if item == target {
      return true
    }
  }
  return false
}

func main() {
  graph := make(map[string][]string)
  graph["A"] = []string{"B", "C"}
  graph["B"] = []string{"A", "C", "D"}
  graph["C"] = []string{"A", "B", "D", "E"}
  graph["D"] = []string{"B", "C", "E"}
  graph["E"] = []string{"C", "D", "F"}
  graph["F"] = []string{"E"}
  BFS(graph, "F")
  // 输出
  // vertex:  F
  // vertex:  E
  // vertex:  C
  // vertex:  D
  // vertex:  A
  // vertex:  B
}
```

::: tip 相关链接

[https://www.bilibili.com/video/BV1Ks411579J/?spm_id_from=333.788.recommend_more_video.0](https://www.bilibili.com/video/BV1Ks411579J/?spm_id_from=333.788.recommend_more_video.0)

[https://juejin.cn/post/6844903807759941646](https://juejin.cn/post/6844903807759941646)

:::
