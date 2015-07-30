---
layout:     post
title:      Print Ancestor Nodes
date:       2015-01-20 07:21:29
summary:    Given a node, print its ancestor nodes
categories: [computers,dsa,trees]
post_format: [ ]
---
If tree is:
{% highlight java %}
    .
    4
    /\
   3  7
  /\  /\
 6 4  8 9
{% endhighlight %}

Then, ancestors of 6 are 3 and 4
{% highlight java %}
/**
 * Print Ancestors of a given node in Binary Tree
 * Given a Binary Tree and a key, write a function that prints all the ancestors of the key in the given binary tree.
 * @param root
 */
public static boolean printAncestorsNode(Tree root, int target){
    if (root == null){
        return false;
    }
    if (root.value == target) {
        return true;
    }
    if (printAncestorsNode(root.left,target) || printAncestorsNode(root.right,target)) {
        System.out.println(root.value);
        return true;
    }
    return false;
}
{% endhighlight %}
