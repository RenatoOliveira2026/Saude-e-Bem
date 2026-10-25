# Guias em PDF da biblioteca

Fonte dos 5 guias publicados em `public/materiais/`. Para regenerar após editar o conteúdo:

```bash
pip install reportlab pypdf
python3 scripts/guias/build.py public/materiais guia_sono guia_energia guia_intestinal guia_detox guia_habitos
```

Se o número de páginas mudar, atualize `pages` na tabela `ebooks` (ver migração 045).
