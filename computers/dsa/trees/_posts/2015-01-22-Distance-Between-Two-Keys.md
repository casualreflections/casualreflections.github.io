---
layout:     post
title:      Distance between two Keys
date:       2015-01-22 07:21:29
summary:    Find distance between two given keys of a Binary Tree
categories: [computers,dsa,trees]
post_format: [ ]
---

## Find distance between two given keys of a Binary Tree

Find the distance between two keys in a binary tree, no parent pointers are given. Distance between two nodes is the minimum number of edges to be traversed to reach one node from other.

## Algorithm:
* Find the root to leaf paths for both the leaves
* Traverse the paths and find out the first common point 
* Find the length from root to leaf paths till the first common point

{% highlight java %}

/**
 * Given 2 nodes and a tree root, find the shortest path in the tree
 * from key1 to key2
 * @param root
 * @param key1
 * @param key2
 */
public static void findDistanceBetweenTwoKeys(Tree root, int key1, int key2){
    List l1,l2;
    l1 = new LinkedList();
    l2 = new LinkedList();
    l1 = rootToLeafPath(root, key1,l1);
    l2 = rootToLeafPath(root, key2,l2);
    int size;
    int length=0;
    if (l1.size()>l2.size()){
        while (l1.size()>l2.size()) {
            l1.remove(l1.size() - 1);
            length++;
        }
    } else if (l1.size() < l2.size()) {
        while (l1.size() <l2.size()) {
            l2.remove(l2.size() - 1);
            length++;
        }
    }
    size = l2.size();
    while (l1.get(size)!=l2.get(size)){
        length++;            
    }
    System.out.println(length);
}
{% endhighlight %}
{% highlight java %}
/**
 * Given a tree root and a value k find the root to leaf path for
 * that key and insert the path into the given linked list
 * @param root
 * @param key
 * @param linkedList
 * @return
 */
public static List rootToLeafPath(Tree root, int key, List linkedList){
    List ll = new LinkedList(linkedList);
    if (root==null){
        return null;            
    }
    if (root.left == null && root.right == null) {
        if (root.value == key)
            return ll;
        else 
            return null;
    }
    if (root.left != null){
        ll.add(root.left);
        rootToLeafPath(root.left,key,ll);
    }
    if (root.right != null){
        ll.add(root.right);
        rootToLeafPath(root.right,key,ll);
    }
    return null;
}
{% endhighlight %}
