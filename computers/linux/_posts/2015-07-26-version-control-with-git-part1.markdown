---
layout: post
title: "Version Control with Git-Part1"
date: 2015-07-26T02:52:58+05:30
categories: [computers,linux]
summary: Learn the most loved version control system on the planet
---
##1. Git Introduction

Git is a Distributed Version Control System (DVCS).

In DVCS, clients dont just check out the latest snapshot of the files- they fully mirror the repository. Thus if server dies, and these systems were collaborating via it, any of the client repositories can be copied back up to the server to restore it.

Every checkout is a full backup of the data.

Other VCS store differences across revisions
![Other Version control systems]({{ site.baseurl }}/img/computers/linux/git_1.png)

On the other hand git stores snapshots of files which are modified in that particular revision
![Git]({{ site.baseurl }}/img/computers/linux/git_2.png)

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

To check your settings do:
$ git config --list
{% endhighlight %}

##2. Git Basics

{% highlight bash%}
If you are creating a new git repository use the following command:

$ git init

Then you can add files to staging area and commit them as shown below:
$ git add *.c
$ git add LICENCE
$ git commit -m 'initial project version'

{% endhighlight %}

### Cloning Existing repository:

If you want to get a replica of existing git repository for example a project you want to contribute to- the command is git clone.

Remember it is clone and not checkout, in git checkout has a different meaning. Instead of getting workingf copy, you get full copy of nearly all data the server has, every version of every file.

Example:
{% highlight bash%}
To clone bhuvanrawal.github.io repository from github you can do this:
$ git clone https://github.com/bhuvanrawal/bhuvanrawal.github.io
This creates a new directory bhuvanrawal.github.io and initialises it with .git directory

To clone repository to a specific directory (bhuvan_site) use
$ git clone https://github.com/bhuvanrawal/bhuvanrawal.github.io bhuvan_site

{% endhighlight %}

### Recording changes to Reposiotry:

Each file in your working directory can be in one of two states: tracked or untracked.

Tracked files are files that were in the last snapshot; they can be unmodified, modified or staged. Untracked files are everything else, everything else that were not in the last snapshot and are not in your staging area.

When you first clone a repository, all your files will be tracked and unmodified. If you edit files, git sees them as modified, because you have changed them since your last commit.

![Git]({{ site.baseurl }}/img/computers/linux/git_3.png)

To check status of your files do:

{% highlight bash %}
$ git status
If no file has been changed since the last snapshot it will display the following message:

On branch master

nothing to commit (create/copy files and use "git add" to track)

$ echo 'My Project' > README
$ git status

As we have added a new file README it will show it as untracked
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

If we run the status command again, it will show that README is tracked and staged to be commited

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

To ignore files from being moved to staging area / getting commited add them to *.gitignore* file

The rules for patterns in .gitignore are as follows:

* Blank lines or lines starting with *#* are ignored.
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

[Github gitignore list](https://github.com/gitignore)

