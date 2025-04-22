# 📘 Microcks Documentation Guidelines

Welcome to the Microcks documentation contribution guide! This document outlines the structure, standards, and best practices for writing and maintaining high-quality, consistent documentation across the Microcks ecosystem.

## ✨ Philosophy & Approach

Our documentation is structured following the principles of the [Diátaxis methodology](https://diataxis.fr/), which organizes documentation into four complementary types:

1. **Tutorials** – learning-oriented step-by-step guides.
2. **How-to Guides** – goal-oriented and task-focused instructions.
3. **Reference** – information-oriented, precise technical descriptions.
4. **Explanations** – understanding-oriented discussions and concepts.

We believe documentation is a **learning cycle**, helping users move fluidly from discovery to mastery. Diátaxis helps us ensure content is accessible and purposeful at every stage of that journey.

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

- **Deployment & Configuration**  
  Local and cloud-native deployments with Kubernetes, OpenShift, Helm, and more.

- **Developer & Contributor Docs**  
  Module-specific guides, contribution workflow, and build instructions.

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

### 🛠️ Command Blocks

- Should be written **as-is** and directly copyable — **no `$` or shell prompts**.
- Avoid adding additional characters or prefixes that aren’t part of the command.
- Do not include outputs in the same block as commands.

**✅ Example:**

```bash
kubectl apply -f microcks.yaml
