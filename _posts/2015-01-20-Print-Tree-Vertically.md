---
layout:     post
title:      Print Tree Vertically
date:       2015-01-20 19:21:29
description:    Given a binary Tree, print it vertically
summary: Given a binary tree, print it vertically
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---
Given a binary tree, print it vertically. The following example illustrates vertical order traversal.

{% highlight java %}
	  .
          1
        /    \
       2      3
      / \    / \
     4   5  6   7
             \   \
              8   9 
               
			  
The output of print this tree vertically will be:
4
2
1 5 6
3 8
7
9 
{% endhighlight %}

{% highlight java %}
public static class DoublyLL<E>{
    E data;
    DoublyLL<E> next;
    DoublyLL<E> previous;
}

public static void printTreeVerticalOrder(Tree node){
    CustomLinkedList.DoublyLL<List> newList = new CustomLinkedList.DoublyLL<List>();
    newList.data = new LinkedList();
    printTreeVerticalOrder(node,newList);
    CustomLinkedList.DoublyLL temp = newList;
    while (temp.previous != null){
        temp = temp.previous;
    }
    while (temp.next != null){
        System.out.println(temp.data);
        temp = temp.next;
    }
}
/**
 * Print Tree Vertical Order
 * @param node
 * @param inputList
 */
public static void printTreeVerticalOrder(Tree node, CustomLinkedList.DoublyLL<List> inputList){
  if(node.left !=null){
      if (inputList.previous!=null){
          inputList.data.add(node.left);
      } else {
          inputList.previous = new CustomLinkedList.DoublyLL<List>();
          inputList.previous.next = inputList;
          inputList.previous.data = new LinkedList();
          inputList.previous.data.add(node.left);

      }
      printTreeVerticalOrder(node.left,inputList.previous);
  }
  if(node.right!=null){
      if (inputList.next != null){
          inputList.data.add(node.right);
      } else {
          inputList.next = new CustomLinkedList.DoublyLL<List>();
          inputList.next.data = new LinkedList();
          inputList.next.previous = inputList;
          inputList.next.data.add(node.right);
      }
      printTreeVerticalOrder(node.right,inputList.next);
  }
}
{% endhighlight %}
