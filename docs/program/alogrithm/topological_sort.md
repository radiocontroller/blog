# 拓扑排序
#### 有向无环图，可以记录做成某件事的前置条件
---

### [5947. 从给定原材料中找到所有可以做出的菜](https://leetcode-cn.com/problems/find-all-possible-recipes-from-given-supplies/)
```go
func findAllRecipes(recipes []string, ingredients [][]string, q []string) (ans []string) {
	g := make(map[string][]string) // 从原材料指向菜的边
	degre := make(map[string]int) // 入度，即做成某到菜需要的原材料数
	for i, r := range recipes {
		for _, ingre := range ingredients[i] {
			g[ingre] = append(g[ingre], r)
			degre[r]++
		}
	}
	for len(q) > 0 {
		supply := q[0]
		q = q[1:]
		for _, r := range g[supply] {
			if degre[r]--; degre[r] == 0 { // 某道菜可以做成，添加进ans并且加入原材料中
				ans = append(ans, r)
				q = append(q, r)
			}
		}
	}
	return
}
```
