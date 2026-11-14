"""Extract and render actual Chromium PDFs. Run with the bundled PDF Python."""
import json, pathlib, sys
import pdfplumber

root = pathlib.Path(sys.argv[1])
results = []
required = {
    "w09": ["2,172.62", "2,166.67"], "w10": ["285.71", "2028"],
    "w11": ["153.84", "1,846.16"], "w12": ["2,172.62", "26,071.43"],
    "w13": ["1,241.38", "21"], "w14": ["2028-03-30", "1,800.25"],
    "w15": ["3,265.52", "1,064.52"], "w16": ["50,400.00", "48,000.00", "2,400.00"]
}
for source in sorted(root.glob("*.pdf")):
    pages = []
    with pdfplumber.open(source) as pdf:
        for number, page in enumerate(pdf.pages, 1):
            text = page.extract_text() or ""
            image = source.with_name(source.stem + "-page-" + str(number) + ".png")
            page.to_image(resolution=110).save(image)
            pages.append({"page":number, "characters":len(text.strip()), "image":image.name,
                "out_of_bounds_words":[w["text"] for w in page.extract_words() if w["x0"] < -1 or w["x1"] > page.width+1 or w["top"] < -1 or w["bottom"] > page.height+1]})
        combined = "\n".join(p.extract_text() or "" for p in pdf.pages)
    source.with_suffix(".txt").write_text(combined, encoding="utf8")
    missing = [term for term in required.get(source.stem, []) if term not in combined]
    results.append({"file":source.name,"pages":pages,"missing":missing,"ad_placeholder":"Advertisement" in combined})
(root / "pdf-report.json").write_text(json.dumps(results,indent=2),encoding="utf8")
print(json.dumps(results,indent=2))
sys.exit(1 if any(r["missing"] or r["ad_placeholder"] or any(p["characters"] == 0 or p["out_of_bounds_words"] for p in r["pages"]) for r in results) else 0)
