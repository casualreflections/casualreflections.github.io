---
layout:     post
title:      Print Nodes with no siblings
date:       2015-01-22 07:21:29
description:    Given a Binary Tree, print all nodes that don’t have a sibling
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---
Given a Binary Tree, print all nodes that don’t have a sibling (a sibling is a node that has same parent. In a Binary Tree, there can be at most one sibling). Root should not be printed as root cannot have a sibling. excerpt_seperator

{% highlight java %}
 public static void printNodesWithNoSiblings(Tree root){
        if (root == null) {
            return;
        }
        else if (root.left != null && root.right == null){
            System.out.println(root.left.value);
            printNodesWithNoSiblings(root.left);
        } else if (root.right != null && root.left == null) {
            System.out.println(root.right.value);
            printNodesWithNoSiblings(root.right);
        } else {
            printNodesWithNoSiblings(root.left);
            printNodesWithNoSiblings(root.right);
        }
    }
{% endhighlight %}
