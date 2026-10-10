"""Generate a public-safe personal profile. Run from the repository root.
Requires ReportLab. No employer, product, client, or operational details are included.
"""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable

out = Path(__file__).resolve().parents[1] / 'public' / 'dharmveer-kumar-resume.pdf'
doc = SimpleDocTemplate(str(out), pagesize=(595.28, 841.89), rightMargin=48, leftMargin=48, topMargin=48, bottomMargin=48, title='Dharmveer Kumar — Personal Profile', author='Dharmveer Kumar')
styles = {
    'name': ParagraphStyle('name', fontName='Helvetica-Bold', fontSize=27, leading=34, textColor=colors.HexColor('#22231f'), spaceAfter=12),
    'role': ParagraphStyle('role', fontName='Helvetica', fontSize=12, leading=18, textColor=colors.HexColor('#394ef3'), spaceAfter=10),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=10, leading=15, textColor=colors.HexColor('#394ef3'), spaceBefore=24, spaceAfter=10),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=17, textColor=colors.HexColor('#43443f'), spaceAfter=10),
    'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8, leading=13, textColor=colors.HexColor('#686962'), spaceBefore=26),
}
parts = []
def p(text, style='body'):
    parts.append(Paragraph(text, styles[style]))
p('DHARMVEER KUMAR', 'name')
p('Software Engineer / Frontend &amp; Mobile', 'role')
p('<link href="https://github.com/dharmvir73">github.com/dharmvir73</link>')
parts.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#dedfd6')))
p('ABOUT', 'heading')
p('A software engineer with a curious mind and a builder’s instinct. I enjoy turning complicated ideas into clear, useful experiences, and working at the intersection of product thinking, interface design, and engineering.')
p('PERSONAL JOURNEY', 'heading')
p('<b>2017:</b> Completed school. An interest in computers and technology grew into a desire to understand and build.')
p('<b>College:</b> Explored programming, frontend development, and the connection between code and human experience.')
p('<b>2023:</b> Began my professional software engineering career.')
p('<b>Today:</b> Developing my craft across frontend and mobile, while exploring AI, accessibility, and interaction design.')
p('TOOLKIT', 'heading')
p('<b>Interfaces:</b> React, TypeScript, JavaScript<br/><b>Mobile:</b> React Native, Android, iOS<br/><b>Connections:</b> Node.js, REST APIs, WebSockets<br/><b>Additional technologies:</b> Firebase, MongoDB, Docker, AWS, Git')
p('WHAT I CARE ABOUT', 'heading')
p('Clear interfaces. Reliable behavior. Accessible experiences. Thoughtful details. A willingness to keep learning.')
p('This is a public personal profile, not a record of employer or client projects. Company products, internal processes, architectures, and operational details are intentionally excluded.', 'small')
doc.build(parts)
print(f'Generated public-safe profile: {out.name}')
