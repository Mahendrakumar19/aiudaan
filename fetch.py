with open("pen_auth.html", "r", encoding="utf-8") as f:
    html_content = f.read()

from html.parser import HTMLParser

class CodePenParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_pre = False
        self.pres = []
        
    def handle_starttag(self, tag, attrs):
        if tag == 'pre':
            self.in_pre = True
            
    def handle_endtag(self, tag):
        if tag == 'pre':
            self.in_pre = False
            
    def handle_data(self, data):
        if self.in_pre:
            self.pres.append(data)

parser = CodePenParser()
parser.feed(html_content)

for idx, pre in enumerate(parser.pres):
    with open(f"pen_auth_pre_{idx}.txt", "w", encoding="utf-8") as out:
        out.write(pre)
print(f"Successfully wrote {len(parser.pres)} pre files.")
