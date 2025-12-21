import google.generativeai as genai

# Remember to use your NEW key here
genai.configure(api_key="AIzaSyBn-CHbkORD3gFb8uA1m30VTNVnnLYlrNw")

# We use the clean name without 'models/'
model = genai.GenerativeModel('gemini-2.5-flash')

try:
    response = model.generate_content("Hello, are you working now?")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")