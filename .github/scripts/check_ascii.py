"""Enforce ASCII-only source files (copyright symbol is the only exception)."""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

ALLOWED = set("\u00a9")  # copyright sign

# HTML pages intentionally contain a heart emoji in the footer (site design).
# This check covers documentation and source files only.
EXTENSIONS = (".css", ".js", ".md", ".json", ".txt", ".xml")


def main():
    errors = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in (".git", ".github", "screenshots", "assets", "images")]
        for name in sorted(filenames):
            path = os.path.join(dirpath, name)
            if not path.endswith(EXTENSIONS):
                continue
            with open(path, encoding="utf-8-sig", errors="ignore") as fh:
                content = fh.read()
            bad = sorted({ch for ch in content if ord(ch) > 127 and ch not in ALLOWED})
            if bad:
                errors.append(f"{os.path.relpath(path, ROOT)}: non-ASCII chars -> {[hex(ord(c)) for c in bad]}")

    if errors:
        for err in errors:
            print(f"ERROR: {err}")
        sys.exit(1)
    print("OK: all source files are ASCII")


if __name__ == "__main__":
    sys.exit(main())
