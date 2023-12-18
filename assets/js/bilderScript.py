import os as o
import sys

def load(directory): 
    imgs = o.listdir(f"../img/{directory}")
    fmt = ""
    for img in imgs:
        fmt += "\t{\n\t\tsrc:\"assets/img/"+directory+"/"+img+"\"\n\t},\n"
    return fmt[:-2]

def Json(fileName, directory):
    file = open(fileName, "w+")
    file.write(f"const imageGalleryData = [\n{load(directory)}\n];")
    file.close()

Json(sys.argv[1], sys.argv[2])