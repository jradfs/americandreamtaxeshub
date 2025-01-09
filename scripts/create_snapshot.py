import os
from pathlib import Path
from typing import List, Set, Tuple
import json

def create_code_snapshot(
    base_dir: str = ".",
    directories: List[str] = [
        "src/lib/supabase",    # Supabase and database setup
        "src/lib/api",         # API endpoints
        "src/hooks",           # React hooks
        "src/app/dashboard",   # Dashboard pages
        "src/components/dashboard", # Dashboard components
        "src/components/metrics",   # Metrics components
        "src/components/tables",    # Data tables
        "src/types",           # TypeScript types
        "src/components/tasks",      # Task components
        "src/components/projects",   # Project components
        "src/components/forms",      # Form components
        "src/lib/validations",      # Validation logic
        "src/lib/services",         # Services
        "src/lib/utils",            # Utilities
        "src/tests/integration",    # Integration tests
        "docs",                     # Documentation
    ],
    output_file: str = "code_snapshot.md",
    include_file_extensions: Set[str] = {
        ".tsx",  # React components
        ".ts",   # TypeScript files
        ".sql",  # SQL migrations
    },
    # Core files for analysis
    essential_files: Set[str] = {
        # Task Management Core
        "src/components/tasks/task-side-panel.tsx",     # Task side panel with form issues
        "src/components/tasks/task-card.tsx",           # Task card with type mismatches
        "src/components/tasks/task-dialog.tsx",         # Task dialog with prop issues
        "src/components/tasks/task-list.tsx",           # Task list with integration issues
        
        # Project Integration
        "src/components/projects/project-tasks.tsx",    # Project tasks with prop mismatches
        "src/components/projects/project-details.tsx",  # Project details integration
        
        # Type Definitions
        "src/types/tasks.ts",                          # Task type definitions
        "src/types/database.types.ts",                 # Database types
        "src/types/forms.ts",                          # Form types
        "src/types/projects.ts",                       # Project types
        "src/types/common.ts",                         # Common type utilities
        
        # Form Handling & Validation
        "src/lib/validations/task.ts",                 # Task validation schemas
        "src/lib/validations/schema.ts",               # Common validation schemas
        "src/components/forms/form-provider.tsx",      # Form context provider
        "src/components/ui/form.tsx",                  # Base form components
        
        # Services & API
        "src/lib/services/task.service.ts",            # Task service implementation
        "src/app/api/tasks/route.ts",                  # Task API endpoints
        "src/lib/api/tasks.ts",                        # Task API client
        
        # State Management & Hooks
        "src/hooks/useTaskManagement.ts",              # Task management hook
        "src/hooks/useProjects.ts",                    # Project management hook
        "src/hooks/useForm.ts",                        # Form handling hook
        
        # Error Handling
        "src/components/error-boundary.tsx",           # Error boundary component
        "src/lib/utils/error-handlers.ts",             # Error utilities
        "src/app/error.tsx",                           # Root error page
        
        # Database Schema
        "supabase/migrations/20240112050000_add_completed_at.sql",      # Task completion
        "supabase/migrations/20240112050001_add_onboarding_notes.sql",  # Client notes
        "supabase/migrations/20240112050002_update_completed_tasks.sql", # Task updates
        
        # Integration Tests
        "src/tests/integration/task-flow.test.ts",     # Task flow tests
        "src/tests/integration/form-validation.test.ts", # Form validation tests
        
        # Documentation
        "docs/PHASE1.MD",                              # Phase 1 documentation
        "docs/TYPE_SYSTEM.md",                         # Type system documentation
        "docs/FORM_HANDLING.md",                       # Form handling documentation
        
        # Utils & Helpers
        "src/lib/utils/type-guards.ts",                # Type guard utilities
        "src/lib/utils/form-helpers.ts",               # Form helper functions
        "src/lib/utils/validation.ts",                 # Validation utilities
        
        # Example Usage & Templates
        "src/components/examples/task-form-example.tsx", # Example implementation
        "src/components/templates/task-templates.tsx",   # Task templates
    },
    exclude_files: Set[str] = {
        "*.stories.tsx",
        "*.test.ts",
        "*.spec.ts",
        "*.d.ts",
        "*.mock.ts",
    },
    exclude_patterns: Set[str] = {
        "node_modules",
        ".next",
        "dist",
        "__tests__",
        "__mocks__",
    },
    min_lines: int = 10,          # Minimum lines to include a file
    max_lines_per_file: int = 500,  # Maximum lines per file
    max_total_lines: int = 20000  # Maximum total lines
) -> str:
    """
    Creates a comprehensive code snapshot while keeping total lines under limit.
    """
    base_path = Path(base_dir).resolve()
    output_path = base_path / output_file
    total_lines = 0
    
    # Track file sizes and lines for reporting
    file_stats = []  # List of (file_path, size, line_count)

    with open(output_path, "w", encoding="utf-8") as out_f:
        out_f.write("# Code Analysis Snapshot\n\n")
        out_f.write("## Overview\n")
        out_f.write("This snapshot includes core functionality for data fetching, dashboard, and metrics.\n\n")
        
        # Process essential files first
        for essential_file in essential_files:
            file_path = base_path / essential_file
            if file_path.exists():
                stats = process_file(file_path, base_path, out_f, max_lines_per_file)
                if stats:
                    file_stats.append((essential_file, *stats))
                    total_lines += stats[1]
                if total_lines >= max_total_lines:
                    break

        # Process directories if we haven't hit line limit
        if total_lines < max_total_lines:
            for directory in directories:
                dir_path = base_path / directory
                if not dir_path.exists():
                    continue
                
                for root, dirs, files in os.walk(dir_path):
                    # Skip excluded directories
                    dirs[:] = [d for d in dirs if not any(
                        pattern in d for pattern in exclude_patterns
                    )]
                    
                    # Process files
                    for file_name in sorted(files):
                        if total_lines >= max_total_lines:
                            break

                        file_path = Path(root) / file_name
                        
                        # Skip files based on criteria
                        if should_skip_file(file_path, include_file_extensions, exclude_patterns, 
                                         exclude_files, min_lines):
                            continue

                        # Process the file
                        stats = process_file(file_path, base_path, out_f, max_lines_per_file)
                        if stats:
                            relative_path = file_path.relative_to(base_path)
                            file_stats.append((str(relative_path), *stats))
                            total_lines += stats[1]

        # Add file analysis at the end
        out_f.write("\n## File Analysis\n\n")
        out_f.write("| File | Lines | Size (KB) |\n")
        out_f.write("|------|-------|------------|\n")
        
        # Sort files by line count (largest first)
        file_stats.sort(key=lambda x: x[2], reverse=True)
        
        for file_path, size, line_count in file_stats:
            size_kb = size / 1024
            out_f.write(f"| {file_path} | {line_count} | {size_kb:.1f} |\n")

        # Add total stats
        out_f.write(f"\nTotal Lines: {total_lines}\n")
        total_size_kb = sum(size for _, size, _ in file_stats) / 1024
        out_f.write(f"Total Size: {total_size_kb:.1f}KB\n")

    print(f"Code snapshot created at: {output_path}")
    print(f"Total lines: {total_lines}")
    print(f"Total size: {total_size_kb:.1f}KB")
    print("\nLargest files by line count:")
    for file_path, _, line_count in file_stats[:5]:
        print(f"{file_path}: {line_count} lines")
    
    return str(output_path)

