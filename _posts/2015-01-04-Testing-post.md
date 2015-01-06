---
layout:     post
title:      Creating your own WebPage using gh-pages
date:       2015-01-04 23:21:29
summary:    Create your own free webpage using Pixyll-Jekyll, host it on github pages or your own domain.s
categories: jekyll pixyll
---

## This tutorial will help you set up your own webpage using github pages and Pixyll-jekyll

## Prerequisites

* A github account.
* A domain name by your name, if you want it that way. (Else by default it will be created as <yourGithubname>.github.io)
* A cloudFlare account(in case if you want to get it hosted on your own domain).

## Creating your own page using github account

* Create a new repository with the name <yourgithubusername.github.io> make sure you mark it public.
* Click on "Create repository"
* In the next page click on Import code
* In the existing repository URL give [link] https://github.com/johnotander/pixyll.git
* Now your webpage repository is set up.
* Create a new directory in your local system, get inside that directory and follow the next step.
* Pull the repository into your own local system. The steps can be followed from the following link: [link] https://help.github.com/articles/fork-a-repo/

## Making modifications to _config.yml & CNAME

* Open _config.yml and make changes as follows.
 * Give the title of your page, email, author and description.
 * In the URL give http://<yourgithubname>.github.io
 *  Give animated as true
 * In social icons add your github name, stackoverflow id, twittername, etc. Google plus name should start with +. If your gmail id is test@gmail.com, give it as +test. Do not add @ in linkedin URL.
 * Give the following inputs in Build Settings 
		<# Build settings
		markdown: kramdown
		permalink: /:year/:month/:title/
		paginate: 5
		sass:
		compressed: true>
 *  Save and exit the file
 * Open the file CNAME and input your website address as <yourname>.github.io, remember it should not be appended with http/https. For example in my CNAME file I have put bhuvanrawal.github.io
* Make changes to the files in _posts directory, create your own markdown files and save it there, make sure you copy the syntax of the header.
*  Install ruby on your system, also install ruby-devel/ruby-dev (depending on your system)
 * Install gem
 * execute: gem install jekyll
 * after gem is installed execute jekyll build. Make sure you're in the directory of your newly checked out repository.
* Commit the changes and push them to your repository.
 * If there are any errors in your configuration github will email you for making changes.
* The website will go live in within 30 mins.
* Play around with the site and create new layouts new pages.
* Make sure you give appropriate credits to the original developer of pixyll. [link]https://github.com/johnotander
* In case of any difficulty, contact me @ bhuvan (at) bhuvanrawal (dot) me
 
