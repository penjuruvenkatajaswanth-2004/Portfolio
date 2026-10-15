import rembg
from PIL import Image

def process():
    print("Processing image background removal...")
    img = Image.open("images/developer.jpg")
    output = rembg.remove(img)
    output.save("images/developer_nobg.png")
    print("Successfully saved images/developer_nobg.png")

if __name__ == "__main__":
    process()
