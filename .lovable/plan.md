I’ll fix the Work (portfolio) landing-page CMS editor so edits to the main Work page can be saved just as clearly as project edits.

Plan:
1. Add an obvious Work-page save action
   - Put a large “Save Work page changes” button directly inside the Work (portfolio) editor.
   - Keep the existing global Save bar, but make the Work page no longer dependent on finding it.
   - Show clear states: “No changes yet”, “Save Work page changes”, and “Saving…”.

2. Make the save button stay reachable
   - Add a sticky bottom action area inside the left CMS panel so Save remains visible while scrolling the Work editor.
   - Increase button size/contrast so it is clearly clickable.

3. Confirm Work landing fields are tracked correctly
   - Keep the Work landing page fields wired to `site_content` for:
     - Hero eyebrow
     - Hero subhead
     - Four highlight tile values, labels, and caveats
   - Ensure typing in these fields immediately registers unsaved changes and enables the save button.

4. Improve save feedback and failure handling
   - On successful save, show a success message and refresh the preview.
   - On failure, keep changes in the editor and show the exact error instead of silently failing.

5. Fix the editor warning that appears while editing Work
   - Update the text field component so it handles refs safely, removing the React warning shown in the console.

Technical notes:
- Main files to update: `src/components/admin/sections/WorkSection.tsx`, `src/components/admin/SaveBar.tsx`, `src/components/admin/CMSShell.tsx`, and `src/components/admin/fields/TextField.tsx`.
- No database changes are needed. The existing backend save function already works; project saves are succeeding, and the issue is the Work landing-page editor/save UI and dirty-state flow.