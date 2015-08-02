---
layout:     post
title:      Check if a binary tree is binary search tree
date:       2015-01-18 22:47:29
description:    Efficient algorithm to find if a given binary tree is a valid binary search tree
summary:    Efficient algorithm to find if a given binary tree is a valid binary search tree
categories: [computers,dsa,trees]
post_format: [ ]
share: true
---
## Algorithm:

/**
 * Dummy Method for checkIfBST(Tree, int, int)
 * @param root
 * @return
 */
public static boolean checkIfBST(Tree<Integer> root){
    return checkIfBST(root, Integer.MIN_VALUE,Integer.MAX_VALUE);
}

/**
 * Checks if a given Tree is a Binary search tree
 * @param root
 * @param min
 * @param max
 * @return
 */
public static boolean checkIfBST(Tree<Integer> root, int min, int max){
    if (root == null)
        return true;
    if (root.left != null && root.left.value > root.value)
        return false;
    if (root.right != null && root.right.value < root.value)
        return false;
    if(root.left != null && root.left.value > max){
        return false;
    } else if(root.left != null)
        max = Math.min(root.left.value, max);
    if(root.right != null && root.right.value < min){
        return false;
    } else if (root.right != null)
        min = Math.max(root.right.value, min);
    return checkIfBST(root.left,Integer.MIN_VALUE,max) & checkIfBST(root.right,min,Integer.MAX_VALUE);
}