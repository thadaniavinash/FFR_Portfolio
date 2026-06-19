import re

with open('c:/Users/thada/Desktop/Georgian/FRAME_FFR/Google_Antigravity/FFR_Website/index.html', encoding='utf-8') as f:
    for i, line in enumerate(f):
        # Look for Roman numerals like I., II., III., IV., V., etc.
        # Check for both uppercase and lowercase
        matches = re.findall(r'\b(?:[IVX]+|[ivx]+)\b', line)
        for m in matches:
            # check if it's followed by a dot or bracket, or part of a list
            # and ignore common words like "I" (pronoun)
            if m.lower() in ['i', 'ii', 'iii', 'iv', 'v']:
                # Print the line if it seems to be a list or title
                if any(x in line for x in ['.', ')', '>', '<']):
                    print(f"{i+1} [{m}]: {line.strip()[:100]}")
