from PIL import Image
import sys
import os
import shutil


def resize_icon(filename):
    folder = os.path.dirname(filename)
    img = Image.open(filename)
    for s in [128, 48, 19, 16]:
        img.thumbnail((s, s), Image.ANTIALIAS)
        img.save(f'{folder}/icon{s}.png', 'PNG')


def zip(foldername):
    print(os.path.expanduser('Desktop/'+foldername))
    shutil.make_archive(os.path.expanduser('~/Desktop/'+foldername), 'zip', foldername)


if __name__ == "__main__":
    if sys.argv[1] == 'resize':
        resize_icon(sys.argv[2])
    elif sys.argv[1] == 'zip':
        zip(sys.argv[2])
