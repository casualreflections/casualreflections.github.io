---
layout:     post
title:      Finding the Diameter of a Binary Tree
date:       2015-01-16 07:21:29
description:    Given a binary tree, find the length of the longest node to node path in a binary tree
summary:    Finding out the longest node to node path in a binary tree
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---
The diameter of a tree (sometimes called the width) is the number of nodes on the longest path between two leaves in the tree. The diagram below shows two trees each with diameter nine, the leaves that form the ends of a longest path are shaded (note that there is more than one path in each tree of length nine, but no path longer than nine nodes).
{% highlight java %}
/**
 * http://www.geeksforgeeks.org/diameter-of-a-binary-tree/
 * @param root Root of the tree for which diameter has to be found out
 * @return
 */
public static int getDiameter(Tree root){
    int leftHeight = findHeight(root.left);
    int rightHeight = findHeight(root.right);
    int leftDia = getDiameter(root.left);
    int rightDia = getDiameter(root.right);
    return Math.max(leftHeight+rightHeight, Math.max(leftDia, rightDia));
}
/**
 * Finding the Height of a node in a binary tree
 * @param root
 * @return
 */
public static int findHeight(Tree root){
    if (root == null)
        return 0;
    return 1 + Math.max(findHeight(root.left),findHeight(root.right));
}
{% endhighlight %}