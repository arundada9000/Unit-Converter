"""Validate the static site: all HTML pages parse and local assets exist."""

import os
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.local_refs = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in ("src", "href") and value and not value.startswith(("http", "//", "#", "mailto:", "tel:", "data:")):
                self.local_refs.append(value)


def main():
    errors = []
    pages = []
    for f in sorted(os.listdir(ROOT)):
        if f.endswith(".html"):
            pages.append(f)

    if not pages:
        errors.append("No HTML pages found")

    for page in pages:
        path = os.path.join(ROOT, page)
        try:
            with open(path, encoding="utf-8") as fh:
                content = fh.read()
        except UnicodeDecodeError:
            errors.append(f"{page}: not valid UTF-8")
            continue

        parser = PageParser()
        try:
            parser.feed(content)
        except Exception as exc:
            errors.append(f"{page}: parse error - {exc}")

        for ref in parser.local_refs:
            clean = ref.split("?")[0].split("#")[0]
            if not clean:
                continue
            target = os.path.normpath(os.path.join(os.path.dirname(path), clean))
            if not os.path.exists(target):
                # Netlify pretty URLs map ./length -> length.html
                html_target = target + ".html"
                if os.path.exists(html_target):
                    continue
                errors.append(f"{page}: missing local reference -> {ref}")

    if errors:
        for err in errors:
            print(f"ERROR: {err}")
        sys.exit(1)
    print(f"OK: validated {len(pages)} HTML pages and their local assets")


if __name__ == "__main__":
    main()
