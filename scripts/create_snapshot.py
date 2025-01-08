import os
from pathlib import Path
from typing import List, Set, Tuple
import json

def create_code_snapshot(
    base_dir: str = ".",
    directories: List[str] = [
        "src/lib/supabase",    # Supabase configuration and queries
        "src/app/dashboard",   # Dashboard where error occurs
        "src/lib/api",         # API layer
        "src/hooks",           # Data fetching hooks
        "src/types",           # Type definitions
        "src/components/dashboard", # Dashboard components
    ],
    output_file: str = "code_snapshot.md",
    include_file_extensions: Set[str] = {
        ".tsx",  # React components
        ".ts",   # TypeScript files
        ".env",  # Environment files
    },
    # Core files for data fetching analysis
    essential_files: Set[str] = {
        # Supabase Setup & Queries
        "src/lib/supabase/dashboardQueries.ts",     # Dashboard queries (error source)
        "src/lib/supabase/server.ts",               # Server client setup
        "src/lib/supabase/client.ts",               # Browser client setup
        "src/lib/supabase/middleware.ts",           # Supabase middleware
        ".env.example",                             # Environment variables template
        
        # Dashboard Implementation
        "src/app/dashboard/page.tsx",               # Main dashboard (error location)
        "src/app/dashboard/loading.tsx",            # Loading states
        "src/app/dashboard/error.tsx",              # Error handling
        "src/components/dashboard/metrics-card.tsx", # Metrics display
        
        # Data Fetching Core
        "src/hooks/useMetrics.ts",                  # Metrics hook
        "src/hooks/useTaxReturns.ts",              # Tax returns hook
        "src/lib/api/tax-returns.ts",              # Tax returns API
        "src/lib/api/metrics.ts",                  # Metrics API
        
        # Error Handling
        "src/app/error.tsx",                       # Global error page
        "src/lib/utils/error-handlers.ts",         # Error utilities
        
        # Types
        "src/types/database.types.ts",             # Database types
        "src/types/tax-returns.ts",                # Tax return types
        "src/types/metrics.ts",                    # Metrics types
        "src/types/supabase.ts",                   # Supabase types
        
        # Configuration
        "src/lib/config/supabase.ts",             # Supabase config
        "src/lib/config/database.ts",             # Database config
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
    min_file_size_kb: int = 0,     # Include all files
    max_total_size_mb: int = 10    # Increased size limit for more context
) -> str:
    """
    Creates a focused code snapshot for analyzing Supabase data fetching issues.
    """
    base_path = Path(base_dir).resolve()
    output_path = base_path / output_file
    total_size = 0
    max_total_bytes = max_total_size_mb * 1024 * 1024
    
    # Track file sizes for reporting
    file_sizes = []

    with open(output_path, "w", encoding="utf-8") as out_f:
        out_f.write("# Supabase Data Fetching Analysis\n\n")
        out_f.write("## Overview\n")
        out_f.write("This snapshot focuses on the Supabase data fetching error in the dashboard metrics.\n")
        out_f.write("Error: Failed to fetch pending tax returns in getDashboardMetrics.\n\n")
        
        # Process essential files first
        for essential_file in essential_files:
            file_path = base_path / essential_file
            if file_path.exists():
                size = process_file(file_path, base_path, out_f)
                if size > 0:
                    file_sizes.append((essential_file, size))
                total_size += size

        # Process directories
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
                    if total_size >= max_total_bytes:
                        print(f"Reached size limit of {max_total_size_mb}MB")
                        break

                    file_path = Path(root) / file_name
                    
                    # Skip files based on criteria
                    if should_skip_file(file_path, include_file_extensions, exclude_patterns, 
                                     exclude_files, min_file_size_kb):
                        continue

                    # Process the file
                    size = process_file(file_path, base_path, out_f)
                    if size > 0:
                        relative_path = file_path.relative_to(base_path)
                        file_sizes.append((str(relative_path), size))
                    total_size += size

        # Add file size summary at the end
        out_f.write("\n## File Size Analysis\n\n")
        out_f.write("| File | Size (KB) |\n")
        out_f.write("|------|------------|\n")
        
        # Sort files by size (largest first)
        file_sizes.sort(key=lambda x: x[1], reverse=True)
        
        for file_path, size in file_sizes:
            size_kb = size / 1024
            out_f.write(f"| {file_path} | {size_kb:.1f} |\n")

    print(f"Code snapshot created at: {output_path}")
    print(f"Total size: {total_size / 1024 / 1024:.2f}MB")
    print("\nLargest files:")
    for file_path, size in file_sizes[:5]:
        print(f"{file_path}: {size/1024:.1f}KB")
    
    return str(output_path)

def should_skip_file(file_path: Path, include_extensions: Set[str], 
                    exclude_patterns: Set[str], exclude_files: Set[str],
                    min_size_kb: int) -> bool:
    """Determines if a file should be skipped based on various criteria."""
    # Check minimum file size
    file_size = file_path.stat().st_size
    if file_size < min_size_kb * 1024:
        return True

    # Check file extension
    if file_path.suffix.lower() not in include_extensions:
        return True

    # Check if file matches exclude patterns
    if any(pattern in str(file_path) for pattern in exclude_patterns):
        return True

    # Check if file matches exclude files
    if any(file_path.name.endswith(pattern.replace('*', '')) for pattern in exclude_files):
        return True

    return False

def process_file(file_path: Path, base_path: Path, out_f) -> int:
    """Process a single file and return the number of bytes written."""
    try:
        relative_path = file_path.relative_to(base_path)
        content = file_path.read_text(encoding="utf-8", errors="ignore")
        
        # Skip empty files
        if len(content.strip()) < 10:
            return 0
            
        # Write file content
        out_f.write(f"### `{relative_path}`\n\n")
        out_f.write("```" + get_language_identifier(file_path.suffix) + "\n")
        out_f.write(content)
        out_f.write("\n```\n\n")
        
        return len(content.encode('utf-8'))
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

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