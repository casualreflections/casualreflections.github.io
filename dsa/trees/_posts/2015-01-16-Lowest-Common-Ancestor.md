---
layout:     post
title:      Lowest Common Ancestor of a Binary Tree
date:       2015-01-16 03:21:29
summary:    Finding the lowest common ancestor of a Binary Tree
categories: [computers,dsa,trees]
post_format: [ ]
---

Here we look at finding lowest common ancestor of a binary tree. Finding LCA of a BST is an easy application, comparatively for Binary Tree its a tough nut to crack.
The algo goes as follows:

1. Check if one of the numbers lie in the left sub tree.
2. Check if one of the numbers lie in the right sub tree.
3. If both 1,2 are true then return the current node.
   else recurse to the branch which is not null.

{% highlight java %}

/**
 * http://www.geeksforgeeks.org/lowest-common-ancestor-binary-tree-set-1/
 * Given a binary tree (not a binary search tree) and two values say n1 and n2,
 * write a program to find the least common ancestor.
 * Following is definition of LCA from Wikipedia:
 * Let T be a rooted tree. The lowest common ancestor between two nodes n1 and n2 is
 * defined as the lowest node in T that has both n1 and n2 as descendants
 * (where we allow a node to be a descendant of itself).
 * @param root
 * @param n1
 * @param n2
 * @return
 */
public static Tree<Integer> lowestCommonAncestor(Tree<Integer> root, int n1, int n2) {
    if (root == null)
        return null;
    if (root.value == n1 || root.value == n2) {
        return root;
    }
    else {
        Tree left = lowestCommonAncestor(root.left,  n1,  n2);
        Tree right = lowestCommonAncestor(root.right,  n1,  n2);
        if (left != null && right != null) {
            return root;
        } else {
            return (left != null ? left:right);
        }
    }
}
{% endhighlight %}