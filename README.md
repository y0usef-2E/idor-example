Website to showcase a simple IDOR vulnerability.

> :warning: This website is vulnerable by design. Do not input sensitive data.

### Quick Start
If you simply want to try it out, use this [public link](https://idor-example.vercel.app/).
You should also be able to clone the repo and play around with it locally.

You can find the **vulnerable page**  at <url>/settings?username={username}.

The **main idea** is very simple: since the settings page shows the current data of the selected user,
you can view someone else's **private data** by changing the parameter *username* in the URL.

### Notes on the implementation
I started this little project to try out [*Fiber*](https://gofiber.io), which I ended up liking, in conjunction with [*NextJs*](https://nextjs.org).
However, the code I wrote does not make great use of the features that *NextJs* is good for, e.g. those relating to SSR,
since I wanted to be done with it quickly.
This means that you might find places with weird choices regarding data fetching and/or state management.
This is not a bad thing per se, but you need to keep it in mind should you try to learn anything from this project.

Generally speaking, when designing a website, you should use the best database for your needs.
For this website, I knew that I have many choices since I am dealing with a low amount of data,
so I chose [*sqlite*](https://www.sqlite.org) as it is very easy to set up.

As it is a simple website aimed at showing **non-technical users** the aforementioned type of vulnerability,
it uses usernames as unique identifiers instead of numerical IDs.
While IDs are also used to implement the vulnerability, these details are not shown to the user.
This choice was made mainly to make it easier to grasp the essence of the problem.
However, this is a personal choice so feel free to change anything if you use this piece of code in the future.

For any serious project that lets users input their private data,
you need to take extra steps to ensure the safety of said data.
Implementing authentication yourself, as I did in this case, is a good exercise for programmers
but also a part of your project that should be heavily tested.
So be careful and don't blindly copy the way I (or others) do authentication,
especially because I willingly make some spots less secure
(either to be done quickly or to achieve the goal of this project, namely being vulnerable by design.)

### Deployment
Client and server are deployed separately: the client on Vercel, the server on a VPS (using Dokku.)

But it should not be hard to change the [Dockerfile](./Dockerfile) to allow for both of them to be on the same instance.

### License
This piece of software is licensed under the [GPLv3](./LICENSE.txt) and is provided without warranty of any kind.