def should_skip_file(file_path: Path, include_extensions: Set[str], 
                    exclude_patterns: Set[str], exclude_files: Set[str],
                    min_lines: int) -> bool:
    """Determines if a file should be skipped based on various criteria."""
    # Check file extension
    if file_path.suffix.lower() not in include_extensions:
        return True

    # Check if file matches exclude patterns
    if any(pattern in str(file_path) for pattern in exclude_patterns):
        return True

    # Check if file matches exclude files
    if any(file_path.name.endswith(pattern.replace('*', '')) for pattern in exclude_files):
        return True

    # Check minimum lines
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            line_count = sum(1 for _ in f)
            if line_count < min_lines:
                return True
    except:
        return True

    return False

def process_file(file_path: Path, base_path: Path, out_f, max_lines: int) -> Tuple[int, int]:
    """Process a single file and return (bytes_written, lines_written)."""
    try:
        relative_path = file_path.relative_to(base_path)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.splitlines()
        
        # Skip empty files
        if len(lines) < 10:
            return None
            
        # Truncate large files
        if len(lines) > max_lines:
            half_lines = max_lines // 2
            truncated_lines = lines[:half_lines] + [
                "",
                f"... (file truncated, showing {max_lines} of {len(lines)} lines) ...",
                ""
            ] + lines[-half_lines:]
            content = '\n'.join(truncated_lines)
            
        # Write file content
        out_f.write(f"### `{relative_path}`\n\n")
        out_f.write("```" + get_language_identifier(file_path.suffix) + "\n")
        out_f.write(content)
        out_f.write("\n```\n\n")
        
        return (len(content.encode('utf-8')), min(len(lines), max_lines))
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def get_language_identifier(extension: str) -> str:
    """Returns the appropriate language identifier for syntax highlighting."""
    language_map = {
        ".ts": "typescript",
        ".tsx": "typescript",
        ".js": "javascript",
        ".jsx": "javascript",
        ".sql": "sql",
    }
    return language_map.get(extension.lower(), "")

if __name__ == "__main__":
    snapshot_path = create_code_snapshot() 