import urllib.request
import re

url = 'https://www.behance.net/gallery/223589195/CycleMate-Bicycle-App-UI-UX-Design'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

# Find image URLs
images = re.findall(r'https://mir-s3-cdn-cf.behance.net/project_modules/fs/[^\"\'\s]+', html)
images = list(set(images))

for i, img in enumerate(images[:3]):
    print(f'Downloading {img} as img_{i}.png')
    urllib.request.urlretrieve(img, f'C:/FoxSay/img_{i}.png')
