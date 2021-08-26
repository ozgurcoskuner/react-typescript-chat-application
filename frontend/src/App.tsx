import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { io, Socket } from "socket.io-client";

import Image from "./components/Image";

const App: React.FC = () => {
  interface MessageBody {
    body: ArrayBuffer | string;
    id: string;
    type: string;
    mimeType: string;
    fileName?: string;
  }
  const [yourID, setYourID] = useState<string>();
  const [messages, setMessages] = useState<Array<MessageBody>>([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>();
  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = io("/");

    socketRef.current.on("your id", (id: string) => {
      setYourID(id);
    });

    socketRef.current.on("message", (message: MessageBody) => {
      receivedMessage(message);
    });
  }, []);

  function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {

      setFile(e.target.files[0]);
    }
  }

  function receivedMessage(message: MessageBody) {
    setMessages((prevState: MessageBody[]) => [...prevState, message]);
  }

  function sendMessage() {
    if (file) {
      const messageObject = {
        body: file,
        id: yourID,
        type: "file",
        mimeType: file.type,
        fileName: file.name,
      };
      setMessage("");
      setFile(null);
      socketRef.current.emit("send message", messageObject);
    } else if (message) {
      const messageObject = {
        id: yourID,
        type: "text",
        body: message,
      };
      setMessage("");
      socketRef.current.emit("send message", messageObject);
    }
    else {
      alert('Enter a text or upload an image')
    }
  }
  function renderMessages(message: MessageBody, index: number) {
    if (message.type === "file") {
      const blob = new Blob([message.body], { type: message.type });

      if (message.id === yourID) {
        return (
          <div key={index}>
            <div className="image right">
              <Image fileName={message.fileName} blob={blob} />

            </div>
          </div>
        );
      }
      return (
        <div key={index}>
          <div className="image left">
            <Image fileName={message.fileName} blob={blob} />
          </div>
        </div>
      );
    }
    if (message.id === yourID) {
      return (
        <div className="text right" key={index}>
          {message.body}
        </div>
      );
    }
    return (
      <div className="text left" key={index}>
        {message.body}
      </div>
    );
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage(e.target.value);
  }

  return (
    <div className="App">
      <div className="chat-header">

      </div>
      <div className="chat-body">{messages.map(renderMessages)}</div>

      <div className="chat-footer">

        <div className='input-field'>
          <input onChange={selectFile} type="file" />
          <input onChange={handleChange} value={message} placeholder="Enter your text..." type="text" />
        </div>


        <button onClick={sendMessage}>Send</button>

      </div>
    </div>
  );
};

export default App;
