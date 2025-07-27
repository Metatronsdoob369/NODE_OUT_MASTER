import os
try:
    import google.generativeai as genai
except ImportError:
    print("google-generativeai is not installed. Run: pip install google-generativeai")
    exit(1)

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY not set in environment.")
        return
    genai.configure(api_key=api_key)
    try:
        print("Available Gemini models:")
        for model in genai.list_models():
            print(f"- {model.name} | Supported methods: {model.supported_generation_methods}")
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    main()
