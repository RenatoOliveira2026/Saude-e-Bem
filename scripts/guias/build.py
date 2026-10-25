"""Gera os guias em PDF do Saúde & Bem (letra grande, pensado para o público 50+)."""
import importlib
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, KeepTogether, NextPageTemplate, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("Sans", f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Oblique", f"{FONT_DIR}/DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFontFamily("Sans", normal="Sans", bold="Sans-Bold", italic="Sans-Oblique")

FOREST = colors.HexColor("#2e6b1f")
SAGE = colors.HexColor("#3d7a2a")
SAGE_MUTED = colors.HexColor("#e8f3e4")
GOLD = colors.HexColor("#e97d4b")
GOLD_MUTED = colors.HexColor("#fceee6")
GRAPHITE = colors.HexColor("#1f2937")
MUTED = colors.HexColor("#4b5563")
OFF_WHITE = colors.HexColor("#f8faf7")

PAGE_W, PAGE_H = A4
MARGIN = 22 * mm

S = {
    "body": ParagraphStyle("body", fontName="Sans", fontSize=13.5, leading=21, textColor=GRAPHITE, spaceAfter=9),
    "h1": ParagraphStyle("h1", fontName="Sans-Bold", fontSize=22, leading=28, textColor=FOREST, spaceBefore=4, spaceAfter=12, keepWithNext=1),
    "h2": ParagraphStyle("h2", fontName="Sans-Bold", fontSize=16.5, leading=22, textColor=FOREST, spaceBefore=12, spaceAfter=7),
    "bullet": ParagraphStyle("bullet", fontName="Sans", bulletFontName="Sans", fontSize=13.5, leading=20, textColor=GRAPHITE, leftIndent=18, bulletIndent=2, spaceAfter=5),
    "check": ParagraphStyle("check", fontName="Sans", bulletFontName="Sans", bulletFontSize=15, fontSize=13.5, leading=20, textColor=GRAPHITE, leftIndent=24, bulletIndent=0, spaceAfter=7),
    "box": ParagraphStyle("box", fontName="Sans", fontSize=13, leading=19.5, textColor=GRAPHITE),
    "boxitem": ParagraphStyle("boxitem", fontName="Sans", bulletFontName="Sans", fontSize=13, leading=19.5, textColor=GRAPHITE, leftIndent=16, bulletIndent=2),
    "boxtitle": ParagraphStyle("boxtitle", fontName="Sans-Bold", fontSize=13.5, leading=19, textColor=FOREST, spaceAfter=4),
    "cell": ParagraphStyle("cell", fontName="Sans", fontSize=12, leading=16.5, textColor=GRAPHITE),
    "cellhead": ParagraphStyle("cellhead", fontName="Sans-Bold", fontSize=12, leading=16, textColor=colors.white),
    "ref": ParagraphStyle("ref", fontName="Sans", bulletFontName="Sans", fontSize=11.5, leading=16.5, textColor=MUTED, leftIndent=14, bulletIndent=0, spaceAfter=5),
    "small": ParagraphStyle("small", fontName="Sans", fontSize=11.5, leading=17, textColor=MUTED, spaceAfter=6),
}


def p(text, style="body"):
    return Paragraph(text, S[style])


def bullets(items, style="bullet", mark="•"):
    return [Paragraph(t, S[style], bulletText=mark) for t in items]


def box(title, lines, bg=SAGE_MUTED, border=SAGE):
    inner = [p(title, "boxtitle")] if title else []
    for line in lines:
        is_item = line.startswith("- ")
        inner.append(Paragraph(line[2:] if is_item else line, S["boxitem" if is_item else "box"], bulletText="•" if is_item else None))
        inner.append(Spacer(1, 3))
    t = Table([[inner]], colWidths=[PAGE_W - 2 * MARGIN])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 4, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 14), ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([Spacer(1, 6), t, Spacer(1, 10)])


def table(header, rows, widths):
    data = [[Paragraph(h, S["cellhead"]) for h in header]]
    data += [[Paragraph(c, S["cell"]) for c in r] for r in rows]
    total = PAGE_W - 2 * MARGIN
    t = Table(data, colWidths=[total * w for w in widths], repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), FOREST),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c9dcc2")),
        ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), OFF_WHITE))
    t.setStyle(TableStyle(style))
    return [Spacer(1, 4), t, Spacer(1, 12)]


def render_blocks(blocks):
    """Converte a lista de blocos do conteúdo em elementos do PDF."""
    out = []
    pending_h2 = None
    for b in blocks:
        kind = b[0]
        if pending_h2 is not None and kind not in ("h1", "h2"):
            # Título fica na mesma página do conteúdo que ele apresenta.
            rendered = render_blocks([b])
            out.append(KeepTogether([pending_h2, *rendered]))
            pending_h2 = None
            continue
        if pending_h2 is not None:
            out.append(pending_h2)
            pending_h2 = None
        if kind == "h1":
            out += [PageBreak(), p(b[1], "h1")]
        elif kind == "h2":
            pending_h2 = p(b[1], "h2")
        elif kind == "p":
            out.append(p(b[1]))
        elif kind == "ul":
            out += bullets(b[1])
        elif kind == "check":
            out += bullets(b[1], "check", "☐")
        elif kind == "box":
            out.append(box(b[1], b[2]))
        elif kind == "alert":
            out.append(box(b[1], b[2], bg=GOLD_MUTED, border=GOLD))
        elif kind == "table":
            out += table(b[1], b[2], b[3])
        elif kind == "refs":
            out += [p("Referências", "h2")] + bullets(b[1], "ref", "–")
        elif kind == "space":
            out.append(Spacer(1, b[1]))
        else:
            raise ValueError(kind)
    if pending_h2 is not None:
        out.append(pending_h2)
    return out


