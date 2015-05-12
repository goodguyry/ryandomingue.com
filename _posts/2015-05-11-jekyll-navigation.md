---

layout: post
title: Jekyll Navigation
excerpt: An exploration of an approach to Jekyll site navigation, with an additional approach for multi-lingual sites.
description: Exploring Jekyll site navigation options
code: true

---


In this post, I'll introduce a technique for creating navigation for a Jekyll-powered website. After working through the basic example, I'll show how I've extended it for use in a multi-lingual site.

In these examples, I&rsquo;ll use data files to hold the list of navigation items, then a [Liquid `for` loop](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers#for-loops) to build the navigation list. [Jekyll data files](http://jekyllrb.com/docs/datafiles/) hold additional data for Jekyll to load while generating your site. They&rsquo;re a great place to store strings, common URLs, and more.

## The Basic Nav

First, create a list of items in <code class="path">_data/nav.yaml</code>, each with &lsquo;text&rsquo; and &lsquo;url&rsquo; properties to hold the necessary information.

{% highlight yml %}
- text: Home
  url: /
- text: About
  url: /about/
- text: Blog
  url: /blog/
{% endhighlight %}

From _data/nav.yaml

Now that the data file is ready, assign the current page&rsquo;s URL to a variable. &ldquo;Current page&rdquo; in this context refers to the page being processed during Jekyll&rsquo;s build.

{% highlight liquid %}
{%raw%}{% assign thisUrl = page.url | remove: 'index.html' %}{%endraw%}
{% endhighlight %}

Capture the page's URL

So as Jekyll iterates through the pages in the site, each page&rsquo;s URL will be captured and used for building the rest of the navigation.

### One Small Problem

The home page doesn&rsquo;t need the &lsquo;home&rsquo; link, so the loop should skip over the first list item when Jekyll builds the home page. Liquid provides a handy `offset` property, available inside `for` loops, for which this is a perfect use-case.

To set the `offset`, test whether or not the current page is the home page. If it is, set the offset to 1, which will skip over the first list item (&lsquo;home&rsquo;). Otherwise, let the loop start at the first item, as it would by default.

{% highlight liquid %}
{%raw%}{% if thisUrl == "/" %}
  {% assign navOffset = 1 %}
{% else %}
  {% assign navOffset = 0 %}
{% endif %}{%endraw%}
{% endhighlight %}

Use a loop offset to skip the home link on the homepage

#### The Loop

Now that all the pieces are in place, add the loop to build the navigation list.

Use a `for` loop to iterate over the items in `site.data.nav`, comparing each item to the current page's URL. If the item matches the page's URL, mark the navigation item as &ldquo;current&rdquo; for styling purposes.

{% highlight html %}
<nav role="navigation">
  <ul>{%raw%}
  {% for item in site.data.nav offset:navOffset %}
    {% if item.url == thisUrl %}
      <li class="current">{{ item.text }}</li>
    {% else %}
      <li><a href="{{ item.url }}">{{ item.text }}</a></li>
    {% endif %}
  {% endfor %}{%endraw%}
  </ul>
</nav>
{% endhighlight %}

The loop

### The Multi-Lingual Nav

I&rsquo;m in the process of building a website that needs to be translated into Spanish, including the navigation, which proved to be a bit tricky. Here&rsquo;s my approach to a multi-lingual navigation, which builds off of _The Basic Nav_ idea above.

#### The Data Files

For this site, the data files also serve to hold translated strings. As such, there are two data files:

{% highlight yml %}
nav:
- text: Home
  url: /
- text: Espa&ntilde;ol
  url: /es/
- text: About
  url: /about/
- text: Contact
  url: /contact/

home: /
other: /es/
{% endhighlight %}

From _data/strings_en.yaml

{% highlight yml %}
nav:
- text: Inicio
  url: /es/
- text: English
  url: /
- text: Acerca
  url: /es/acerca/
- text: Contacto
  url: /es/contacto/

home: /es/
other: /
{% endhighlight %}

From _data/strings_es.yaml

`home` and `other` will be used to tell the loop which site is being built. More on that later...

As with _The Basic Nav_ example above, the current page's URL needs to be captured for use in the loop.

{% highlight liquid %}
{%raw%}{% assign thisUrl = page.url | remove: 'index.html' %}{%endraw%}
{% endhighlight %}

Capture the page's URL

Next, tell Jekyll which data file to use by checking the URL for the language-specific directory. If the URL contains the directory name &mdash; in this case '/es/' &mdash; use the translated strings. Otherwise, use the english strings.

{% highlight html %}
{%raw%}{% if thisUrl contains "/es/" %}
  {% assign strings = site.data.strings_es %}
{% else %}
  {% assign strings = site.data.strings_en %}
{% endif %}{%endraw%}
{% endhighlight %}

Tell Jekyll which data file to use

For the offset, the only difference is checking for the translated home page URL in addition to the english home page URL.

{% highlight liquid %}
{%raw%}{% if thisUrl == "/" or thisUrl == "/es/" %}
  {% assign navOffset = 1 %}
{% else %}
  {% assign navOffset = 0 %}
{% endif %}{%endraw%}
{% endhighlight %}

Set the offset using both home page URLs

#### The Problem, Part Deux

As with _The Basic Nav_ above, the home pages &mdash; both the translated site and the english site &mdash; shouldn't show a home link. We solve this by conditionally setting the `offset`. But on the home page, the link to the translated home page _should_ show.

So the loop essentially says, for items in this list, if the item is not the home page, skip the translated home link. Otherwise, build the list normally. And, of course, the list may or may not be offset, based on the page's URL.

{% highlight html %}
<nav role="navigation">

  <ul>{%raw%}
  {% for item in strings.nav offset:navOffset %}
    {% if thisUrl != strings.home %}
      {% if item.url != strings.other %}
        {% if item.url == thisUrl %}<li class="current">{{ item.text }}{% else %}<li><a href="{{ item.url }}">{{ item.text }}</a>{% endif %}</li>
      {% endif %}
    {% else %}
      {% if item.url == thisUrl %}<li class="current">{{ item.text }}{% else %}<li><a href="{{ item.url }}">{{ item.text }}</a>{% endif %}</li>
    {% endif %}
  {% endfor %}
  {%endraw%}</ul>

</nav>
{% endhighlight %}

The multi-lingual loop

In this post, I introduced a technique for creating site navigation using Jekyll data files and Liquid conditionals and loops. I then showed how I've extended this approach for use in a multi-lingual site I'm building. I hope you've found this exercise helpful.


### Additional resources

- [Jekyll Documentation - Data Files](http://jekyllrb.com/docs/datafiles/)
