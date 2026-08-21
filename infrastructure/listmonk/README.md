# listmonk customisation

## Why these files exist

listmonk's opt-in confirmation email is **not** editable from the admin UI.
Templates created there are of type `campaign` or `tx`; the opt-in mail uses a
template compiled into the binary. Creating a `tx` template named "Opt-In"
changes nothing — `tx` templates are only sent when your own code calls
`POST /api/tx`.

The only way to change the opt-in email is `--static-dir`, which makes
listmonk read `email-templates/` from disk instead of from the binary.

## Layout, and why it matters

```
static/email-templates/    → /listmonk/static   (read via --static-dir)
uploads/                   → /listmonk/uploads  (served at {root_url}/uploads/)
```

These are **different mounts with different purposes**. Logos must go in
`uploads/`, because that is what `{root_url}/uploads/…` resolves to and what
the templates reference. Putting them under `static/` produces URLs that
resolve to nothing, and the images silently fail to load in every recipient's
mail client.

## What is global and what is per-list

Global, and not changeable per list:

- `From:` address (`app.from_email`) — one sender for every list on every domain
- Subject — comes from the i18n string `email.optin.confirmSubTitle`

Per-list, via the template:

- everything in the body, including which logo is shown

The template selects a logo from **list tags**, not list names, so renaming a
list in the UI cannot silently break the branding:

| tag | logo | brand shown |
|---|---|---|
| `strata` | strata.png | Write with Strata |
| `daon` | daon.png | DAON Network |
| `greenfield` | greenfield.png | The Greenfield Override |

An untagged list gets no logo rather than the wrong one.

## Logos

180×180 PNG. **Not SVG** — Gmail strips `<img src="*.svg">` entirely and
Outlook will not render it, so an SVG logo is an invisible logo. `daon.png`
was rasterised from `daon.network/assets/images/logo.svg`; `greenfield.png`
was resized from the 6000×6000 `mariposa-black.png`.

## Changing a template

1. Edit the file here.
2. Merge, then dispatch **📬 Deploy Listmonk**.

The deploy ships both directories before starting the container. Without that
step a fresh box gets `--static-dir` pointing at an empty directory, listmonk
falls back to its built-in templates, and the branding disappears with no
error logged anywhere.

## Verifying a change

The opt-in mail cannot be previewed from the admin UI. To see what actually
sends, point listmonk's SMTP at a catcher on the same Docker network, trigger
a subscription, and read the message — then set SMTP back:

```bash
docker run -d --name mailcatcher --network liberation-platform-network \
  python:3.11-slim sh -c 'pip install -q aiosmtpd && python /c.py'
```
