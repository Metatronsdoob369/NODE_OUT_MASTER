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
    model = genai.GenerativeModel('models/gemini-2.5-pro')
    print("\nWelcome to Gemini Interactive Chat! Paste any code, file contents, command outputs, or just type your message. Type 'exit' to quit.\n")
    history = []
    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == 'exit':
            print("Exiting Gemini chat. Goodbye!")
            break
        # Feature: Load file contents with !load <filename>
        if user_input.strip().startswith('!load '):
            filename = user_input.strip()[6:].strip()
            try:
                with open(filename, 'r') as f:
                    file_content = f.read()
                print(f"[Loaded {filename}]")
                user_input = file_content
            except Exception as e:
                print(f"Could not load file: {e}")
                continue
        # Add user input to history for context retention
        history.append({"role": "user", "parts": [user_input]})
        try:
            response = model.generate_content(history)
            print(f"Gemini: {response.text}\n")
            # Add Gemini response to history
            history.append({"role": "model", "parts": [response.text]})
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
