---
layout: post
title: "Version Control with Git-Introduction"
date: 2015-07-26T02:52:58+05:30
categories: [blog,computers,linux]
summary: Learn the most loved version control system on the planet
description: Learn the most loved version control system on the planet
share:  true
comments:   true
featured: true
post_format: [ ]
---
This post will help you learn basics of Git version control system without delving deep into its finer details. Learn all the basic tricks that can be useful for day today operations.

##1. Git Introduction

Git is a Distributed Version Control System (DVCS).

In DVCS, clients dont just check out the latest snapshot of the files- they fully mirror the repository. Thus if server dies, and these systems were collaborating via it, any of the client repositories can be copied back up to the server to restore it.

Every checkout is a full backup of the data.

Other VCS store differences across revisions
![Other Version control systems]({{ site.baseurl }}/images/computers/linux/git_1.png)

On the other hand git stores snapshots of files which are modified in that particular revision
![Git]({{ site.baseurl }}/images/computers/linux/git_2.png)

###This separates git from every other version control system of previous generation.

Most operations in Git are local as client has entire history of the project. In git you can commit offline in your local branch. This may not seem like a huge deal, but you may be surprised what a big difference it can make.

### The Three States

Git has three main states where files can reside in: commited, modified and staged. Commited means that the data is safely stored in your local database.
Modified means that you have changed the file but have not commited to your database. Staged means that that you have marked a modified file in its current version to go into the next commit snapshot (git add filename).

For the first time setup name and email are required to be specified
{% highlight bash %}
$ git config --global user.name "Bhuvan Rawal"
$ git config --global user.email "bhuvan@bhuvanrawal.me"

$ git config --global cor.editor emacs

# To check your settings do:
$ git config --list
{% endhighlight %}

##2. Git Basics

{% highlight bash%}
# If you are creating a new git repository use the following command:

$ git init

# Then you can add files to staging area and commit them as shown below:
$ git add *.c
$ git add LICENCE
$ git commit -m 'initial project version'

{% endhighlight %}

### Cloning Existing repository:

If you want to get a replica of existing git repository for example a project you want to contribute to- the command is git clone.

Remember it is clone and not checkout, in git checkout has a different meaning. Instead of getting workingf copy, you get full copy of nearly all data the server has, every version of every file.

Example:
{% highlight bash%}
# To clone bhuvanrawal.github.io repository from github you can do this:
$ git clone https://github.com/bhuvanrawal/bhuvanrawal.github.io
#This creates a new directory bhuvanrawal.github.io and initialises it with .git directory

# To clone repository to a specific directory (bhuvan_site) use
$ git clone https://github.com/bhuvanrawal/bhuvanrawal.github.io bhuvan_site

{% endhighlight %}

### Recording changes to Reposiotry:

Each file in your working directory can be in one of two states: tracked or untracked.

Tracked files are files that were in the last snapshot; they can be unmodified, modified or staged. Untracked files are everything else, everything else that were not in the last snapshot and are not in your staging area.

When you first clone a repository, all your files will be tracked and unmodified. If you edit files, git sees them as modified, because you have changed them since your last commit.

![Git]({{ site.baseurl }}/images/computers/linux/git_3.png)

To check status of your files do:

{% highlight bash %}
$ git status
# If no file has been changed since the last snapshot it will display the following message:

On branch master

nothing to commit (create/copy files and use "git add" to track)

$ echo 'My Project' > README
$ git status
# As we have added a new file README it will show it as untracked

On branch master

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	README

nothing added to commit but untracked files present (use "git add" to track)

{% endhighlight %}

It can be seen that the new file README is untracked, Untracked basically means that Git sees a file you didnt have in the previous snapshot.

### Tracking New Files:
{% highlight bash %}
$ git add README

# If we run the status command again, it will show that README is tracked and staged to be commited

$ git status
On branch master

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   README

{% endhighlight %}

### Staging Modified Files

