# 哈希表
---

### [两个数组的交集 II](https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/)
* 给定两个数组，编写一个函数来计算它们的交集。
```go
func intersect(nums1 []int, nums2 []int) []int {
	if len(nums1) > len(nums2) {
		return intersect(nums2, nums1)
	}

	res := []int{}
	numMap := map[int]int{}
	for _, val := range nums1 {
		numMap[val] ++
	}

	for _, val := range nums2 {
		if numMap[val] > 0 {
			numMap[val] --
			res = append(res, val)
		}
	}

	return res
}
```
* 1. 时间复杂度：O(m+n)
* 2. 空间复杂度：O(min(m,n))