# Compactia

### Overview

Compactia was designed to be a project management tool for table-top role players and story gamers. My goal is to one day make it a one-stop shop for campaign management needs for gamers.

### Features

Compactia currently supports sign up/log in functionality with encrypted passwords and authorization. It incorporates passport/OAuth with Facebook and uses Coudinary for image storage. It is a CRUD app that allows the user to create and edit characters and campaigns freely. Its back end is supported by a psql database.


### Credits


The current version of this app was created using a variety of resources including:

* Twitter Bootstrap 3

* Creative Tim's Light Bootstrap Dashboard, Bootstrap Wizard, and Login/Register Modal

* Lorien Ipsum

* Cloudinary

* Facebook Developer Tools

* Font Awesome

* Heroku (for deployment)


### Wire frames, ERMs and user stories

This project required a lot of planning and preparing to incorporate the many tools I used to build it. My design process and user stories can be found at this [link][1].

[1]: https://www.dropbox.com/sh/u13ok3rdlkdbuso/AAAp2EqIWeqfKs_SXl4qV2XNa?dl=0

### Known issues

1. Permissions are still a problem, with checking if a user is a part of a campaign. This only works if the user is the master user, because they are the first to be checked in the users.forEach loop. I still don't know how to go about correcting this problem. The browser will hang if a user goes to the join campaign page and enters a password, even though their info is written to the database.

2. I believe that asynchronicity is required to get character attributes to render correctly when listing multiple characters. Unfortunately I did not have time to solve this problem..
