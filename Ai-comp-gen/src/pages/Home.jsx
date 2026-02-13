import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { IoCodeSlash } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { CgExport } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
// import { GoogleGenAI } from "@google/genai";
import { ToastContainer, toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";

function Home() {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [outputStream, setOutputStream] = useState(false);
  const [tabs, setTabs] = useState(2);
  const [framework, setFramework] = useState(options[0]);
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("")
  const [newTab, setNewTab] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)



  const copyContent = async () => {
    if(!code.trim()) return toast.error("Nothing to copy")
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to Copy")
    }
  }

  const exportCode = () => {
    if(!code.trim()) return toast.error("No Code to Download")

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  }

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

//   async function getResponse() {
//     if (!promptText.trim()) return toast.error("Describe your component first");
//     try {
//       setLoading(true);
//       const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: `
//       You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

// Now, generate a UI component for: ${promptText}  
// Framework to use: ${framework.value}  

// Requirements:  
// The code must be clean, well-structured, and easy to understand.  
// Optimize for SEO where applicable.  
// Focus on creating a modern, animated, and responsive UI design.  
// Include high-quality hover effects, shadows, animations, colors, and typography.  
// Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
// Do NOT include explanations, text, comments, or anything else besides the code.  
// And give the whole code in a single HTML file.
//       `,
//       });
//       setOutputStream(true)
//       setCode(extractCode(response.text))
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }

async function getResponse() {
  if (!promptText.trim())
    return toast.error("Describe your component first");

  try {
    setLoading(true);

    const response = await fetch("https://ai-component-generator-1-uk6j.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: promptText,
        framework: framework.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    setOutputStream(true);
    setCode(data.output);

  } catch (error) {
    console.error(error);
    toast.error("Generation failed");
  } finally {
    setLoading(false);
  }
}


  return (
    <div>
      <Navbar />

      <div className="grid grid-cols-2 gap-[40px] px-6">
        <div className="bg-[#1e1d25] w-full h-[650px] border-transparent rounded-xl p-5 py-6 mt-6">
          <h3 className="text-[22px] mt-6 px-6 font-[700] text-purple-400">
            AI Component Generator
          </h3>
          <p className="mt-3 text-[15px] px-6 text-gray-400">
            Describe your component and let AI code it for you.
          </p>
          <p className="mt-6 px-6 font-[700]">Framework</p>
          <Select
            menuPortalTarget={document.body}
            options={options}
            value={framework}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1e1d25",
                borderColor: "#3f3f46",
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1e1d25",
                color: "white",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "#6366f1" // selected option (purple like your theme)
                  : isFocused
                  ? "#2d2d35" // hover color
                  : "#1e1d25", // normal option background
                color: "white",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white", // selected text
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999, // keep dropdown above everything
              }),
            }}
            className="mt-4 px-6"
            onChange={(selected) => setFramework(selected)}
          />
          <p className="mt-10 px-6 font-[700]">Describe your component</p>
          <textarea
            className="w-[610px] min-h-[200px] ml-4 rounded-xl bg-[#09090B] mt-4 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe your component in detail and AI will generate it..."
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="mt-6 text-sm px-6 text-gray-400">
              Click on generate button to get your code
            </p>
            <button
              className="flex items-center mr-7 mt-5 p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95"
              onClick={getResponse}
            >
              {loading ? <ClipLoader color="white" size={18} /> : <BsStars />}
              {loading ? "Generating" : "Generate"}
            </button>
          </div>
        </div>
        <div className="bg-[#1e1d25] border-transparent rounded-lg mt-6">
          {!outputStream ? (
            <div className="w-full h-full flex items-center flex-col justify-center">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-fit p-5 items-center justify-center rounded-full text-[40px]">
                <IoCodeSlash />
              </div>
              <p className="mt-6 text-[15px] px-6 text-gray-400">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 px-6 mt-5">
                <button
                  className={`${
                    tabs == 1 ? "bg-white/20" : "bg-purple-600"
                  } rounded-3xl p-2`}
                  onClick={() => setTabs(2)}
                >
                  Code
                </button>
                <button
                  className={`${
                    tabs == 2 ? "bg-white/20" : "bg-purple-600"
                  } rounded-3xl p-2`}
                  onClick={() => setTabs(1)}
                >
                  Preview
                </button>
              </div>

              <div className="flex items-center justify-between mt-6 px-8">
                <div>
                  <p className="font-[700]">Code Editor</p>
                </div>
                <div className="flex items-center gap-[20px]">
                  {tabs == 1 ? (
                    <>
                      <button className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={() => setNewTab(true)}>
                        <ImNewTab />
                      </button>
                      <button className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={() => setRefreshKey(prev => prev + 1)}>
                        <IoMdRefresh />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={copyContent}>
                        <FaRegCopy />
                      </button>
                      <button className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333]" onClick={exportCode}>
                        <CgExport />
                      </button>
                    </>
                  )}{" "}
                </div>
              </div>

              <div className="flex flex-col mt-4 h-[500px]">
                {tabs == 1 ? (
                  <>
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black rounded-lg shadow-md"></iframe>
                  </>
                ) : (
                  <>
                    <Editor
                      height="100%"
                      language="html"
                      theme="vs-dark"
                      className="rounded-lg overflow-hidden"
                      value={code}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {newTab && (
        <div className="absolute inset-0 bg-white w-screen h-screen overflow-auto">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100">
            <p className='font-bold'>Preview</p>
            <button onClick={() => setNewTab(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </div>
  );
}

export default Home;
