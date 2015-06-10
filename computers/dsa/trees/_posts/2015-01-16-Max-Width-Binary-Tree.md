---
layout:     post
title:      Max Width of a Binary Tree
date:       2015-01-16 05:21:29
summary:    Finding the maximum width of any level in a binary tree
categories: [computers,dsa,trees]
post_format: [ ]
---

For solving this problem we use level order traversal, putting the next level nodes in a new queue.

{% highlight java %}

/**
 * PseudoCode for MaxWidth
 * start with list containing just the trees root. call it CurrNodes.
 * maxWidth = 1;
 * start with empty list. call it NextNodes.
 * while(CurrNodes is not empty) {
 *      get all children of nodes in CurrNodes and add them to NextNodes
 *      if number of children is > maxWidth, # of children is the new maxWidth
 *          CurrNodes = NextNodes
 *          NextNodes = empty.
 * }
 * http://www.geeksforgeeks.org/maximum-width-of-a-binary-tree/
 * @param root
 */
public static int maxWidthBinaryTree(Tree root){
    // do a level order traversal and at each level update the count
    // of that level save the count into max if its greater than previous max
    Queue<Tree> queue = new LinkedList();
    queue.add(root);
    Queue<Tree> nextQueue = new LinkedList();
    int maxWidth = 1 ;
    while(!queue.isEmpty() && nextQueue.isEmpty()){
        Tree temp = queue.remove();
        if (temp.left != null)
            nextQueue.add(temp.left);
        if (temp.right != null)
            nextQueue.add(temp.right);
        if (queue.isEmpty()){
            if (maxWidth < nextQueue.size())
                maxWidth = nextQueue.size();
            queue = nextQueue;
        }
    }
    return maxWidth;
}
{% endhighlight %}