import os

# --- CONFIGURATION ---
OUTPUT_FILE = 'project_bundle.txt'

# File extensions to include in the bundle
INCLUDED_EXTENSIONS = {
    '.ts', '.tsx', 
    '.js', '.jsx', 
    '.css', 
    '.prisma',
    '.json' 
}

# Directories to strictly ignore
IGNORE_DIRS = {
    'node_modules', 
    '.next', 
    '.git', 
    '.vscode',
    'coverage',
    'dist',
    'build'
}

# Specific files to ignore (to reduce noise)
IGNORE_FILES = {
    'package-lock.json', 
    'yarn.lock', 
    'pnpm-lock.yaml',
    'bundle.py', 
    'project_bundle.txt',
    'next-env.d.ts',
    'README.md',
    '.DS_Store'
}

def is_relevant_file(filename):
    """Check if file has a valid extension and isn't in the ignore list."""
    if filename in IGNORE_FILES:
        return False
    return any(filename.endswith(ext) for ext in INCLUDED_EXTENSIONS)

def bundle_project():
    print(f"Bundling project into {OUTPUT_FILE}...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        # Walk through the current directory
        for root, dirs, files in os.walk('.'):
            # Modify dirs in-place to prevent walking into ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for file in files:
                if is_relevant_file(file):
                    file_path = os.path.join(root, file)
                    
                    # Create a clean relative path for the header (e.g., "src/app/page.tsx")
                    relative_path = os.path.relpath(file_path, '.')

                    print(f"Processing: {relative_path}")

                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                            # Write Header
                            outfile.write("=" * 50 + "\n")
                            outfile.write(f"FILE: {relative_path}\n")
                            outfile.write("=" * 50 + "\n")
                            
                            # Write Content
                            outfile.write(content)
                            outfile.write("\n\n")
                            
                    except Exception as e:
                        print(f"⚠️ Could not read {relative_path}: {e}")

    print(f"\n✅ Success! All files bundled into '{OUTPUT_FILE}'")

if __name__ == "__main__":
    bundle_project()