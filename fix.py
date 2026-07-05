with open("package.json", "r") as f:
    lines = f.readlines()
with open("package.json", "w") as f:
    for line in lines:
        if line.startswith("<<<<<<< HEAD"):
            continue
        if line.startswith("=======_".replace("_", "")):
            continue
        if line.startswith(">>>>>>> origin/master"):
            continue
        if "rolldown-plugin-dts" in line:
            continue
        if "ts-jest\": \"^29.1.1" in line:
            continue
        f.write(line)
