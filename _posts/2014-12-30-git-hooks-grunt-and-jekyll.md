---
layout: post
title: Git Hooks, Grunt and Jekyll on Dreamhost
excerpt: I recently spent the better part of a day getting Grunt and Jekyll to properly execute via a Git post-receive hook. Here are some notes about getting Node, Grunt and Jekyll running on a shared Dreamhost server.
code: true
---

I've been meaning to get myself set up with Git deployment for a while now. What better time than right after a website refresh?

I wrote a pretty straightforward Grunt task to change the Sass output style from `expanded` to `compressed` for building prior to deployment. There's probably some Jekyll plugin, or an even more clever way of doing it, but this is what I'm doing, so I need to make it work.

So, the requirements for my Git hook are:

- Checkout into a working directory
- Run one or more Grunt tasks
- Build with Jekyll
- Don't shit all over itself

Dreamhost already has Git and Ruby installed, but that didn't stop me from jumping into a rabbit hole...

---

*Note: This worked for me, but it may not work for you. Proceed with caution; don't come blaming me for any trouble you get into.*

*Also, most of this is unsupported by Dreamhost and could break at any time.*

---

### Node and NPM

I originally installed Node on my server a while back by cloning the source and compiling myself. And while that worked fine, when it came time to install Grunt and some tasks, I ran into a few problems getting the latest versions of everything. After a bit of Googling, I found [NVM](https://github.com/creationix/nvm).

#### NVM : Node :: RVM : Ruby

NVM makes it almost *too* easy to install and update Node. I chose the manual install to avoid having my `bash_profile` automatically written to.

Manually installing NVM is as simple as cloning the repo and checking out the latest version:

{% highlight bash %}
git clone https://github.com/creationix/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
{% endhighlight %}

From the [NVM Readme](https://github.com/creationix/nvm#manual-install)

Once that's finished, source the `~/.nvm/nvm.sh` file in your shell and you can easily manage Node versions. [See their usage docs](https://github.com/creationix/nvm#usage) for more, but what I did was [update my dotfiles](https://github.com/goodguyry/dotfiles/commit/5cd72d0a62779aace5ee444eb1ae8cf0194955f6), test on my laptop and then pull the changes to the server. From there I re-installed my dotfiles and everything was ready to go.

### RVM and Ruby

Installing gems like Jekyll and Rouge was no problem. However, Dreamhost has an older version of Ruby (1.8.7), which meant I was stuck on older versions of the gems. [The Dreamhost RVM docs](http://wiki.dreamhost.com/RVM) helped, but it still wasn't quite working. [This Stack Exchange answer](http://stackoverflow.com/questions/17357777/dreamhost-vps-cant-install-rvm-because-new-to-be-sudoer/17364911#17364911) cleared everything up:

{% highlight bash %}
\curl -L https://get.rvm.io | bash -s -- --autolibs=read-fail
{% endhighlight %}

Set `autolibs` in the `curl` command &ndash; not after, as the docs suggest.

Even with that bit of magic, updating Ruby was unnecessarily difficult. I ended up going with [this suggestion from another Stack Exchange answer](http://stackoverflow.com/questions/15798461/how-do-i-use-rvm-to-install-ruby-on-a-dreamhost-shared-server/19238624#19238624).

{% highlight bash %}
rvm mount -r https://rvm.io/binaries/ubuntu/12.04/x86_64/ruby-2.0.0-p598.tar.bz2 --verify-downloads 1`
{% endhighlight %}

Be sure to substitute your OS and versions if they differ from mine

### Great...

#### But why doesn't my Git hook work?

I spent about an hour or so working through my Ruby and Node installation issues and getting everything set up, and basically the rest of my life troubleshooting why my Git hook was telling me Grunt and Jekyll weren't installed.

This was my first experience with Git hooks, so I think I let that cloud what was actually a pretty simple problem to fix.

#### The non-login environment

I haven't researched this a whole lot, so forgive me if I don't have this 100% correct, but, as far as I could figure out, my Git hook is running in a non-login shell, meaning all my fancy `bash_profile` settings and `$PATH` weren't set as they should have been.

So, essentially, what I needed to do was re-create my login environment for the Git hook.

{% highlight bash %}
#!/bin/bash

# Source/PATH to match login shell
source $HOME/.rvm/scripts/rvm
PATH="$PATH:$HOME/.nvm/v0.10.35/bin"
PATH="$PATH:$HOME/.rvm/bin"
{% endhighlight %}

Re-create the necessary parts of your login environment

That did the trick. Everything ran as expected. I was very happy to have gotten to the bottom of that.

I hope this helped you (or future me) get past the hurdle of automated deployment with Git, Grunt and Jekyll.

### Related

- [_How To Use Git Hooks To Automate Development and Deployment Tasks_](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks)
- [An example post-receive Git hook](https://gist.github.com/goodguyry/60661091c2bb68d9574c)
- [My Gruntfile](https://github.com/goodguyry/ryandomingue.com/blob/master/Gruntfile.js)
