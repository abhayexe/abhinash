import google.generativeai as genai

# REPLACE with your NEW key after you revoke the old one
genai.configure(api_key="AIzaSyBn-CHbkORD3gFb8uA1m30VTNVnnLYlrNw")

print("List of available models for this key:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"- {m.name}")