---
layout:     post
title:      Difference Between include in C/C++ and import in java
date:       2015-01-10 23:21:29
summary:    What really happens when you type include directive in C and how is it really different from imports in java
description:    What really happens when you type include directive in C and how is it really different from imports in java
categories: [computers,java]
tags: [compiler, programming, languages]
share: true
comments: true
post_format: [ ]
---

 #include directive makes the compiler go to the C/C++ standard library and copy the code from the header files into the program. As a result the program size increases, thus wasting memory and processor's time.

 import statement makes the JVM go to the Java standard library, execute the code there and substitute the result into the program. Here no code is copied and hence no wastage of memory or processor's time. So, import is efficient mechanism than #include.
