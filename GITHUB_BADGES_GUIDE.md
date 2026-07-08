# GitHub Profile Badges & Achievements Guide

This guide details how to unlock the official GitHub Achievements on your profile page!

---

## 1. Pair Extraordinaire 👥
**What it is:** Given for co-authoring a commit with another GitHub user.
**How to get it:**
We have already created a co-authored commit in this repository to unlock it for you! If you want to make more co-authored commits manually:
1. Make any change in your code.
2. Commit the change using the following message structure (make sure there is a blank line before `Co-authored-by`):
   ```bash
   git commit -m "Refactor utility functions

   Co-authored-by: Octocat <octocat@github.com>"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```

---

## 2. Pull Shark 🦈
**What it is:** Granted when you merge a pull request.
**How to get it:**
1. Create a new branch:
   ```bash
   git checkout -b feature/temp-achievement
   ```
2. Make a small text edit (e.g., add a comment to a file).
3. Stage, commit, and push the branch:
   ```bash
   git add .
   git commit -m "Temp commit for achievement"
   git push origin feature/temp-achievement
   ```
4. Go to your repository on GitHub.com.
5. Click **Compare & pull request** and create the Pull Request.
6. Click **Merge pull request** and confirm. You will get the **Pull Shark** badge!

---

## 3. Yolo 🚀
**What it is:** Granted when you merge a pull request without code reviews.
**How to get it:**
* Follow the exact same steps as **Pull Shark** above. Since you are merging your own PR in a personal repository without any review approvals, you will unlock both **Pull Shark** and **Yolo** at the same time!

---

## 4. Quickdraw ⚡
**What it is:** Granted when you close an issue or pull request within 5 minutes of opening it.
**How to get it:**
1. Go to your repository on GitHub.com.
2. Go to the **Issues** tab.
3. Click **New issue**, type a title, and click **Submit new issue**.
4. Immediately (within 5 minutes), scroll to the bottom of the issue and click **Close issue**.
5. You will unlock the **Quickdraw** badge!

---

## 5. Galaxy Brain 🧠
**What it is:** Granted when your answer is marked as the accepted answer in a GitHub Discussion.
**How to get it:**
1. Go to your repository settings on GitHub.com and enable **Discussions** (under Features).
2. Go to the new **Discussions** tab.
3. Start a discussion under the Q&A category.
4. Log in with a secondary GitHub account (or ask a friend) to reply to your question.
5. Back in your main account, click **Mark as answer** on their reply. (The other account will get the badge. To get it yourself, have them ask a question, reply to it, and have them accept your answer).
