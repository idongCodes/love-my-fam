import os

# --- CONFIGURATION ---
# Files to include based on extension
INCLUDED_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.css', '.prisma', '.json', '.md'}

# Folders to completely ignore
IGNORED_DIRS = {
    'node_modules', 
    '.next', 
    '.git', 
    '.vscode', 
    'public',   # Binary images usually live here, safe to skip for code review
    'coverage',
    'dist',
    'build'
}

# Specific files to ignore
IGNORED_FILES = {
    'package-lock.json', 
    'yarn.lock', 
    'bun.lockb',
    'pnpm-lock.yaml',
    'bundle.py',          # Don't include this script itself
    'project_bundle.txt', # Don't include the output file
    '.DS_Store',
    '.env',               # SECURITY: Never bundle secrets!
    '.env.local'
}

OUTPUT_FILE = 'project_bundle.txt'

def is_text_file(filename):
    return any(filename.endswith(ext) for ext in INCLUDED_EXTENSIONS)

def bundle_project():
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        # Walk through the directory tree
        for root, dirs, files in os.walk('.'):
            # Modify 'dirs' in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            
            for file in files:
                if file in IGNORED_FILES:
                    continue
                
                if is_text_file(file):
                    file_path = os.path.join(root, file)
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                            # Write a clear separator and filename
                            outfile.write(f"\n{'='*80}\n")
                            outfile.write(f"FILE: {file_path}\n")
                            outfile.write(f"{'='*80}\n\n")
                            outfile.write(content)
                            outfile.write("\n")
                            
                        print(f"Added: {file_path}")
                    except Exception as e:
                        print(f"Skipping {file_path}: {e}")

    print(f"\n✅ Bundle complete! All code is in '{OUTPUT_FILE}'")

if __name__ == '__main__':
    bundle_project()