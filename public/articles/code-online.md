!> hide
<head>
    [highlight]
    <title>Guide: Online programming for Chromebooks</title>
    <meta name="permalinks" content="not-titles">
</head>

# Online VS Code for frontend and backend development

> A guide about setting up a remote programming environment with all the pros of VS Code and multi-user support.
> *Works on Chromebooks!*

In this article, I'll cover how to set up a remote coding environment using [code-server](https://github.com/cdr/code-server).
If you want the tutorial, skip to [Requirements](#requirements).

## Background

I'm teaching a beginners class on programming. The students all work on Chromebooks, a sad part of reality I had to work my way around.
I recalled hearing about [some project enabling VS Code in the cloud](https://github.com/cdr/code-server), which sounded perfect!
After a bit of searching, I found [this video from Fireship](https://youtu.be/N5WojMutddQ).

So, the restraints for this project was
- Something usable by multiple users at the same time (multi-tenancy), using minimal server resources
- A beginner friendly UI for accessing ones VS Code directory and it's files in the browser
- Some basic security (blocking access to the local network and to the server certificates), since **all users will have shell access**
- A simple project which at maximum takes a few hours to set up from scratch.

After realizing these goals, I set out to a quest to use the [newly implemented reverse-proxy](https://github.com/Icelk/kvarn/commit/f5156a80c1daf4f47c3ad002ed4a3510929ae01c) in Kvarn as a HTTPS relay for `code-server`.
Kvarn also hosts the user-friendly homepage.

## Requirements

This is designed to be a light-weight and performant package.
I'll use this for Rust development with [Kvarn](https://github.com/Icelk/kvarn/), with about 20 concurrent users, so I'm using a virtual machine with 6 threads (probably overkill) and 2 GB memory.

- A descent machine without **any** files you care about (*please* use a VM!)
- [My proxy](https://github.com/Icelk/code-server-proxy/)
- Rust on the host machine to build the proxy from source
- [code-server](https://github.com/cdr/code-server). I'll show how to install and configure it later.
- Port forward access to open port 100 for your host machine
- A certificate (see [Let's Encrypt](https://letsencrypt.org/)) and a domain (else service workers won't work; `code-server` wont work)
- A `doas` flavour. I recommend [OpenDoas](https://github.com/Duncaen/OpenDoas) ([Arch package](https://archlinux.org/packages/community/x86_64/opendoas/)) for Linux.

I also greatly recommend installing the [Fish shell](https://fishshell.com/) ([Arch package](https://archlinux.org/packages/community/x86_64/fish/)) if you intend for any beginners to access the shell, since Fish's autocompletion and ergonomics are very friendly (and also a *very* nice shell to work with compared to Bash).

## User management

I had two options for Linux user management. If you have no interest in the motivations of my choices here, jump to [Installation](#installation).

The first was to assign each remote user a local Linux user. This would imply creating several Linux users with their own home directory,
each with a instance of `code-server` running, which means Kvarn would have to route to different ports depending on user.
This has the advantage of sandboxed files, separate shells, and separate extensions. Though, a lot of configuration would have to be done to set
all users' passwords and shell.

The second alternative was to have all one one user. This only needed one `code-server`, reducing complexity.
I also only needed to set up two users; one running Kvarn with privilege to run `doas` and the other running `code-server`
and hosting all the users files.

I settled for the second option as the first didn't offer many benefits but was a lot harder to set up and maintain.

## Installation

First, set up a OS on the machine. I recommend [Arch Linux](https://archlinux.org/) as it's stable yet cutting-edge and has *the best* wiki in Linux-land.
See the [installation guide](https://wiki.archlinux.org/title/Installation_guide) for directions.
> Install the `linux-lts` package for better stability.

During this installation, the user `icelk` will be running Kvarn and `codeonline` will be running `code-server` and owning the files.
Naturally, you can change these names.
To create these users run
```shell
# useradd icelk -m -G wheel
# useradd onlinecode -m -G wheel
```

**Important:** we need to create the `doas` configuration file so we can use root privilege (without the bloated `sudo`).

Create `/etc/doas.conf` with
```ini
permit nopass root

permit persist :wheel
```

Next, install all the needed packages. Here, the command for Arch is listed, but the packages should be available for your distro too.
Run `rustup` as the user `icelk`.
> Fish and NeoVim aren't needed, but I strongly recommend Fish, as stated above, and NeoVim is very nice to edit in compared to `vi`.
> OpenSSH is needed for remote control.
> ufw and iptables-nft are needed for a firewall.
```shell
# pacman -Suy git ufw iptables-nft rustup opendoas fish neovim openssh
$ rustup default stable
```

---

Then, [install `code-server`](https://github.com/cdr/code-server#getting-started) by running (to preview the install process) the following as `onlinecode` (`doas -u onlinecode fish` to get a shell as `onlinecode`)
```shell
$ curl -fsSL https://code-server.dev/install.sh | sh -s -- --dry-run
```
Then remove the `-s -- --dry-run` part to do the install.

Next, install my proxy server. Run as `icelk`.
```shell
$ git clone https://github.com/Icelk/code-server-proxy.git kvarn-proxy
$ cd kvarn-proxy
$ cargo build
```

Now, make sure you have your certificates in a safe place. I put them in `/home/icelk/.private/`.
> Note: the certificate (or fullchain) must be named `cert.pem` and the private key `pk.pem` and be located in the current directory for my program to recognise them.

__*That's all!*__

## Configuration

First, we need to configure `code-server`.
To get the default configs, start and stop the included service.
```shell
# systemctl start code-server@onlinecode
# systemctl stop code-server@onlinecode
```
Then, change the following values in `/home/onlinecode/.config/code-server/config.yml`
```yml
bind-addr: 0.0.0.0:8080
password: <your password here>
```

`doas` should already be configured (and `sudo` removed from your system ;).
So let's discuss some options in the config! The `nopass` option is to enable root to execute programs as any other user in services.
`persist` remembers the password you entered for about 5 minutes, just convenience.

---

You need to symlink `/home/onlinecode/web` → `/home/icelk/kvarn-proxy/web/` for Kvarn to find the homepage.
The permissions are a bit of a problem. See the end of [Security](#security) for more info.
The `ln -s` command can be run as either `icelk` or `onlinecode`.
```shell
# chmod 755 /home/onlinecode/
$ ln -s /home/icelk/kvarn-proxy/web /home/onlinecode/
```
> You might notice you can't `ls` the contents of `~/web/` as `onlinecode`. This is OK, since it's `icelk` running Kvarn who'll be accessing the files.

Now when you create new folders for new users and in the online editor they have the permissions `drwxr-xr-x`,
granting `icelk` access to read them. As Kvarn is ran as `icelk` and will try to access these files, this is crucial.

---

Now, let's create a service for the Kvarn proxy you just built!
With `nvim /etc/systemd/system/code-server-proxy.service`, enter
```ini
\[Unit]
Description=Online coding environment
After=network.target

\[Service]
Type=simple
ExecStart=sh -c "cd /home/icelk/.private && bin=/home/icelk/kvarn-proxy/target/debug/code-server-proxy && setcap CAP_NET_BIND_SERVICE=+eip $bin && exec doas -u icelk $bin"

\[Install]
WantedBy=multi-user.target
```
This makes sure we have network access before starting the service. The \\[Install] section makes it possible to automatically start the server at boot.
The command run enters `icelk`'s private directory, where `cert.pem` and `pk.pem` should be stored
(make sure to `chmod 600 cert.pem pk.pem` so only you have read access to them),
then enables non-superusers to bind ports under 1024 with the program
and lastly drops root privileges (by executing the binary as `-u` (user) `icelk`) and starts the Kvarn proxy.

---

Next, you need to *port forward* port 100. This varies wildly across routers, so fiddle around in your router's interface or [duck it](https://duckduckgo.com/).

To harden the system and to set up a [UWF](https://wiki.archlinux.org/title/Uncomplicated_Firewall) firewall, read the [Security](#security) section below.

### Security

If you want extra security, a firewall is a good start. This will block all network access, both to the Internet and locally.
UFW is simple and only requires a few commands to configure.
```shell
# ufw default deny outgoing
# ufw default deny incoming
# ufw allow 22
# ufw allow 100
# ufw enable
# systemctl enable ufw
```
Now only SSH access and the website at port 100 is allowed.

To upgrade the system or do anything else which requires network access, you need to enable outgoing HTTP traffic.
`doas ufw allow out 443` will allow outgoing HTTPS traffic, but no HTTP traffic. Outgoing port 80 can be used for that.
After you are done with accessing the network, use `doas ufw delete allow out 443` to disable outgoing HTTP traffic.

> Tip: use `doas ufw status` to query the current firewall configuration.

---

Next, we'll disable user `onlinecode`s permission to get superuser access through `doas`.
This is **very** important if you chose a weak password for `onlinecode`.
If you recall, we allowed all members of the `wheel` group to use `doas`.
To remove `onlinecode` from the group `wheel`, type
```shell
# gpasswd -d onlinecode wheel
```

---

The permissions of `/home/onlinecode/` are a bit wanky. All other users have read access to their files
(but as the user will be exclusively used for untrusted remote users, this isn't a problem).
These files are needed for the files and homepage part of `code-server-proxy`.
I've tried to keep the permissions as strict as possible for security, but it's important for you to double check everything.
**Mainly that the `onlinecode` user does *not* have access to Kvarn's certificates.**

> Please send an email to me if the permissions aren't working for you so I can fix it in this article!

## Running it

I'm glad you've come so far! To start the system now and on boot (swap `enable --now` with `start` if you don't wait it to start on boot), run the following with superuser privileges
```shell
# systemctl enable --now code-server-proxy
# systemctl enable --now code-server@onlinecode
```

You are ready to go! Visit `https://<your website>:100/` to view the homepage.

## Closing thoughts

I think the UI is quite good, simple but functional.
Open an issue on [GitHub](https://github.com/Icelk/code-server-proxy/) or mail me if you have any ideas of improvement.

The `Backend services` section on the homepage enables users to connect to their server. See [these lines](https://github.com/Icelk/code-server-proxy/blob/3f3da30e39bfd28bce7bbe4f2abf9bfd27bbc3ad/src/main.rs#L134-L187) for the implementation.

---

Stability - Kvarn giving bad gateway
Regarding stability, Rust has served me well. The only problem is a `502 Bad Gateway` error from Kvarn on the first load of online VS Code.
It'll maybe get resolved in the future with improvements to the [reverse proxy](https://kvarn.org/reverse-proxy.) of Kvarn.
> My [httPWM](https://github.com/Icelk/httPWM/) project has been running on a RaspberryPi more than a month now!

---

If you encounter any issues with this article, or any bug in my software,
please [email me](mailto:main@icelk.dev) so I can improve the experience for everybody.
Please help if you encounter any bugs!

If you found this article helpful, consider sharing this site to your friends and family.
It helps a ton in SEO and for my motivation to continue.

And, lastly, thanks to you for reading this!

---

Last edited at ${date}.
