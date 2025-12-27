"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * A simple provider to expose a global edit mode toggle. When edit mode is
 * enabled, pages can render content in an editable state (e.g. using
 * contentEditable or form controls). This context stores a boolean flag
 * and a function to toggle it. Components can consume the state via
 * the useEditMode hook.
 */
interface EditModeContextValue {
  isEditing: boolean;
  toggleEdit: () => void;
}

const EditModeContext = createContext<EditModeContextValue | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);
  return (
    <EditModeContext.Provider value={{ isEditing, toggleEdit }}>
      {children}
    </EditModeContext.Provider>
  );
}

/**
 * Hook to access edit mode state and the toggle function. Throws an error
 * if used outside of EditModeProvider.
 */
export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return ctx;
}