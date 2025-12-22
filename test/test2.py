import google.generativeai as genai

# Remember to use your NEW key here
genai.configure(api_key="AIzaSyDdSr5pR60dQv-7KzWQ3zhvpYTfIvqQHK4")

# We use the clean name without 'models/'
model = genai.GenerativeModel('gemini-2.5-flash')

try:
    response = model.generate_content("Hello, are you working now?")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")