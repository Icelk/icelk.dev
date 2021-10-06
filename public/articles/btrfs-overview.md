!> hide

<head>
    <title>Why use BTRFS? An overview.</title>
</head>

See [the YouTube video](https://youtu.be/bS8Sp0Vb9Pc).

${toc}

# Introduction

As with all things on Linux, you have plenty of options.
I've done the research, and concluded the Better filesystem (BTRFS) is the best for Linux.

This article will cover the code to getting started, including how to convert from Ext4.

# Why?

- Compression: No decrease in speed, but 55% decrease in space, 22GB -> 10GB!
- Modern code design
- Built into Linux (the kernel)
- Fault tolerance (insane! checksums and avoiding silent data-corruption)
- As easy to set up as ext4 (`mkfs.btrfs /dev/sdx1 -L "My Better filesystem label"`)
- Cheap copies (backups and snapshots)
- Subvolumes (what is this?)
- Quotas for subvolumes
- Software raid
- Conversion from ext4 (with revert)
- Backups / snapshots
- Great resizing capabilities
- More space-efficient than ext4 (26.38MB vs 128KB for a 512MB partition)

# Convert

I use `doas`, as it's not as bloated as `sudo`. You can naturally replace `doas` with `sudo` or equivalent (I dunno, `pkexec`, maybe?)

```shell
$ doas umount /dev/sdc1

$ doas e2fsck -fvy /dev/sdc1

# UUID copy does not seems to work. You have to edit your fstab to correct the change.
$ doas btrfs-convert -L --uuid new /dev/sdc1

Edit fstab (new UUID, noatime, compress=zstd, autodefrag)

$ doas mount /dev/sdc1 /misc

Check if file system is ok

# You cannot revert. Use `btrfs-convert -r /dev/sdc1` to rollback BEFORE this command.
$ doas btrfs subvolume delete /misc/ext2_saved

# This compresses the whole filesystem with zstd
$ doas btrfs filesystem defrag -v -r -f -t 32M -czstd /misc

# Reclaims the Ext4 space
$ doas btrfs balance start -m /misc
```

# Mount options

See the overview of my drive layout [on GitHub](https://github.com/Icelk/dotfiles/blob/main/drive-layout.md#btrfs-options).

# Sidenote: enlarge LUKS partition

Enlarging an encrypted partition can be a bit tricky.
Because I've done it, why not mention it here?

You should extend the partition before running these commands, as they simply
force LUKS and BTRFS to occupy the whole partition.

```shell
# cryptsetup luksOpen /dev/nvme0n1p3 cr

# btrfsck /dev/mapper/cr

# cryptsetup resize cr

# btrfsck /dev/mapper/cr

# mount /dev/mapper/cr /mnt

# btrfs filesystem resize max /mnt

# umount /mnt

# cryptsetup luksClose cr
```

# Summary

Switching from Ext4 to BTRFS has been very exciting and beneficial for laptop use.

If you want the entire notes I talked from in the video, [send me an email](mailto:main@icelk.dev)
and I just might release them here.

> It'll take some time; I'll have to clean them up a fair bit.
