import React from 'react';
// import {useNavigate} from 'react-router-dom';
import './start.css'

export default function StartButton({ onClick }) {

    // const [showChat, setShowChat] = useState(false);
    // const nagigate = useNavigate()

    // const toggleChat = () => {
    //     setShowChat(!showChat);
    //     nagigate('/detailform')
    // };
    
  return (
    <div>
      <div className="chat-containers">
            <div className="chat-button">
                <button onClick={onClick}>Start Chat</button>
            </div>
            {/* {showChat && (
                <div className="chat-box">
                    <p>This is the chat box</p>
                </div>
            )} */}
        </div>
    </div>
  )
}
