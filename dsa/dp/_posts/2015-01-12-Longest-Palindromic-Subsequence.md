---
layout:     post
title:      Longest Palindromic Subsequence
date:       2015-01-12 23:21:29
summary:    Arrays Test
categories: [dsa, computers, dp]
post_format: [ ]
---
{% highlight java %}
/**
 * Given a sequence, find the length of the longest palindromic subsequence in it.
 * For example, if the given sequence is “BBABCBCAB”, then the output should be 7
 * as “BABCBAB” is the longest palindromic subseuqnce in it. “BBBBB” and “BBCBB”
 * are also palindromic subsequences of the given sequence, but not the longest ones.
 *
 * The naive solution for this problem is to generate all subsequences of the given
 * sequence and find the longest palindromic subsequence. This solution is exponential
 * in term of time complexity. Let us see how this problem possesses both important
 * properties of a Dynamic Programming (DP) Problem and can efficiently solved
 * using Dynamic Programming.
 */
public int longestPalindromicSubsequenceNaive(List<Integer> arrayList){
    return longestPalindromicSubsequenceNaive(arrayList, 0,arrayList.size()-1);
}
public int longestPalindromicSubsequenceNaive(List<Integer> arrayList, int start, int end){
    if (start == end) {
        return 0;
    }
    if (arrayList.get(start) == arrayList.get(end)) {
        return 2 + longestPalindromicSubsequenceNaive(arrayList,start+1, end -1);
    } else {
        return Math.max(longestPalindromicSubsequenceNaive(arrayList, start+1,end),
                longestPalindromicSubsequenceNaive(arrayList, start, end-1));
    }

}
{% endhighlight %}

Now we look for a smarter solution using Memoisation, let us understand what exactly is happening during recursion.

We have a string of length n, we compare the first and last characters of the string, if they are equal then we recurse
passing start+1 and end -1 recursively and at this point.