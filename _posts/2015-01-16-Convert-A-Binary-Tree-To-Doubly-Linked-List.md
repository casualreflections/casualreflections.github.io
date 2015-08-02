---
layout:     post
type:       post
title:      Convert a Binary Tree to Doubly Linked list
date:       2015-01-16 04:21:29
description: Given a Binary Tree, convert it into a Doubly Linked List
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---
Given a Binary Tree, convert it into a Doubly Linked List.

The idea behind its solution is quite simple and straight. excerpt_seperator

* If left subtree exists, process the left subtree
    * Recursively convert the left subtree to DLL.
    * Then find inorder predecessor of root in left subtree (inorder predecessor is rightmost node in left subtree).
    * Make inorder predecessor as previous of root and root as next of inorder predecessor.
* If right subtree exists, process the right subtree (Below 3 steps are similar to left subtree).
    * Recursively convert the right subtree to DLL.
    * Then find inorder successor of root in right subtree (inorder successor is leftmost node in right subtree).
    * Make inorder successor as next of root and root as previous of inorder successor.
* Find the leftmost node and return it (the leftmost node is always head of converted DLL).

{% highlight java %}
/**
 * http://www.geeksforgeeks.org/in-place-convert-a-given-binary-tree-to-doubly-linked-list/
 * Given a Binary Tree (Bt), convert it to a Doubly Linked List(DLL).
 * The left and right pointers in nodes are to be used as previous and next pointers respectively
 * in converted DLL. The order of nodes in DLL must be same as Inorder of the given Binary Tree.
 * The first node of Inorder traversal (left most node in BT) must be head node of the DLL.
 * @param root
 */
public static Tree convertTreeToDoublyLL(Tree root){
    if (root.left!=null){
        convertTreeToDoublyLL(root.left);
        // find the inorder predecessor and insert root to its end
        Tree temp = root.left;
        while (temp.right != null){
            temp = temp.right;
        }
        root.left=temp;
        temp.right=root;
    }
    if (root.right != null) {
        convertTreeToDoublyLL(root.right);
        // find the inorder successor and insert root to its beginning
        Tree temp = root.right;
        while (temp.left != null){
            temp = temp.left;
        }
        root.right = temp;
        temp.left = root;
    }
    return root;
}
{% endhighlight %}

Another approach could be to do an inorder traversal and successively connect the pointers of nodes.
But this approach would not work if we want to get a sorted linked list from a BST.