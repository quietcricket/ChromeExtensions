from PIL import Image
import sys
import os


def resize_icon(filename):
    folder = os.path.dirname(filename)
    img = Image.open(filename)
    for s in [128, 48, 19, 16]:
        img.thumbnail((s, s), Image.ANTIALIAS)
        img.save(f'{folder}/icon{s}.png', 'PNG')


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == 'resize':
        print(sys.argv)
        resize_icon(sys.argv[2])
