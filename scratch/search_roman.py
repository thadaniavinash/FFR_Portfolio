import re

with open('c:/Users/thada/Desktop/Georgian/FRAME_FFR/Google_Antigravity/FFR_Website/index.html', encoding='utf-8') as f:
    for i, line in enumerate(f):
        # search for Roman numerals in content
        if any(term in line for term in [' I ', ' II ', ' III ', ' IV ', ' V ']):
            print(f"{i+1}: {line.strip()}")
