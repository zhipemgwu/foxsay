# FoxSay immersive chat assets

Put visual-novel style assets here.

## Partner portraits

Path pattern:

```text
public/immersive/partners/P001-normal.png
public/immersive/partners/P001-soft.png
public/immersive/partners/P001-happy.png
public/immersive/partners/P001-angry.png
public/immersive/partners/P002-normal.png
public/immersive/partners/P002-soft.png
...
public/immersive/partners/P005-normal.png
public/immersive/partners/P005-soft.png
```

Recommended format: transparent PNG or WebP, full-body or knee-up, character centered.
State naming: `normal` is default, `happy` is used after positive affinity changes, `angry` is used after negative affinity changes, `soft` is a fallback/alternate emotional state.

Partner mapping:

```text
P001 夏柚
P002 林晓棠
P003 陈若宁
P004 周念安
P005 何雨欣
```

## Backgrounds

Path pattern:

```text
public/immersive/backgrounds/L001.jpg
public/immersive/backgrounds/L002.jpg
...
public/immersive/backgrounds/L030.jpg
```

Fallback paths also supported:

```text
public/immersive/backgrounds/story.jpg
public/immersive/backgrounds/challenge.jpg
```

Current code falls back to the existing chapter/role images when these files are missing.
