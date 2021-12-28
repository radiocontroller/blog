# 拓扑排序
#### 有向无环图，可以记录做成某件事的前置条件
---

### [207. 课程表](https://leetcode-cn.com/problems/course-schedule/)
```go
func canFinish(numCourses int, prerequisites [][]int) bool {
  g := make(map[int][]int)            // 从【先修课程】到【学习课程】的邻接表
  indegree := make([]int, numCourses) // 入度表
  for _, p := range prerequisites {
    a, b := p[0], p[1]
    g[b] = append(g[b], a)
    indegree[a]++
  }
  q := make([]int, 0) // 入度为0的集合【即源头】
  for i := 0; i < numCourses; i++ {
    if indegree[i] == 0 {
      q = append(q, i)
    }
  }
  for len(q) > 0 {
    b := q[0]
    numCourses-- // 出队时numCourses减 1
    q = q[1:]
    for _, a := range g[b] {
      if indegree[a]--; indegree[a] == 0 { // 该顶点的前驱节点已经被 “删除”
        q = append(q, a)
      }
    }
  }
  return numCourses == 0 // 如果DAG中不存在环，那么每个顶点都会入队并出队，最终numCourses会为0
}
```

### [5947. 从给定原材料中找到所有可以做出的菜](https://leetcode-cn.com/problems/find-all-possible-recipes-from-given-supplies/)
```go
func findAllRecipes(recipes []string, ingredients [][]string, q []string) (ans []string) {
	g := make(map[string][]string) // 从【原材料】指向【菜】的邻接表
	indegree := make(map[string]int)  // 入度表
	for i, r := range recipes {
		for _, ingre := range ingredients[i] {
			g[ingre] = append(g[ingre], r)
			indegree[r]++
		}
	}
	for len(q) > 0 {
		supply := q[0]
		q = q[1:]
		for _, r := range g[supply] {
			if indegree[r]--; indegree[r] == 0 { // 该顶点的前驱节点已经被 “删除”，也就是说某道菜可以做成
				ans = append(ans, r)
				q = append(q, r)
			}
		}
	}
	return
}
```
