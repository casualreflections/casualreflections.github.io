---
layout:     post
title:      Print all nodes in a binary tree that are at a distance k from a leaf node
date:       2015-01-21 22:21:29
summary:    Given a Binary Tree and a positive integer k, print all nodes that are distance k from a leaf node. 
categories: [computers,dsa,trees]
post_format: [ ]
---
Given a Binary Tree and a positive integer k, print all nodes that are distance k from a leaf node. 

{% highlight java %}
	  .
          1
        /    \
       2      3
      / \    / \
     4   5  6   7
             \   \
              8   9


The output for the above tree for k=1 will be
2,6,7

For k=2 the solution would be:
1,3


{% endhighlight %}

{% highlight java %}
 /**
 *
 * @param node
 * @param k
 */
public static void printNodesDistanceKromLeafNode (Tree node, int k){
    // Create an array with all the indices
    Queue<Tree> queue = new LinkedList<Tree>();
    queue.add(node);
    int index =0;
    List arrayList = new ArrayList();
    List auxarray = new ArrayList();
    while (!queue.isEmpty()){
        Tree temp = queue.remove();
        arrayList.add(index, temp);
        auxarray.add(index, false);
        index++;
        if (temp.left == null && temp.right == null){
            // leaf node found print the parent at distance k
            // from the array that we have created
            int t = k;
            int tempIndex = index;
            while (t >=0) {
                t--;
                tempIndex = tempIndex/2;
            }
            if (auxarray.get(tempIndex) == false) {
                System.out.println(arrayList.get(tempIndex));
                auxarray.set(index, true);
            }
        }
        if (temp.left != null){
            queue.add(temp.left);
        }
        if (temp.right != null){
            queue.add(temp.right);
        }
    }

}
{% endhighlight %}
