import { useState } from "react"
import { BsStars } from "react-icons/bs";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);

  const handleSend = async (e) => {
    // Enable new line with Enter + Shift
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      // Prevent empty space
      e.preventDefault();
      
      // If there is a text in text area
      if (input.trim()) {
        const userMessage = { 
          role: "user", 
          "content": input.trim() 
        };

        // update the message history
        setMessages(prev => [...prev, userMessage]);

        // Remove the text in text are
        setInput("");

        // Begin invoking to AI
        try {
          // Set the isLoading state to true
          setIsLoading(true);

          // Add a temporary "Typing..." to message
          setMessages((prev) => [...prev, { role: "model", content: "Typing..." }]);

          // Fetch the AI response
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              message: input.trim(),
              messages: [...messages, { role: "user", content: input.trim() }]
            }),
          });

          const data = await res.json();

          // const modelMessage = { role: "model", content: data.reply }

          setMessages((prev) => {
            // Replace the last "Typing..." with the real response
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = { role: "model", content: data.reply };
            return newMessages;
            // [...prev, modelMessage]);
          });

          if (data.readyToGenerate) {
            setIsReadyToGenerate(true);
          }
        }

        // If there is an error
        catch (error) {
          console.error(error)
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { role: "model", content: "There's something wrong" };
            return newMessages;
          });
        }

        // Finally set the isLoading state to false
        finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleGenerateProject = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }), // Send full history
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "model", content: data.project }]);
      setIsReadyToGenerate(false); // Reset after generation
    }
    catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", content: "Failed to generate project" }]);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col p-4 bg-gray-100 h-screen">
      <h1 className="font-bold mb-4 text-xl text-center">Xplorium Chatmodel</h1>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 bg-white py-4 px-12 rounded shadow">
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ whiteSpace: "pre-wrap" }}
            className={`p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 self-end ml-auto max-w-xl" : "bg-gray-200 max-w-10/12"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {!isReadyToGenerate && (
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded mb-2 flex mx-auto"
          onClick={handleGenerateProject}
        >
          Generate Project <BsStars/>
        </button>
      )}

      <textarea
        rows={2}
        className="border p-2 rounded w-full resize-none"
        placeholder="Message to Xplorium"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleSend}
      />
    </main>
  )
}