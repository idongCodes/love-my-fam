import os

# --- CONFIGURATION ---
# 1. File types to include (covers your new components and actions)
INCLUDED_EXTENSIONS = {
    '.ts', '.tsx',      # React & TypeScript
    '.js', '.jsx',      # JavaScript
    '.css',             # Styles
    '.prisma',          # Database Schema
    '.json',            # Config files (package.json, tsconfig)
    '.md'               # Documentation
}

# 2. Folders to ignore (keeps the bundle clean)
IGNORED_DIRS = {
    'node_modules', 
    '.next', 
    '.git', 
    '.vscode', 
    'public',   
    'coverage',
    'dist',
    'build'
}

# 3. Specific files to ignore (SECURITY: Secrets are blocked here)
IGNORED_FILES = {
    'package-lock.json', 
    'yarn.lock', 
    'bun.lockb',
    'pnpm-lock.yaml',
    'bundle.py',          # Don't bundle the bundler
    'project_bundle.txt', # Don't bundle the output
    '.DS_Store',
    '.env',               # BLOCKED
    '.env.local',         # BLOCKED
    '.env.production',    # BLOCKED
    '.eslintrc.json'      # Optional: skip lint config to save space
}

OUTPUT_FILE = 'project_bundle.txt'

def is_text_file(filename):
    return any(filename.endswith(ext) for ext in INCLUDED_EXTENSIONS)

def bundle_project():
    print(f"📦 Bundling project into '{OUTPUT_FILE}'...")
    file_count = 0
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        # Walk through the directory tree
        for root, dirs, files in os.walk('.'):
            # Modify 'dirs' in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            
            # Sort files to keep the output organized
            files.sort()
            
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
                            
                        print(f"  - Added: {file_path}")
                        file_count += 1
                    except Exception as e:
                        print(f"  ! Error reading {file_path}: {e}")

    print(f"\n✅ Success! Bundled {file_count} files into '{OUTPUT_FILE}'")

if __name__ == '__main__':
    bundle_project()