from pathlib import Path
import pypdf

p = Path(r'c:\Users\kokim\OneDrive\Documents\GitHub\mm_ceo_operation_system-1\Marker_Media_Agent_System.pdf')
print('exists', p.exists(), 'size', p.stat().st_size if p.exists() else None)
reader = pypdf.PdfReader(str(p))
print('pages', len(reader.pages))
for i in range(min(20, len(reader.pages))):
    txt = reader.pages[i].extract_text() or ''
    print(f'---PAGE {i + 1}---')
    print(txt[:5000])
