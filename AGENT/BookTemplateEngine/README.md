# Book Template Engine (Python + OpenAI)

A ready-to-run backend for reconstructing book content into reusable, intelligent templates using OpenAI GPT-4o. Supports DOCX, PDF, and TXT uploads via a Flask API.

## Features
- Upload books (TXT, DOCX, PDF) and generate structured templates
- Uses OpenAI GPT-4o for deep content analysis and template creation
- Simple Flask API endpoint for integration or testing

## Setup Instructions

1. **Clone the repo or copy these files into a directory.**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure your OpenAI API key:**
   - Copy `.env.example` to `.env` and add your OpenAI API key.
   ```bash
   cp .env.example .env
   # Edit .env and paste your key
   ```

4. **Run the Flask app:**
   ```bash
   python app.py
   ```

5. **Test the API:**
   Use curl, Postman, or an HTML form to POST a file, title, and author to:
   ```
   http://localhost:5002/api/book/reconstruct
   ```
   Example curl command:
   ```bash
   curl -F "file=@sample.docx" -F "title=Book Title" -F "author=Author Name" http://localhost:5002/api/book/reconstruct
   ```

## File Structure
- `app.py` - Main Flask app and OpenAI integration
- `requirements.txt` - Python dependencies
- `.env.example` - API key template
- `uploads/` - Uploaded files (auto-created)

## Customization
- You can extend the API for template library storage (Firebase, Supabase, etc.)
- Add more endpoints for Phase 2 (custom application, search, etc.)

---

**Contact:** For questions or help, reach out to your AI assistant!
