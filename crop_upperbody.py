from PIL import Image

def crop_upper_body():
    img = Image.open("images/developer_nobg.png")
    width, height = img.size
    print(f"Original size: {width}x{height}")
    
    # Crop top 58% (head, shoulders, chest, waist - no shoes, no lower legs)
    # Finding bounding box of non-transparent pixels
    bbox = img.getbbox() # (left, upper, right, lower)
    print(f"Bbox: {bbox}")
    
    left, upper, right, lower = bbox
    # We want from top of head to mid-waist (around 58% of character height)
    char_height = lower - upper
    crop_lower = int(upper + char_height * 0.56)
    
    cropped = img.crop((left, upper, right, crop_lower))
    cropped.save("images/developer_upperbody_nobg.png")
    print(f"Saved images/developer_upperbody_nobg.png with size {cropped.size}")

if __name__ == "__main__":
    crop_upper_body()
