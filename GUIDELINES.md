# 📘 Microcks Documentation Guidelines

Welcome to the Microcks documentation contribution guide! This document outlines the structure, standards, and best practices for writing and maintaining high-quality, consistent documentation across the Microcks ecosystem.

## ✨ Philosophy & Approach

Our documentation is structured following the principles of the [Diátaxis methodology](https://diataxis.fr/), which organizes documentation into four complementary types:

1. **Tutorials** – learning-oriented step-by-step guides.
2. **How-to Guides** – goal-oriented and task-focused instructions.
3. **Reference** – information-oriented, precise technical descriptions.
4. **Explanations** – understanding-oriented discussions and concepts.

Documentation is a learning cycle, helping users move fluidly from discovery to mastery. Diátaxis helps us ensure that content is accessible and purposeful at every stage of that journey.

## 📂 Structure & Organization

Using the Diátaxis principles, Microcks documentation includes:

- **Getting Started (Tutorials)**  
  Quickstart guides to help you experience Microcks hands-on, fast.

- **User Guides (How-to Guides)**  
  Step-by-step instructions to integrate Microcks with protocols, tools, and platforms.

- **Concepts (Explanations)**  
  Core principles like mocks, tests, async support, and architectural overviews.

- **References**  
  APIs, configuration options, CLI usage, schemas, and interfaces.

## ✅ Writing Best Practices

- **Be clear and concise** – Avoid unnecessary jargon; simplicity is key.
- **Use active voice** – Prefer _"You can create..."_ over _"It can be created..."_
- **Keep it actionable** – Use code snippets and commands readers can try directly.
- **Break it down** – Use short paragraphs, bullets, and headings for readability.
- **Be consistent** – Follow the formatting and tone used across the docs.
- **Cross-link** – Reference other relevant docs or CNCF/industry standards where helpful.

## 📋 Code Blocks: Command vs Output

> **💡 Important Note:**
> To ensure usability and enable efficient copy/paste, commands and outputs must be **clearly separated** and follow these conventions:

### 🛠️ Command and output Blocks

- Command should be written **as-is** and directly copyable — **no `$` or shell prompts**.
- Avoid adding characters or prefixes that are not part of the command.
- Do not include outputs in the same block as commands.

**✅ Example:**

See: https://microcks.io/documentation/tutorials/getting-started/

## 🔤 English Spell Checking Guidelines

To ensure high-quality documentation and avoid introducing typos or misspellings, Microcks leverages an automated [GitHub Action for spell checking](https://github.com/microcks/microcks.io/blob/master/.github/workflows/spellcheck.yml) on each new pull request (PR).

### 🛠️ How It Works

We use the [`misspell`](https://github.com/golangci/misspell) tool to automatically detect spelling issues in markdown files across the `microcks.io` documentation. Contributors are encouraged to run this check locally before submitting a PR to accelerate the review process.

### 🧪 Run Spell Check Locally

1. **Install `misspell`**
   Follow the installation instructions from the official repo: [https://github.com/golangci/misspell](https://github.com/golangci/misspell)
   
3. **Clone the Microcks documentation site**  
   ``` sh
   git clone https://github.com/microcks/microcks.io.git
   cd microcks.io
   ```
4. **Run the spell check**
   ``` sh
   IGNORE_WORDS=$(tr '\n' ',' < .wordlist.txt | sed 's/,$//')
   misspell -i "$IGNORE_WORDS" -error $(find content -type f -name "*.md")
   ```
   Below is an example of what you might see if misspelled words are found:
   ``` sh
   content/blog/microcks-1.2.0-release.md:46:134: "Mosquitto" is a misspelling of "Mosquito"
   content/blog/microcks-on-minikube.md:46:54: "existant" is a misspelling of "existent"
   content/blog/microcks-on-minikube.md:47:9: "marrage" is a misspelling of "marriage"
   content/blog/microcks-on-minikube.md:184:19: "marrage" is a misspelling of "marriage"
   ```

### 🧩 Managing False Positives
If a word is valid in a specific context (e.g., localized English or technical jargon) and should be retained in the docs, add it to the `.wordlist.txt` file via a pull request. Example:

``` sh
cat .wordlist.txt
```

``` sh
Mosquitto
emition
marrage
existant
```

## 🧱 Markdown Conventions

| **Element**      | **Convention**                                      |
|------------------|-----------------------------------------------------|
| **Headings**     | Use `#`, `##`, `###` for hierarchy                  |
| **Code blocks**  | Use triple backticks ` ``` ` with language tag      |
| **Inline code**  | Use backticks: `` `like-this` ``                    |
| **Lists**        | Use `-` for bullets, `1.` for numbers               |
| **Links**        | `[label](https://url)`                              |
| **Notes & Alerts** | `> **Note:**`, `> **Tip:**`, `> **Warning:**`     |

> **Note:** For all references to Microcks UI menu items in the documentation, please format them in bold using `**` in markdown.  
> Example: _"Select the **Importers** menu entry"_, as shown in this guide: [Importing Content via Upload](https://microcks.io/documentation/guides/usage/importing-content/#1-import-content-via-upload).

## 🔁 Versioning & Updates

- Align documentation with the latest stable release of Microcks.
- Flag deprecated or removed features with clear explanations.
- If necessary, please make sure to maintain version-specific instructions to avoid confusion.
- If you're documenting a recently introduced feature in Microcks, please add a note mentioning the version it was added in, and feel free to link to the [release notes](https://microcks.io/blog).

## 🤝 Contributing to Documentation
We welcome contributions to foster a collaborative and inclusive documentation environment.

You can help by:

- Suggesting improvements
- Fixing typos or broken links
- Reporting errors
- Adding new guides or clarifying existing ones

This collaborative approach keeps the documentation fresh and accurate and builds a stronger sense of ownership and engagement within our community.

> By the community, for the community. 🙌

Thank you for helping us improve Microcks! Every contribution counts — let’s build great docs together 💙
