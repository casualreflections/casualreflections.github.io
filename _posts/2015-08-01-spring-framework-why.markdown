---
layout: post
title: "Spring Framework - Why?"
date: 2015-08-01T02:52:58+05:30
categories: [Blog,Computers, Java, Technology]
tags: [Java, Languages, Web Framework ]
summary: Solution for creating decoupled applications for web
description: Solution for creating decoupled applications for web
share:  true
comments:   true
featured: true
post_format: [ ]
---

Why Spring ?

Spring is used to efficiently and effortlessly wire all the components of a large application.
This basically provides a framework for decoupling the application using dependency injection design pattern .

Consider a scenario where you only have to worry about making your object work as it is supposed to and leave the dependencies it requires to actually be provided by some one else. This some one is exactly what spring is !

Example:
Suppose you need to render a view with a list of listeners:

1.You'd write an interface to be implemented:

{% highlight java%}
public interface Listener{
    public List<Users> showUsers();
}
{% endhighlight%}

2.You'd write an api to fetch the users from DB :

{% highlight java%}
public List<Users> ListFromDb implements Listener{
    public List<Users> showUsers(){
    //write the DB access code here.
}

{% endhighlight%}

3.Render the view:

{% highlight java%}
public class ViewClass{
    private Listener newListener;

    public void render(){
        newListener = new ListFromDb();
        List<Users> list = listener.showUsers();
        view.render(list);
    }
}
{% endhighlight%}

Suppose, you are changing the business logic and now you want to fetch the list of users from a common seperated file instead of fetching it from the db. Now,lets look at the changes we need to make.

We'll have an api which'll break down the comma seperated file to return a list. Let's say this api is implemented in ListFromFile class.
To render this list in the view, we'll have to create an instance of the class ListFromFile instead of ListFromDb.

{% highlight java%}
public List<Users> viewObject{
private Listener newListener;
public void render(){
newListener = new ListFromFile();
List<Users> list = newListener.showUsers();
view.render(list);
}
}
{% endhighlight %}

This is a very simple scenario with a minor change. Consider a large tightly coupled project where you'll have to change every implementation of logic for a minor change in business.
Very tedious indeed.

If only there was a way in which the injection of implementations of Listeners was taken care of and addrdfrrll we'd have to do is render the implementation to the view right ?
Well, there is . 

In spring,this is how it works.
Create a setter method for the Listener class in an xml file and specify the dependencies of viewObject in it. Simple.

{%highlight xml%}
<bean id="newListner" class="ListFromDb" />

<bean class="viewObject">
    <property name="newListner" ref="userListner" />
</bean>
{% endhighlight %}
Now, when you write this :

{% highlight java%}

List<Users> list = listener.showUsers(); 
The listener object is automatically created without instantiating it using
newListener = new ListFromDb();

{% endhighlight%}

If you want to change the logic to fetch it from the comma seperated file, all you have to do is make changes in the xml to create a setter method for the changed class.

This injection of objects in spring is what makes it flexible to manage large applications .
This is termed generically as Dependency Injection.
