I can see the issue from your screenshot: the Work page does technically has a save control at the bottom, but it appears white/faded on a pale background, making it look missing or disabled. I’ll make the save action impossible to miss and usable for this section.

Plan:

1. Make the global save bar visually obvious
   - Change the Save button from a small text button into a large, high-contrast full button when there are unsaved changes.
   - Ensure it stays clickable and no longer appears washed out/white against the yellow unsaved bar.
   - Keep the disabled “Saved” state visually distinct only when there are no changes.

2. Add a dedicated Work page save panel
   - Add a prominent “Save Work page changes” button directly inside the Work (portfolio) editor section.
   - Place it both near the top of the Work section and at the bottom after the highlight tile fields, so you can save without hunting for the footer bar.
   - Show clear states: “Save Work page changes”, “Saving…”, and “Saved”.

3. Make the Work editor scroll area safer
   - Add extra bottom padding to the editor content so the sticky save bar does not overlap the final fields.
   - Keep the Save bar fixed/sticky at the bottom of the CMS panel above the “Editing: /work” footer.

4. Improve save feedback
   - On successful save, show a toast confirming how many changes were saved.
   - On save failure, show a clear error message instead of silently failing.

Technical details:

- Update `src/components/admin/SaveBar.tsx` so its active save button uses stronger styles and avoids the current pale/disabled-looking appearance.
- Update `src/components/admin/sections/WorkSection.tsx` to include a local Work-specific save button wired to the same `saveAllDirty()` function.
- If needed, adjust `src/components/admin/CMSShell.tsx` spacing so the save controls remain visible and not hidden by the footer.

No database changes are needed.