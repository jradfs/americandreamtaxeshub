import os
from pathlib import Path

def write_project_overview(output_file):
    """Write project overview to the snapshot."""
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("# Code Analysis Snapshot\n\n")
        f.write("## Project Overview\n\n")
        f.write("### Goals\n")
        f.write("- Build a scalable tax management platform\n")
        f.write("- Implement modern tech stack (Next.js, TypeScript, Supabase)\n")
        f.write("- Focus on type safety and maintainability\n\n")
        f.write("### Tech Stack\n")
        f.write("- Next.js 13+\n")
        f.write("- TypeScript\n")
        f.write("- Supabase\n")
        f.write("- Tailwind CSS\n")
        f.write("- shadcn/ui components\n\n")

def write_directory_structure(output_file):
    """Write directory structure to the snapshot."""
    with open(output_file, "a", encoding="utf-8") as f:
        f.write("## Directory Structure\n\n")
        f.write("```\n")
        f.write("src/\n")
        f.write("  ├── app/           # Next.js 13+ app directory\n")
        f.write("  ├── components/    # React components\n")
        f.write("  ├── hooks/         # Custom React hooks\n")
        f.write("  ├── lib/           # Utility functions and services\n")
        f.write("  ├── types/         # TypeScript type definitions\n")
        f.write("  └── styles/        # Global styles and CSS modules\n")
        f.write("```\n\n")

def write_core_configuration(output_file):
    """Write core configuration files to the snapshot."""
    with open(output_file, "a", encoding="utf-8") as f:
        f.write("## Core Configuration\n\n")
        
        # Write next.config.js if it exists
        if os.path.exists("next.config.js"):
            f.write("### next.config.js\n\n")
            f.write("```js\n")
            with open("next.config.js", "r", encoding="utf-8") as config_file:
                f.write(config_file.read())
            f.write("```\n\n")
            
        # Write package.json if it exists
        if os.path.exists("package.json"):
            f.write("### package.json\n\n")
            f.write("```json\n")
            with open("package.json", "r", encoding="utf-8") as package_file:
                f.write(package_file.read())
            f.write("```\n\n")

def write_documentation_section(output_file, docs_dir="docs"):
    """Write documentation files to the snapshot."""
    with open(output_file, "a", encoding="utf-8") as f:
        f.write("\n## Documentation\n\n")
        
        # Define documentation categories
        categories = {
            "ai-architecture": "AI Architecture",
            "implementation": "Implementation",
            "specifications": "Specifications",
            "FirmSOPs.md": "Standard Operating Procedures"
        }
        
        # Write each category
        for subdir, title in categories.items():
            f.write(f"\n### {title}\n\n")
            
            # Handle FirmSOPs.md separately
            if subdir == "FirmSOPs.md":
                if os.path.exists(os.path.join(docs_dir, subdir)):
                    with open(os.path.join(docs_dir, subdir), "r", encoding="utf-8") as doc_file:
                        f.write(doc_file.read())
                        f.write("\n\n")
                continue
                
            # Process subdirectory
            subdir_path = os.path.join(docs_dir, subdir)
            if os.path.exists(subdir_path):
                for root, _, files in os.walk(subdir_path):
                    for file in files:
                        if file.endswith(".md"):
                            file_path = os.path.join(root, file)
                            with open(file_path, "r", encoding="utf-8") as doc_file:
                                f.write(f"#### {file}\n\n")
                                f.write(doc_file.read())
                                f.write("\n\n")

def process_source_files(output_file, directories, include_file_extensions, exclude_patterns, min_lines, max_lines_per_file):
    """Process and write source code files to the snapshot."""
    with open(output_file, "a", encoding="utf-8") as f:
        for directory in directories:
            if not os.path.exists(directory):
                continue
                
            for root, _, files in os.walk(directory):
                # Skip excluded directories
                if any(pattern in root for pattern in exclude_patterns):
                    continue
                    
                for file in files:
                    if not file.endswith(include_file_extensions):
                        continue
                        
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, "r", encoding="utf-8") as source_file:
                            content = source_file.read()
                            lines = content.splitlines()
                            
                            if len(lines) < min_lines:
                                continue
                                
                            if len(lines) > max_lines_per_file:
                                lines = lines[:max_lines_per_file]
                                content = "\n".join(lines)
                                
                            f.write(f"\n### `{file_path}`\n\n")
                            f.write("```" + file_path.split(".")[-1] + "\n")
                            f.write(content)
                            f.write("\n```\n")
                    except Exception as e:
                        print(f"Error processing file {file_path}: {str(e)}")

def create_code_snapshot(
    directories=["src"],
    output_file="code_snapshot.md",
    include_file_extensions=(".tsx", ".ts", ".js", ".jsx", ".css", ".scss", ".json", ".md", ".prisma", ".sql", ".env.example"),
    exclude_patterns=("node_modules", ".next", "dist", "__pycache__", ".git"),
    min_lines=1,
    max_lines_per_file=5000,
    max_total_lines=200000
):
    """Create a comprehensive code snapshot of the project."""
    try:
        # Write project overview
        write_project_overview(output_file)
        
        # Write directory structure
        write_directory_structure(output_file)
        
        # Write core configuration
        write_core_configuration(output_file)
        
        # Write documentation section
        write_documentation_section(output_file)
        
        # Process source code files
        process_source_files(output_file, directories, include_file_extensions, exclude_patterns, min_lines, max_lines_per_file)
        
    except Exception as e:
        print(f"Error creating code snapshot: {str(e)}")
        raise

if __name__ == "__main__":
    create_code_snapshot() 