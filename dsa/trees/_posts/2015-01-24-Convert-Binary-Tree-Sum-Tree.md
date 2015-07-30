---
layout:     post
title:      Convert an arbitrary binary tree into children sum tree
date:       2015-01-24 07:21:29
summary:    Given a binary tree, write a function that converts a given tree to one which satisfies children sum property.
categories: [computers,dsa,trees]
post_format: [ ]
---
// convert and arbitrary binary tree into children sum tree.

The idea is to write a simple recursive function convertTree(Tree node) and believe that this will convert the node passed into a node which holds the sum of its children.
This function will have to deal with 2 cases :
Case 1: when the parent is less than the sum of its children.
Case 2: when the parent is greater than the sum of its children .
For case 1, simply  add the difference to the parent node and leave it at that.
For case 2 , if the left node exists then add the difference to that node and keep adding the difference to all the nodes that follow below it to keep the children sum property unchanged . If the left node does not exist, then add the difference to the right node and keep adding it to all the right node that follow to keep the property unchanged in the rest of the tree. We can choose to increment the right child instead of left !

Code snippet
{% highlight java %}
Void convert(Tree node)
{
    //Base case 
    if (node == null || node.left == null && node.right == null)
    {
        return ;
    }
    else
    {
        convert(node.left);
        convert(node.right);
    
        if(node.left)
            leftchilddata = node.left.data;
        f(node.right)
            rightchilddata= node.right.data;
        
        diff = leftchilddata+rightchilddata-node.data;
        
        if(diff > 0)
        {
            node.data = node.data + diff;
        }
        id=f(diff < 0)
        {
            addDiff(node , -diff);
        }
    }
}

void addDiff(Tree node, int diff)
{
    if (node== null)
        return;
if(node.left!=null)
{
    node.left.data = node.left + diff;
    addDiff(node.left,diff);}
else if(node.right!=null)
{
    node.right.data = nopde.right + diff;
    addDiff(node.right, diff);
}
}


{% endhighlight %}
