"use client";

/*
 * Simple rich text editor using contenteditable and document.execCommand.
 *
 * This component provides a basic WYSIWYG editing experience with a toolbar
 * supporting common formatting commands.  It avoids dependencies on
 * external editors (ReactQuill, TipTap) and works with React 18/19.
 *
 * Props:
 *  - value: HTML string representing the editor content.
 *  - onChange: callback fired with new HTML on input/command.
 */

import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep editor content in sync with external value
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || '';
    }
  }, [value]);

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    // Emit updated HTML after executing command
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  }

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    onChange((e.target as HTMLDivElement).innerHTML);
  }

  function promptLink() {
    const selection = document.getSelection();
    const currentLink = selection && selection.focusNode &&
      (selection.focusNode.parentElement?.tagName === 'A'
        ? (selection.focusNode.parentElement as HTMLAnchorElement).getAttribute('href')
        : '');
    const url = window.prompt('Enter link URL', currentLink || '');
    if (url === null) return;
    if (url === '') {
      exec('unlink');
    } else {
      exec('createLink', url);
    }
  }

  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap gap-2 mb-2 border rounded p-2 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >B</button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >I</button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >U</button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h2>')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >H2</button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<p>')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >P</button>
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >• List</button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >1. List</button>
        <button
          type="button"
          onClick={promptLink}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >Link</button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >Clear</button>
      </div>
      <div
        ref={ref}
        className="min-h-[160px] p-3 border rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}