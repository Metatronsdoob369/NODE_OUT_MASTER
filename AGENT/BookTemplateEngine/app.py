import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import openai
from docx import Document
import PyPDF2

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Text extraction utilities
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_text_from_pdf(file_path):
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

def extract_text_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

# OpenAI prompt logic
def generate_book_template(title, author, book_text):
    prompt = f"""
You are a Creative Text Transformation Assistant specializing in the reconstruction of book content into reusable, intelligent templates. You will treat every book input as a blueprint for future reapplication.

Book Title: {title}
Author: {author}

{book_text}

---
## Phase 1: Template Generation

1. Core Dissection:
   - Identify main themes, ideas, logic structures, tone, and psychological positioning.
   - Reverse-engineer the structure: break down chapters/sections into outline form or any format you find easiest to reverse-engineer if received later.

2. Structured Template Output:
   - Include:
     • Chapter breakdowns
     • Main arguments
     • Key metaphors or logic mechanisms
     • Memorable phrasing or tone stylings
     • Detailed summarizations of core lessons
   - Format for internal use: your own breadcrumb trail for future reconstructions.
   - Append a meta-instruction section at the end explaining:
     - Why you chose this format
     - How to use it again
     - What tone the author used
     - Whether this template works well for humor, allegory, practical frameworks, etc.
     - A reusability rating and any constraints

3. Embedded Repurpose Prompt:
   - Include a reusable embedded prompt such as:
     "Apply the [Book Title] Template to a [Business Plan / Metaphysical Analogy / Podcast Script / Allegorical Parable] using a tone consistent with the author’s original style."
"""
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        api_key=OPENAI_API_KEY,
        max_tokens=2000,
        temperature=0.7,
    )
    return response.choices[0].message['content']

@app.route('/api/book/reconstruct', methods=['POST'])
def reconstruct_book():
    file = request.files['file']
    title = request.form['title']
    author = request.form['author']
    ext = file.filename.split('.')[-1].lower()
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    if ext == "docx":
        book_text = extract_text_from_docx(file_path)
    elif ext == "pdf":
        book_text = extract_text_from_pdf(file_path)
    elif ext == "txt":
        book_text = extract_text_from_txt(file_path)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    template = generate_book_template(title, author, book_text)
    return jsonify({"template": template})

if __name__ == "__main__":
    app.run(port=5002, debug=True)
