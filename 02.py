# portfolio_agent_advanced.py  (updated)
from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path
from typing import List, Optional

# ---- Force GPT-5 every run ----
os.environ["OPENAI_DEFAULT_MODEL"] = "gpt-5"

from agents import Agent, Runner, function_tool

# ---- Project root detection ----
PROJECT_MARKERS = {
    ".git", "package.json", "pnpm-lock.yaml", "yarn.lock", "next.config.js",
    "next.config.mjs", "vite.config.ts", "vite.config.js", "turbo.json"
}

def _discover_project_root(start: Path) -> Path:
    """Walk up from start until we find a folder that looks like a repo root."""
    cur = start
    for _ in range(20):  # don’t scan forever
        names = {p.name for p in cur.iterdir()} if cur.exists() else set()
        if PROJECT_MARKERS & names:
            return cur
        if cur.parent == cur:
            break
        cur = cur.parent
    return start  # fallback: whatever we started with

# You can override via env var if you already know the path:
_override = os.environ.get("PROJECT_ROOT")
if _override:
    BASE_DIR = Path(_override).resolve()
else:
    BASE_DIR = _discover_project_root(Path.cwd()).resolve()

ALLOWED_ROOT = BASE_DIR  # jail: never operate outside this folder tree

def _assert_inside_root(p: Path) -> None:
    try:
        rp = p.resolve()
        if ALLOWED_ROOT not in rp.parents and rp != ALLOWED_ROOT:
            raise PermissionError(f"Refused: path outside project root ({ALLOWED_ROOT}) -> {rp}")
    except FileNotFoundError:
        # If the file doesn't exist yet, check its parent
        parent = p.parent.resolve()
        if ALLOWED_ROOT not in parent.parents and parent != ALLOWED_ROOT:
            raise PermissionError(f"Refused: path outside project root ({ALLOWED_ROOT}) -> {p}")

# ---- Helpers ----
def _abs(p: str | Path) -> Path:
    pth = Path(p)
    rp = pth if pth.is_absolute() else (BASE_DIR / pth)
    return rp

def _read_text_limit(path: Path, max_bytes: int = 400_000) -> str:
    _assert_inside_root(path)
    with open(path, "rb") as f:
        data = f.read(max_bytes + 1)
    text = data.decode(errors="replace")
    if len(data) > max_bytes:
        text += "\n\n[TRUNCATED OUTPUT]"
    return text

def _safe_run(cmd: list[str], cwd: Optional[Path] = None, timeout: int = 180) -> str:
    try:
        if cwd is not None:
            _assert_inside_root(cwd)
        proc = subprocess.run(
            cmd, capture_output=True, text=True,
            cwd=str(cwd) if cwd else str(BASE_DIR),
            timeout=timeout
        )
        out = (proc.stdout or "") + (("\n" + proc.stderr) if proc.stderr else "")
        return out.strip()[:15000]
    except Exception as e:
        return f"[command failed] {e}"

# ---- In-memory state ----
NOTES: List[str] = []
TODOS: List[str] = []

# ---- Tools: Root management ----
@function_tool
def show_project_root() -> str:
    """Show the current project root where all operations are confined."""
    return f"Project root: {ALLOWED_ROOT}"

@function_tool
def set_project_root(path: str) -> str:
    """Manually set the project root (jail). Path must exist and be a directory."""
    global BASE_DIR, ALLOWED_ROOT
    new_root = Path(path).resolve()
    if not new_root.exists() or not new_root.is_dir():
        return f"Not a valid directory: {new_root}"
    BASE_DIR = new_root
    ALLOWED_ROOT = new_root
    return f"Project root set to: {new_root}"

# ---- Tools: Utility / Memory ----
@function_tool
def ping() -> str:
    """Liveness check."""
    return "pong"

@function_tool
def add_note(text: str) -> str:
    """Save a short note (session memory)."""
    t = text.strip()
    if not t: return "Refused: empty note."
    NOTES.append(t)
    return f"Saved note #{len(NOTES)}."

