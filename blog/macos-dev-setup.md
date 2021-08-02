---
title: MacOS Dev Environment Setup 2021 description: Setting up a MacOS for web development in 2021 publishedAt:
2021-08-01 updatedAt: 2021-08-01 published: true slug: 'macos-dev-setup' tags: ['Programming']
authors: ['Chau Tran']
---

Hey there, welcome to my MacOS Setup guide 👋. Whether you have just got yourself a new laptop, or you've decided to
wipe your machine and start over, congratulations on making the decision to improve your workflow. This guide is
definitely not the best because there is no _one-size-fit-all_ setup for everyone. However, this guide has been serving
me well over the past couple of years and I am sharing this with you all, as well as myself when I need to set up my
machine again in the future.

> I use [https://sourabhbajaj.com/mac-setup/](https://sourabhbajaj.com/mac-setup/) as my reference but this particular guide focuses more on Web Dev.

## 1. Stay Up-to-date

The first thing you would want to do is to keep your Mac up-to-date. Go to `About this Mac -> Software Update` to update
to the latest version of MacOS. New versions of MacOS usually contains security updates and bug fixes. This might take a
while so if you plan to go out, run the update beforehand, or take a walk 🏃‍

## 2. Xcode

Next _tedious_ step is to install `Xcode`. Open `AppStore`, look for `Xcode` and install it. This, again, might take a
while. However, a good thing is you can start working on step 3 while waiting on `Xcode` to finish installing.

After `Xcode` finishes, go ahead and run `Xcode` so you have `Xcode` setup for first time use. Next, open `Terminal` and
run the following command to install `Xcode Command Line Tools` which is needed to install other tools.

```bash
xcode-select --install
```

## 3. System Preferences

Please check out [this guide](https://sourabhbajaj.com/mac-setup/SystemPreferences/) for your preferences on how to set
up your Mac system-wide like `Dock`, `Trackpad` etc...

> Whatever preference you might have/do to your Mac, I'd highly recommend adjusting Repeat Key speed in `Keyboard`. Turn `Key Repeat` to **Fast** and `Delay Until Repeat` to **Short**

## 4. Homebrew

`Homebrew` is a package manager for your systems. Think of `Homebrew` as `npm` but for your system instead of a `NodeJS`
project. You can install `Homebrew` by opening the `Terminal` and run the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After finish installing, you can run `brew doctor` to ensure everything is installed correctly.

- To search for a package (formulae/cask)

```bash
brew search package_name
```

- To install a `formulae`

```bash
brew install formulae_name
```

- To install a `cask`

```bash
brew install --cask cask_name
```

> At the moment, I have installed everything on my machine using `Homebrew`

## 5. Text Editor

Next step is to install some text editors. My choices are [VSCode](https://code.visualstudio.com/)
and [Neovim](https://neovim.io/)

```bash
brew install --cask visual-studio-code
brew install neovim
```

#### VSCode

Installing `VSCode` should allow you to use `code` command from the terminal to open file and/or directory. If not,
run `VSCode` then enable the Shell Command with `Command Palette -> Shell Command: Install 'code' command in PATH`

## 6. Iterm2

This is my preference for a terminal. You can use whatever you like

#### Installation

Install `Iterm2` using `Homebrew`

```bash
brew install --cask iterm2
```

#### Customization

Again, every customization is my preference. Feel free to skip over ones that you are not interested.

**1. zsh**

Since MacOS Catalina, `zsh` has been set as the default Shell.

**2. Oh-my-zsh** [https://ohmyz.sh/](https://ohmyz.sh/)

Run the following command to install `oh-my-zsh`

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

You'll see the changes being applied to your terminal as soon as it finishes.

**3. Powerlevel10k (p10k)**

To install `p10k`, run the following command:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

Afterwards, open ZSH Config file by either `VSCode` or `nvim` and edit `ZSH_THEME` to have `ZSH_THEME="powerlevel10k/powerlevel10k"`. Restart your terminal and you'll be prompted to walk through `p10k` configuration wizard. Feel free to customize how you like.

**4. Aliases**

At this point, I usually setup some aliases for some of the shell commands that I frequently use

```shell
alias zshconfig="nvim ~/.zshrc"
alias zshsource="source ~/.zshrc"
alias ohmyzsh="nvim ~/.oh-my-zsh"

alias lg="lazygit"

alias c="clear"
alias rm="rm -rf"
alias ls="ls -lah"
alias nr="npm run"
alias nrs="npm run start"
alias nrb="npm run build"
alias nrc="npm run commit"
alias gpup="git push -u"

# list all available simulators
alias listios="xcrun simctl list devices"
```

**5. Preferences**

- Turn on Natural Text Editing by `Preferences -> Profiles -> Keys -> Select Presets -> Natural Text Editing`. This allows you to use Options/Command keys to move your cursor freely.
- Setup some Status Bars by `Preferences -> Profiles -> Sessions -> check Status Bar Enabled -> Configure Status Bar` to select your favorite status bars.
- Change the font of the terminal by `Preferences -> Profiles -> Text`. I use `MesloLGS NF` with `14pt` font size
- Last but not least, change to your favorite theme by `Preferences -> Profiles -> Colors`. Check [https://iterm2colorschemes.com/](https://iterm2colorschemes.com/) for a collection of Iterm2 Themes

## 7. Alfred

`Alfred` is an awesome `Spotlight` replacement. And if you have Powerpack (if not, you really should get Powerpack), your workflow will never be the same.

#### Installation

We would need to disable `Spotlight` first. 
- Open `System Preferences -> Spotlight` and uncheck everything that you don't want.
- Click on `Keyboard Shortcuts` and uncheck `Show Spotlight Search`. While you're here, click on `Services`, look for `Search man Page Index in Terminal` and uncheck it as well.
- Run the following command to install `Alfred`

```bash
brew install --cask alfred
```

#### Customization

- Check `Launch Alfred at login` and change your hotkey to `⌘ Space` (or anything you'd like) then you should be good to go

## 8. Browsers

Use `Homebrew` to install your favorite browsers

```bash
brew install --cask google-chrome
```

## 9. NodeJS

To install NodeJS, we are going to utilize `nvm` which is short for `Node Version Manager`. This is the recommended way to manage your `Node` since it manages multiple NodeJS versions at once.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

- Verify that you have `nvm` installed by running `nvm --version` in the terminal. Restart your terminal might help
- To install the latest version of node, simply run `nvm install node`
- To install the latest version of any specific major version, simply run `nvm install version` (eg: `nvm install 12` will install the latest Node 12.x.x)
- To use a specific Node version, run `nvm use <version>`
- To list all installed versions, run `nvm ls`
- To list all available versions, run `nvm ls-remote`

## 10. Python

Python is required as some tools are built with Python. Similar to NodeJS, it is recommended to use a version manager. In the case of Python, it is `pyenv` so go ahead and install `pyenv` with `Homebrew`

```bash
brew install pyenv
```

Afterwards, update your `PATH`

```bash
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

- To list all available Python versions, run `pyenv install --list` (restart your terminal if you run into issues)
- To install a Python version, simply run `pyenv install <version>`. I usually pick the latest 2.x and latest 3.x from the list.

## 11. Git GUI

A lot of people have their preferences for a GUI Client for Git like SourceTree, GitKraken etc... In this blog post, I would like to introduce my favorite Git client [lazygit](https://github.com/jesseduffield/lazygit) that runs on your terminal (so you do not have to leave). 

`lazygit` is fast, feature-packed, and extremely customizable. I've been using `lazygit` for a couple of years now and I haven't had the need to go back to a real GUI Git client.

#### Installation

`lazygit` can also be installed with `Homebrew`

```bash
brew install jesseduffield/lazygit/lazygit
```

Then you can explore how to use `lazygit` and how to configure it by visiting the Git repo.

#### Custom Pager

I use `diff-so-fancy` (a very good alternative is `delta`). Install it with `Homebrew`

```bash
brew install diff-so-fancy
```

then follow [Custom Pager Configuration](https://github.com/jesseduffield/lazygit/blob/master/docs/Custom_Pagers.md) to setup `diff-so-fancy` as the pager.
