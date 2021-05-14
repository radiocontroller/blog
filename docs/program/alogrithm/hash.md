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

### [两数之和](https://leetcode-cn.com/problems/two-sum/)
* 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那两个整数，并返回它们的数组下标。
* 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
```go
func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    result := make([]int, 2)

    for idx, num := range nums {
        sub := target - num
        if subIndex, ok := m[sub]; ok {
            result[0] = idx
            result[1] = subIndex
            return result
        }
        m[num] = idx
    }

    return result
}
```
  