@function_tool
def list_notes() -> str:
    """List notes (session memory)."""
    if not NOTES: return "No notes yet."
    return "\n".join(f"{i+1}. {n}" for i, n in enumerate(NOTES))

@function_tool
def add_todo(item: str) -> str:
    """Add a todo (session memory)."""
    t = item.strip()
    if not t: return "Refused: empty todo."
    TODOS.append(t)
    return f"Added todo #{len(TODOS)}."

@function_tool
def list_todos() -> str:
    """List todos."""
    if not TODOS: return "No todos yet."
    return "\n".join(f"[ ] {i+1}. {t}" for i, t in enumerate(TODOS))

@function_tool
def complete_todo(index: int) -> str:
    """Complete a todo by 1-based index."""
    i = index - 1
    if i < 0 or i >= len(TODOS): return f"Invalid index: {index}"
    done = TODOS.pop(i)
    return f"Completed: {done}"

# ---- Tools: Files & Text (writes require confirm=True) ----
@function_tool
def list_dir(path: str = ".", recursive: bool = False) -> str:
    """List files/folders under a directory."""
    root = _abs(path)
    _assert_inside_root(root)
    if not root.exists(): return f"Path does not exist: {root}"
    if not root.is_dir(): return f"Not a directory: {root}"
    if not recursive:
        items = [f"{'[D]' if p.is_dir() else '[F]'} {p.name}" for p in sorted(root.iterdir())]
        return f"Listing {root}:\n" + "\n".join(items)
    lines: List[str] = []
    for d, _, files in os.walk(root):
        dpath = Path(d)
        lines.append(f"[D] {dpath}")
        for fn in files:
            lines.append(f"  [F] {fn}")
    return "\n".join(lines)

@function_tool
def read_text_file(path: str, max_bytes: int = 400_000) -> str:
    """Read a text file (truncated if huge)."""
    p = _abs(path)
    _assert_inside_root(p)
    if not p.exists(): return f"File not found: {p}"
    if not p.is_file(): return f"Not a file: {p}"
    return _read_text_limit(p, max_bytes=max_bytes)

