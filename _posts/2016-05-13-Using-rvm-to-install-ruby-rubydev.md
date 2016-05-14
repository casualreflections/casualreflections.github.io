---
layout: post
title: "Use rvm to install ruby on Ubuntu"
date: 2016-08-01T02:52:58+05:30
categories: [Ruby, Languages, Setup]
tags: [Ruby, Languages, Setup]
summary: Ease your brains - use rvm to manage ruby installations
description: Install and use ruby using rvm on linux
share:  true
comments:   true
featured: true
post_format: [ ]
---

> I have tried installing ruby on ubuntu by multiple ways over the years as this site is built on jekyll, a rubygem which requires ruby, its always difficult to set up but recently I tried rvm.io and it ended up being a 3 command process, lightening fast.

## The below steps should be executed as root, change to root user:

{% highlight bash %}
$ sudo su
{% endhighlight %}

## In order to proceed with RVM install, fetch the rvm public key into system

{% highlight bash %}
$ apt-get install curl
$ gpg --import mpapis.asc
{% endhighlight %}

## Then download the RVM installer with curl and execute it (by piping the curl output to bash):
{% highlight bash %}
$ curl -sSL https://get.rvm.io | bash -s stable
{% endhighlight %}

## We now need to build the RVM environment, in order to do that source the rvm.sh file into the env:
{% highlight bash %}
$ source /etc/profile.d/rvm.sh
{% endhighlight %}

## Install the ruby dependencies
{% highlight bash %}
$ rvm requirements
{% endhighlight %}

## To show the available packages do `rvm list`:
{% highlight bash %}
# rvm list known
# MRI Rubies
[ruby-]1.8.6[-p420]
[ruby-]1.8.7[-head] # security released on head
[ruby-]1.9.1[-p431]
[ruby-]1.9.2[-p330]
[ruby-]1.9.3[-p551]
[ruby-]2.0.0[-p648]
[ruby-]2.1[.8]
[ruby-]2.2[.4]
[ruby-]2.3[.0]
[ruby-]2.2-head
ruby-head

# for forks use: rvm install ruby-head-<name> --url https://github.com/github/ruby.git --branch 2.2

# JRuby
jruby-1.6[.8]
jruby-1.7[.23]
jruby[-9.0.5.0]
jruby-head

# Rubinius
rbx-1[.4.3]
rbx-2.3[.0]
rbx-2.4[.1]
rbx[-2.5.8]
rbx-head

# Opal
opal

# Minimalistic ruby implementation - ISO 30170:2012
mruby[-head]

# Ruby Enterprise Edition
ree-1.8.6
ree[-1.8.7][-2012.02]

# GoRuby
goruby

# Topaz
topaz

# MagLev
maglev[-head]
maglev-1.0.0

# Mac OS X Snow Leopard Or Newer
macruby-0.10
macruby-0.11
macruby[-0.12]
macruby-nightly
macruby-head

# IronRuby
ironruby[-1.1.3]
ironruby-head

{% endhighlight %}

## Install the preferred version using `rvm install <version number>`

{% highlight bash %}
$ rvm install 2.3.0

# Now change default version to 2.3.0 (If other ruby version exists):
$ rvm use 2.3.0 --default
{% endhighlight %}

## Thanks - [rvm.io](rvm.io)