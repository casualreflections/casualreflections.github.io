---
layout:     post
title:      Get all leaves of a binary tree
date:       2015-01-18 22:47:29
summary:    Printing all children of a Binary Tree
categories: [computers,dsa,trees]
post_format: [ ]
---
## Algorithm:

* Traverse through the tree recursively.
* If both the chilren of node are null print the node
* else recurse through left subtree and right subtree

{% highlight java %}

/**
 * Method to print all leaves of a Binary Tree
 * @param root
 * @param leaves
 */
public static void getAllLeaves(Tree root, List<Tree> leaves){
    if (root.left == null && root.right == null){
        leaves.add(root);
        return;
    }
    if (root.left != null)
        getAllLeaves(root.left, leaves);
    if (root.right != null)
        getAllLeaves(root.right, leaves);
}
{% endhighlight %}