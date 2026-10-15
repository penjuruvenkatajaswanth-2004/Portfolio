import cv2
import numpy as np
from PIL import Image

def extract_hero():
    # Load image
    img = cv2.imread('images/developer.jpg')
    height, width = img.shape[:2]
    
    # GrabCut with refined mask
    rect = (int(width * 0.22), int(height * 0.05), int(width * 0.58), int(height * 0.92))
    
    mask = np.zeros(img.shape[:2], np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)
    
    print("Running GrabCut segmentation...")
    cv2.grabCut(img, mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)
    
    # 0 and 2 are background, 1 and 3 are foreground
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    
    # Remove residual purple background glow box outside character jacket (x < 330)
    # The character's arm/jacket starts at x > 310 in that region
    for y in range(int(height * 0.25), int(height * 0.60)):
        for x in range(0, int(width * 0.30)):
            # Purple background has high blue and red, low green relative to black jacket
            b, g, r = img[y, x]
            if (int(r) + int(b)) > 1.8 * int(g) and int(b) > 80:
                mask2[y, x] = 0
            # Also clear anything to the left of the jacket line
            if x < int(width * 0.25) and (r > 60 or b > 80):
                mask2[y, x] = 0

    # Also clear any residual right side background
    for y in range(int(height * 0.25), int(height * 0.60)):
        for x in range(int(width * 0.72), width):
            b, g, r = img[y, x]
            if (int(r) + int(b)) > 1.8 * int(g) and int(b) > 80:
                mask2[y, x] = 0

    # Convert BGR to RGBA
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Create alpha channel from mask
    alpha = (mask2 * 255).astype(np.uint8)
    
    # Smooth alpha edges slightly
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    
    # Combine RGBA
    rgba = np.dstack((img_rgb, alpha))
    
    # Save as PNG
    output_img = Image.fromarray(rgba)
    output_img.save('images/developer_nobg.png')
    print("Saved images/developer_nobg.png successfully!")

if __name__ == "__main__":
    extract_hero()
