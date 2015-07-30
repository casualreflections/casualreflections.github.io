---
layout:     post
title:      Permutations of a given string
date:       2015-02-06 17:35:29
summary:    Given a string print all n! permutations of the string
categories: [dsa, computers , backtracking]
post_format: [ ]
---
A permutation, also called an “arrangement number” or “order,” is a rearrangement of the elements of an ordered list S into a one-to-one correspondence with S itself. A string of length n has n! permutation. 

{% highlight java %}
/**
 * http://www.geeksforgeeks.org/write-a-c-program-to-print-all-permutations-of-a-given-string/
 * Write a C program to print all permutations of a given string
 * @param array
 * @param i
 * @param n
 */
public static void printAllPermutations(char[] array, int i,int n){
    if (i==n){
        System.out.println(array);
    } else {
        for (int j=i;j<=n;j++){
            char temp = array[j];
            array[j] = array[i];
            array[i] = temp;
            
            printAllPermutations(array,i+1,n);
            
            // Backtrack
            temp = array[j];
            array[j] = array[i];
            array[i] = temp;
            
        }
    }
    
}
{% endhighlight %}
