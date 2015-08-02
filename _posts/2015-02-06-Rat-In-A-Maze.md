---
layout:     post
title:      Rat In a Maze Problem
date:       2015-02-06 20:00:29
description: To help the hungry rat in reaching nxn cell of the array when starting from (0,0)
summary:    To help the hungry rat in reaching nxn cell of the array when starting from (0,0)
categories: [dsa, computers , backtracking]
share: true
comments: true
post_format: [ ]
---
A Maze is given as N*N binary matrix of blocks where source block is the upper left most block i.e., maze[0][0] and destination block is lower rightmost block i.e., maze[N-1][N-1]. A rat starts from source and has to reach destination. The rat can move only in two directions: forward and down.
In the maze matrix, 0 means the block is dead end and 1 means the block can be used in the path from source to destination. Note that this is a simple version of the typical Maze problem. For example, a more complex version can be that the rat can move in 4 directions and a more complex version can be with limited number of moves.
{% highlight java %}
public static int ratInAMaze(int [][] input, int [][] output, int x, int y){
    // Check if the solution path exists by traversing to the right side
    // Check if the solution path exists by traversing to down
    // If the solution exists then mark the current cell as one in the solution matrix
    // Else mark it as zero
    // Finally if the 0,0 contains a 1 then solution path exists
    if (input[x][y]==0)
        return 0;
    if (x== input.length-1 && y == input.length-1) {
        return 1;
    } else  {
        if (x+1<input.length)
            output[x][y] = ratInAMaze(input,output,x++,y);
        if (y+1<input.length)
            output[x][y] = ratInAMaze(input,output,x,y++);
        if (output[x][y] == 1){
            return 1;
        }
    }
    return 0;
}
{%endhighlight%}