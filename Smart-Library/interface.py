import streamlit as st
import requests

st.title("AI-Powered Librarian")

question = st.text_input("Enter your question:")
chat_history = st.session_state.get("chat_history", [])

if st.button("Submit"):
    response = requests.post(
        "http://localhost:8000/query",
        json={"question": question, "chat_history": chat_history},
    )

    if response.status_code == 200:
        data = response.json()
        st.write("Answer:", data["answer"])
        chat_history.append({"question": question, "answer": data["answer"]})
        st.session_state["chat_history"] = chat_history
    else:
        st.write("Error:", response.status_code)

st.write("Chat History:")
for chat in chat_history:
    st.write(f"Q: {chat['question']}")
    st.write(f"A: {chat['answer']}")
