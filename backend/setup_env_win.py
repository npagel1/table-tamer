import os
import subprocess
import sys

def run_command(command, shell=False):
    """Run a system command and handle errors."""
    result = subprocess.run(command, shell=shell, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running command: {command}")
        print(result.stderr)
        sys.exit(result.returncode)
    else:
        print(result.stdout)

# Step 1: Create a virtual environment
venv_path = ".venv"
print("Creating virtual environment...")
run_command([sys.executable, "-m", "venv", venv_path])

# Step 2: Activate the virtual environment (Windows PowerShell)
activate_script = os.path.join(venv_path, "Scripts", "Activate.ps1")

# Step 3: Upgrade pip
print("Upgrading pip...")
run_command([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])

# Step 4: Create a .gitignore file
gitignore_path = os.path.join(venv_path, ".gitignore")
with open(gitignore_path, "w") as f:
    f.write("*\n")

print(f".gitignore created at {gitignore_path}")

# Step 5: Install dependencies from requirements.txt
if os.path.exists("requirements.txt"):
    print("Installing dependencies from requirements.txt...")
    run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
else:
    print("No requirements.txt found. Skipping dependency installation.")

print("Setup complete!")