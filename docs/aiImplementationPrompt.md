# AI Coding Agent Prompt

Below are the instructions for the AI coding agent to implement the code step by step, and after completion to update the project's progress:

## Step-by-Step Instructions

1. **Parse Changes**  
   - Read any supplied XML or code changes.
   - For each `<changed_files>` entry, apply the specified operation (CREATE, UPDATE, or DELETE) to the given file path.

2. **Implement Code**  
   - For CREATE or UPDATE, write the content exactly as provided in the `<file_code>` block.
   - For DELETE, remove the file at the specified path.

3. **Verify Changes**  
   - Confirm that the modifications compile and run without errors.
   - If there are test scripts, run them to ensure no regressions.

4. **Update Progress**  
   - After successfully applying all changes, open `docs/implementation/PROGRESS.md`.
   - Add a brief line summarizing what was changed or created.
   - If there are specific instructions or a section to note these changes, append them accordingly.

5. **Report**  
   - Provide a final summary or log indicating that the changes have been applied and tested.

Following these instructions ensures that each set of changes is properly implemented and documented. If there are discrepancies or errors, please log them and halt execution until further review. 