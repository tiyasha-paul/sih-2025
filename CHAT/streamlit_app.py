import streamlit as st
from main import rag_with_fallback, plot_extraction_trend, plot_category_bar, extract_location_and_year
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

# Constants
EMBEDDING_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"

# Initialize Streamlit app
st.set_page_config(page_title="HydroLens", page_icon="🌊", layout="wide")
st.title("🌊 HydroLens - Groundwater Monitoring System")
st.markdown("**Ask about rainfall, groundwater data, or request visualizations for any location and year.**")

# Initialize session state for persistent chat history
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'last_query' not in st.session_state:
    st.session_state.last_query = ""

# Load FAISS index
@st.cache_resource
def load_vectorstore():
    embeddings_model = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)
    if os.path.exists("faiss_index"):
        try:
            vectorstore = FAISS.load_local("faiss_index", embeddings_model, allow_dangerous_deserialization=True)
            st.success("✅ FAISS index loaded successfully.")
            return vectorstore
        except Exception as e:
            st.error(f"Error loading FAISS index: {e}")
            return None
    st.warning("⚠️ No FAISS index found. Some features may not work.")
    return None

vectorstore = load_vectorstore()

# Create two columns for better layout
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("💬 Query Interface")

    # Display chat history first
    for entry in st.session_state.chat_history:
        with st.container():
            st.markdown(f"**🧑 You:** {entry['query']}")
            st.markdown(f"**🤖 Bot:** {entry['answer']}")
            if 'visualization' in entry and entry['visualization']:
                st.pyplot(entry['visualization'])
            if entry.get('sources'):
                with st.expander("📚 View Sources"):
                    for source in entry['sources'][:3]:
                        if isinstance(source, dict):
                            st.write(f"• {source.get('location', 'Unknown')}, {source.get('state', 'Unknown')}, {source.get('year', 'Unknown')}")
                        else:
                            st.write(f"• {source.metadata.get('location', 'Unknown')}, {source.metadata.get('state', 'Unknown')}, {source.metadata.get('year', 'Unknown')}")
            st.markdown("---")

    # Query input
    query = st.text_input("Enter your query:", placeholder="e.g., 'Show trend for Delhi 2024' or 'Category for Rohini'", key="query_input")

    # Submit query
    language = st.selectbox("Select language:", ["en", "hi", "bn", "ta", "te"],
                           format_func=lambda x: {"en": "English", "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu"}[x])

    if st.button("🔍 Submit Query", type="primary") and query:
        if query != st.session_state.last_query:
            st.session_state.last_query = query
            with st.spinner("Processing query..."):
                answer, sources = rag_with_fallback(query, vectorstore=vectorstore, lang=language)

                # Store in chat history
                chat_entry = {'query': query, 'answer': answer, 'sources': sources, 'visualization': None}

                # Auto-detect and show visualization - enhanced detection
                viz_keywords = ['trend', 'plot', 'graph', 'chart', 'visuali', 'category', 'bar', 'show', 'generate', 'display']
                if any(w in query.lower() for w in viz_keywords):
                    location, state, year, query_type = extract_location_and_year(query)
                    try:
                        # Import infer_state function
                        from main import infer_state
                        # Determine target state: use extracted state or infer from location or default
                        target_state = state if state else (infer_state(location) if location else "Delhi")

                        if any(w in query.lower() for w in ['category', 'bar', 'distribution']):
                            year_str = year if year else "2024"
                            fig = plot_category_bar(target_state, year_str)
                            chat_entry['visualization'] = fig
                        elif any(w in query.lower() for w in ['trend', 'plot', 'graph', 'extraction']):
                            fig = plot_extraction_trend(target_state, location)
                            chat_entry['visualization'] = fig
                    except Exception as e:
                        st.error(f"Visualization error: {e}")
                        import traceback
                        st.code(traceback.format_exc())

                st.session_state.chat_history.append(chat_entry)
                st.rerun()
    elif st.button("🔍 Submit Query", type="primary"):
        st.warning("⚠️ Please enter a query.")

    if st.button("🗑️ Clear Chat History"):
        st.session_state.chat_history = []
        st.session_state.last_query = ""
        st.rerun()

with col2:
    st.subheader("📊 Manual Visualization")
    st.markdown("Generate custom visualizations:")

    # Visualization inputs
    state = st.selectbox("Select State:", ["Delhi", "Odisha", "Haryana", "West Bengal"])
    location = st.text_input("Location (optional):", placeholder="e.g., Rohini")
    year_str = st.text_input("Year Pattern:", placeholder="e.g., 2024")

    if st.button("📈 Generate Trend Plot"):
        if state:
            try:
                with st.spinner("Generating trend plot..."):
                    fig = plot_extraction_trend(state, location if location else None)
                    st.pyplot(fig)
            except Exception as e:
                st.error(f"Error: {e}")
        else:
            st.warning("Please select a state.")

    if st.button("📊 Generate Category Bar"):
        if state and year_str:
            try:
                with st.spinner("Generating category bar..."):
                    fig = plot_category_bar(state, year_str)
                    st.pyplot(fig)
            except Exception as e:
                st.error(f"Error: {e}")
        else:
            st.warning("Please select a state and year pattern.")

# Footer
st.markdown("---")
st.markdown("**💡 Tips:** Try queries like 'rainfall for Delhi 2024', 'show trend for Rohini', or 'category bar for West Bengal 2023'")