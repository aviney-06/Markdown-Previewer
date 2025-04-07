import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [mdtext, setMdText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [fileName, setFileName] = useState('');
  const [notification, setNotification] = useState({ message: '', isShown: false });

  useEffect(() => {
    console.log("useEffect!!");
    const fetchData = async () => {
      console.log(text);
      const mdData = await axios.post('http://localhost:2100/', {
        data: text
      });
      console.log(mdData);
      setMdText(mdData.data.result)
    }
    fetchData();
  }, [text]);

  const handleSave = () => {
    setModalType('save');
    setShowModal(true);
  };

  const handleRetrieve = () => {
    setModalType('retrieve');
    setShowModal(true);
  };

  const saveMarkdown = async () => {
    try {
      await axios.post('http://localhost:2100/save-file', {
        fileName,
        text,
        mdtext
      });
      
      setShowModal(false);
      setFileName('');
      showNotification(`Successfully saved markdown for key: ${fileName}`);
    } catch (error) {
      console.log('Error saving markdown:', error);
      showNotification('Error saving markdown');
    }
  };

  const retrieveMarkdown = async () => {
    try {
      const response = await axios.get(`http://localhost:2100/get-file/${fileName}`);
      console.log(response);
      setText(response.data.result.text);
      setMdText(response.data.result.mdText);
      
      setShowModal(false);
      setFileName('');
      showNotification('File Fetched Successfully!!');
    } catch (error) {
      console.log(error);
      showNotification('File Fetching Failed!!');
    }
  };

  const showNotification = (message) => {
    setNotification({ message, isShown: true });
    setTimeout(() => {
      setNotification({ message: '', isShown: false });
    }, 3000);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'save') {
      saveMarkdown();
    } else {
      retrieveMarkdown();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Markdown Previewer</h1>
        <div className="header-buttons">
          <button className="button save-button" onClick={handleSave}>
            Save
          </button>
          <button className="button retrieve-button" onClick={handleRetrieve}>
            Retrieve
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div className="content-section">
          <h2 className="section-heading">Markdown Input</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="markdown-input"
          />
        </div>

        <div className="content-section">
          <h2 className="section-heading">Preview</h2>
          <div 
            className="preview"
            dangerouslySetInnerHTML={{ __html: mdtext }} 
          />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalType === 'save' ? 'Save Markdown' : 'Retrieve Markdown'}</h2>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                placeholder="Enter filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="submit-button"
                >
                  {modalType === 'save' ? 'Save' : 'Retrieve'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notification.isShown && (
        <div className="notification">
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;