def draw_cover(guide):
    def _draw(c, doc):
        c.saveState()
        c.setFillColor(FOREST)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(SAGE)
        c.circle(PAGE_W - 30 * mm, PAGE_H - 40 * mm, 70 * mm, stroke=0, fill=1)
        c.setFillColor(GOLD)
        c.rect(MARGIN, PAGE_H * 0.52, 30 * mm, 3, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Sans-Bold", 13)
        c.drawString(MARGIN, PAGE_H - 32 * mm, "SAÚDE & BEM")
        c.setFont("Sans", 12)
        c.drawString(MARGIN, PAGE_H - 39 * mm, "Biblioteca gratuita")
        y = PAGE_H * 0.52 - 16 * mm
        c.setFont("Sans-Bold", 34)
        for line in guide.COVER_TITLE:
            c.drawString(MARGIN, y, line)
            y -= 14 * mm
        c.setFont("Sans", 15)
        y -= 4 * mm
        for line in guide.COVER_SUBTITLE:
            c.drawString(MARGIN, y, line)
            y -= 8 * mm
        c.setFont("Sans", 11)
        c.setFillColor(colors.HexColor("#d7e8d0"))
        c.drawString(MARGIN, 28 * mm, "Conteúdo educativo da Equipe Saúde & Bem. Não substitui orientação médica.")
        c.drawString(MARGIN, 22 * mm, "saudeebem.com.br")
        c.restoreState()
    return _draw


def draw_page(guide):
    def _draw(c, doc):
        c.saveState()
        c.setFillColor(SAGE)
        c.rect(0, PAGE_H - 6, PAGE_W, 6, stroke=0, fill=1)
        c.setFont("Sans", 9.5)
        c.setFillColor(MUTED)
        c.drawString(MARGIN, 12 * mm, f"{guide.TITLE} · Saúde & Bem")
        c.drawRightString(PAGE_W - MARGIN, 12 * mm, f"Página {doc.page}")
        c.restoreState()
    return _draw


CLOSING = [
    ("h1", "Segurança em primeiro lugar"),
    ("p", "Este guia é educativo. Ele reúne recomendações gerais, válidas para a maioria dos adultos, "
          "mas cada pessoa tem uma história de saúde diferente. Se você tem alguma doença crônica, usa "
          "medicamentos todos os dias ou está em acompanhamento médico, converse com seu médico antes "
          "de mudar alimentação, atividade física ou rotina de sono."),
    ("alert", "Procure atendimento médico imediatamente se tiver", [
        "- dor no peito, falta de ar súbita ou desmaio;",
        "- fraqueza de um lado do corpo, boca torta ou dificuldade para falar;",
        "- confusão mental repentina, febre alta ou sangramento.",
        "Nesses casos, ligue para o SAMU (192)."]),
    ("h2", "Sobre o Saúde & Bem"),
    ("p", "O Saúde & Bem é um portal de informação sobre saúde, bem-estar e envelhecimento saudável, "
          "com leitura confortável e linguagem clara. Nossos conteúdos são produzidos pela Equipe "
          "Saúde & Bem a partir de diretrizes oficiais e estudos científicos. Saiba mais em "
          "saudeebem.com.br/politica-editorial."),
    ("p", "Encontrou um erro ou tem uma sugestão? Escreva para contato@saudeebem.com.br."),
]


def build(module_name, out_dir):
    guide = importlib.import_module(module_name)
    out = Path(out_dir) / f"{guide.SLUG}.pdf"
    doc = BaseDocTemplate(
        str(out), pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=24 * mm,
        title=f"{guide.TITLE} — Saúde & Bem", author="Equipe Saúde & Bem",
        subject=guide.DESCRIPTION, creator="Saúde & Bem",
    )
    frame = Frame(MARGIN, 24 * mm, PAGE_W - 2 * MARGIN, PAGE_H - MARGIN - 24 * mm, id="f")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[frame], onPage=draw_cover(guide)),
        PageTemplate(id="page", frames=[frame], onPage=draw_page(guide)),
    ])
    story = [NextPageTemplate("page"), PageBreak()]
    blocks = list(guide.CONTENT)
    # primeiro h1 não deve gerar página em branco depois da capa
    story += render_blocks(blocks)[1:]
    story += render_blocks(CLOSING)
    doc.build(story)
    return out


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).parent))
    out_dir = sys.argv[1]
    for name in sys.argv[2:]:
        path = build(name, out_dir)
        from pypdf import PdfReader
        print(path.name, len(PdfReader(str(path)).pages), "páginas")
