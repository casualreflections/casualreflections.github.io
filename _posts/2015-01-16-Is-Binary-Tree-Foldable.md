---
layout:     post
title:      Is the binary tree foldable?
date:       2015-01-16 06:21:29
description:    Finding out whether the input binary tree can be folded via an imaginary vertical line passing through its root node.
summary:    How to find if the input binary tree can be folded, i.e. if the left tree is a mirror image of right tree.
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---

How to find if the input binary tree can be folded, i.e. if the left tree is a mirror image of right tree.

{% highlight java %}
/**
 * http://www.geeksforgeeks.org/foldable-binary-trees/
 * One approach is to create mirror of a tree and check
 * if its same as the given tree.
 * Another approach could be to traverse it recursively.
 * @param root
 * @return
 */
public static boolean isFoldableBST(Tree root){
    if (root.left == null && root.right == null) {
        return true;
    }else if (root.left != null && root.right == null){
        return false;
    } else if (root.right != null && root.left == null){
        return false;
    } else {
        return isFoldableBST(root.left, root.right);
    }
}
/**
 * Working method for isFoldableBST(root);
 * after the children are passed
 * @param left
 * @param right
 * @return
 */
public static boolean isFoldableBST(Tree left, Tree right){
    if (left.left == null && left.right == null &&
            right.left == null && right.right == null){
        return true;
    }
    if (left.left == null && right.right == null){
        return isFoldableBST(left.right,right.left);
    } else if (left.right == null && right.left == null) {
        return isFoldableBST(left.left, right.right);
    } else if (left.left != null && left.right != null &&
            right.left != null && right.right != null){
        return isFoldableBST(left.right,right.left)
                & isFoldableBST(left.left, right.right);
    } else  {
        return false;
    }
}
{% endhighlight %}