@function_tool
def write_text_file(path: str, content: str, confirm: bool = False, overwrite: bool = True) -> str:
    """WRITE a file (requires confirm=True)."""
    if not confirm:
        return "DRY-RUN: set confirm=True to write."
    p = _abs(path)
    _assert_inside_root(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    if p.exists() and not overwrite:
        return f"Refused: exists and overwrite=False -> {p}"
    p.write_text(content, encoding="utf-8")
    return f"WROTE {len(content)} chars to {p}"

@function_tool
def append_text_file(path: str, content: str, confirm: bool = False) -> str:
    """APPEND to a file (requires confirm=True)."""
    if not confirm:
        return "DRY-RUN: set confirm=True to append."
    p = _abs(path)
    _assert_inside_root(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a", encoding="utf-8") as f:
        f.write(content)
    return f"APPENDED {len(content)} chars to {p}"

@function_tool
def search_replace_file(path: str, find: str, replace: str, confirm: bool = False, preview_only: bool = False) -> str:
    """Find/replace in a file. Preview or apply (confirm=True)."""
    p = _abs(path)
    _assert_inside_root(p)
    if not p.exists() or not p.is_file(): return f"File not found: {p}"
    text = p.read_text(encoding="utf-8")
    count = text.count(find)
    if count == 0: return "No matches."
    new_text = text.replace(find, replace)
    summary = f"Replacements: {count} in {p}"
    if preview_only or not confirm:
        head_old = text[:1200]
        head_new = new_text[:1200]
        mode = "PREVIEW" if preview_only else "DRY-RUN"
        return f"[{mode}] {summary}\n--- OLD (head) ---\n{head_old}\n--- NEW (head) ---\n{head_new}"
    p.write_text(new_text, encoding="utf-8")
    return f"[APPLIED] {summary}"

@function_tool
def regex_replace_file(path: str, pattern: str, replace: str, flags: str = "", confirm: bool = False, preview_only: bool = False) -> str:
    """Regex search/replace in a file."""
    p = _abs(path)
    _assert_inside_root(p)
    fl = 0
    if "i" in flags: fl |= re.IGNORECASE
    if "m" in flags: fl |= re.MULTILINE
    if "s" in flags: fl |= re.DOTALL
    text = p.read_text(encoding="utf-8")
    new_text, n = re.subn(pattern, replace, text, flags=fl)
    if n == 0: return "No matches."
    if preview_only or not confirm:
        return f"[DRY-RUN] Matches: {n} in {p}\n--- OLD (head) ---\n{text[:1200]}\n--- NEW (head) ---\n{new_text[:1200]}"
    p.write_text(new_text, encoding="utf-8")
    return f"[APPLIED] Regex replacements: {n} in {p}"

# ---- Tools: Controlled Commands (allowlists) ----
@function_tool
def run_git(args: str, working_dir: str = ".") -> str:
    """Run a SAFE subset of git commands."""
    allowed = ("status", "diff", "log", "add ", "restore ", "checkout ", "commit ", "branch", "switch", "rev-parse", "show")
    if not any(args.startswith(a) for a in allowed):
        return f"Blocked git command: {args!r}"
    return _safe_run(["git"] + args.split(), cwd=_abs(working_dir))

@function_tool
def run_npm(args: str, working_dir: str = ".") -> str:
    """Run SAFE npm commands (install, build, test, run <script>)."""
    allowed_prefixes = ("install", "run ", "test", "ci")
    if not any(args.startswith(p) for p in allowed_prefixes):
        return f"Blocked npm command: {args!r}"
    return _safe_run(["npm"] + args.split(), cwd=_abs(working_dir))

# ---- Tools: Reasoning / Review ----
@function_tool
def code_review_snippet(code: str, language: str = "auto", goals: str = "") -> str:
    """Heuristic code review (no execution). Provide suggestions & risks."""
    header = f"[Review goals: {goals}]" if goals else "[Review]"
    return f"{header}\n\nCODE START\n{code[:8000]}\nCODE END\n\nPlease provide:\n- bugs/risks\n- readability improvements\n- performance notes\n- security pitfalls\n- a minimal patch sketch (diff-like) if applicable."

@function_tool
def propose_commit_message(changes_summary: str, style: str = "conventional") -> str:
    """Draft a commit message from a short summary."""
    style = style.lower()
    if style == "conventional":
        return f"feat: {changes_summary.strip()}"
    return changes_summary.strip() or "chore: update"

# ---- Persona ----
SYSTEM_INSTRUCTIONS = f"""
You are PortfolioAgent (ADVANCED PARTNER).
Root of the project: {ALLOWED_ROOT}
Mission: be the user's business partner and technical right hand.
Obey the user, minimize questions, but ask when needed to avoid wrong edits.
NEVER perform file writes unless confirm=True is provided.
Always summarize actions, show brief diffs or previews before destructive operations.
Use small, surgical changes. Keep outputs concise.
"""

agent = Agent(
    name="PortfolioAgent",
    instructions=SYSTEM_INSTRUCTIONS,
    tools=[
        # root control
        show_project_root, set_project_root,
        # basics
        ping, add_note, list_notes, add_todo, list_todos, complete_todo,
        # files
        list_dir, read_text_file, write_text_file, append_text_file,
        search_replace_file, regex_replace_file,
        # commands
        run_git, run_npm,
        # reasoning
        code_review_snippet, propose_commit_message,
    ],
)

def main() -> None:
    print(f"PortfolioAgent (ADVANCED) ready. Project root: {ALLOWED_ROOT}")
    print("Type 'exit' to quit.")
    while True:
        try:
            user = input(">>> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            break
        if user.lower() in {"exit", "quit"}:
            print("Goodbye.")
            break
        res = Runner.run_sync(agent, user)
        print(res.final_output or "[no output]")

if __name__ == "__main__":
    if not os.environ.get("OPENAI_API_KEY"):
        print("WARNING: OPENAI_API_KEY not set. In PowerShell: $env:OPENAI_API_KEY='sk-...'")
    main()
