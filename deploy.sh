#!/bin/sh

# If a command fails then the deploy stops
set -e

required_hugo_version="0.165.0"

if ! command -v hugo >/dev/null 2>&1; then
	echo "Error: Hugo ${required_hugo_version} Extended is required but Hugo was not found." >&2
	exit 1
fi

hugo_version="$(hugo version)"
case "$hugo_version" in
	*"v${required_hugo_version}+extended"*) ;;
	*)
		echo "Error: Hugo ${required_hugo_version} Extended is required." >&2
		echo "Found: ${hugo_version}" >&2
		exit 1
		;;
esac

if [ "${1:-}" = "--check" ]; then
	if [ "$#" -ne 1 ]; then
		echo "Usage: $0 --check" >&2
		exit 2
	fi

	check_dir="$(mktemp -d)"
	cleanup() {
		if [ -n "${check_dir:-}" ] && [ -d "$check_dir" ]; then
			rm -rf "$check_dir"
		fi
	}
	trap cleanup EXIT HUP INT TERM

	echo "Checking the production build with ${hugo_version}..."
	HUGO_ENV=production HUGO_RESOURCEDIR="$check_dir/resources" hugo \
		--environment production \
		--minify \
		--destination "$check_dir/public"
	echo "Production build check succeeded; public was not modified."
	exit 0
fi

if [ ! -e public/.git ]; then
	echo "Error: the public submodule is not initialized." >&2
	echo "Run: git submodule update --init public" >&2
	exit 1
fi

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
export HUGO_ENV=production
hugo --environment production --minify

# Go To Public folder
cd public

# Add changes to git.
git add .

# Commit changes.
msg="Publishing site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"

# Push Public folder to microcks.github.io repo
git push origin master

# Go up to update the Public symlink
cd ..
git commit -m "$msg" public
git push origin master