If we change a file that was already tracked say pom.xml and then run *git status*

{%highlight bash%}
$git status
On branch master

Initial commit

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   pom.xml

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   pom.xml
{%endhighlight%}

How can this possible? pom.xml is listed as both staged and unstaged.

Its because Git stages a file exactly as it when you run *git add* command.

If you commit now, git will commit the staged version of pom.xml and not modified one. To move modified pom.xml run *git add* again.

### Short Status

While *git status* output is comprehensive, its quite lengthy. Git has short status flag so that you can see your changes in a more compact way. If you run *git status -r* or *git status --short* you get a far more simplified output.
 
 {%highlight bash%}
 $ git status -s
  M README
 MM pom.xml
 A  file.txt
 M  LICENSE
 ?? hibernate_config.xml
 {%endhighlight%}
 
New files that arent tracked have a *??* next to them.
New files that have been added to staging area have an *A*.
Modified file have an *M*.

There are two columns to the output - the left hand column indicates that the file is staged and the right hand column indicates that it's modified. For example file README is modified in working directory but not yet staged while pom.xml is modified in working directory and staged as well.

### Ignoring files

To ignore files from being moved to staging area / getting commited add them to `.gitignore` file

The rules for patterns in .gitignore are as follows:

* Blank lines or lines starting with `#` are ignored.
* Standard glob patterns work.
* You can end patterns with a forward slash *(/)* to specify directory
* To neglect patters start it with exclamation point *(!)*

Examples:
*.out           # ignore all .out files
!req.out        # make an exception for req.out
/pom.xml        # only ignore root pom.xml
build/          # ignore build directory and all its files
*Service/*.java # ignore all java files containing Service in them

Github maintains a fairly comprehensive list of good .gitignore files, they can be found at:

[Github gitignore list](https://github.com/github/gitignore)

### Viewing Diff for staged and unstaged changes

Although git status tells which files have been staged or modified but it doesnt really tell much about what changes have been made in individual files. To view what has been changed but not yet staged, type git diff with no other arguments.

{%highlight bash%}
$ git diff
diff --git a/pom.xml b/pom.xml
index 13968d1..5f6227c 100644
--- a/pom.xml
+++ b/pom.xml
@@ -1 +1 @@
+First commit into pom.xml \n a newline 
{%endhighlight%}

`git diff` compares what is in the working directory with staging area. 

To see what has been staged and will go in the next commit use `$ git diff --staged`

### Commiting the changes

If the staging area is set up, changes can be commited. Remember anything that is still unstaged will not go in this commit. The simplest way to commit is to type git commit:

'git commit'

Doing so will launch the editor usually vim/emacs, or the one we had set up in `$ git config --global core.editor`. The message has git status of the files changed commented out, they can be uncommented if you want leave it in the message.

Instead of status if you want to view diff in the message type `$ git commit -v`

Alternatively, commit message can be typed inline with -m flag:

`$ git commit -m "SNAPDEALTECH-55080: removing unused jsp's"`

The output of commit will be SHA-1 checksum of the commit, how many files were changed, branch in which it was commited and statistics about the lines.

### Skip staging area:

To skip staging area and commit all the files in working directory type:

`$ git commit -a -m "Commiting all the files directly from working directory"`

### Removing files from git

To remove files from git it is required to untrack them. `git rm <filename>` untracks the file. 

If the file has been modified use -f flag. This is an extra saftey measure to prevent accidental removal of data that hasnt been recorded in a snapshot and cant be recovered from git.

### Viewing the commit history

To view the commit history in the current repository type:

`$ git log`

By default commits are shown in reverse chronological order. Many different options exist for viewing exactly what is required.

One of the most helpful options is -p, which shows the difference introduced in each commit. You can also use `-<number>` to view diffs of those many commits.

To view diff of last three commits use the following command:

`$ git log -p -3`

To view short stats of each commit use `--stat` option.

`$ git log --stat`
