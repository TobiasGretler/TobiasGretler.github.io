import os as o
import sys

def load(directory): 
    imgs = o.listdir(f"../img/{directory}")
    fmt = ""
    for img in imgs:
        fmt += "\t{\n\t\tsrc:\"assets/img/"+directory+"/"+img+"\"\n\t},\n"
    return fmt[:-2]

def update_constant(const_name, directory):
    file_path = "images.js"
    with open(file_path, 'r') as file:
        content = file.read()

    if f"const {const_name} =" in content:
        start_index = content.find(f"const {const_name} =")
        end_index = content.find("];", start_index) + 2
        new_content = content[:start_index] + f"const {const_name} = [\n{load(directory)}\n];" + content[end_index:]
    else:
        new_content = content + f"\nconst {const_name} = [\n{load(directory)}\n];"

    with open(file_path, 'w') as file:
        file.write(new_content)

update_constant(sys.argv[1], sys.argv[2])
