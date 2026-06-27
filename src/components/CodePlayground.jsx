import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AnimateBox from './AnimateBox';
import Editor from '@monaco-editor/react';


const TEMPLATES = {
  javascript: {
    name: 'Quick Sort Algorithm',
    code: `// JavaScript: Quick Sort Algorithm
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  
  return [...quickSort(left), pivot, ...quickSort(right)];
}

const data = [34, 7, 23, 32, 5, 62];
console.log("Original Array:", data);
const sorted = quickSort(data);
console.log("Sorted Array:  ", sorted);
`
  },
  async_javascript: {
    name: 'Asynchronous Fetch',
    code: `// JavaScript: Fetching mock data asynchronously
console.log("Fetching posts list...");

fetch("https://jsonplaceholder.typicode.com/posts?_limit=3")
  .then(response => {
    if (!response.ok) throw new Error("Network response error");
    return response.json();
  })
  .then(posts => {
    posts.forEach(post => {
      console.log(\`[Post #\${post.id}] \${post.title}\`);
    });
    console.log("Fetch completed successfully!");
  })
  .catch(err => {
    console.error("Fetch operation failed:", err.message);
  });
`
  },
  html: {
    name: 'Glassmorphic Card UI',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Glassmorphic Card</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #1f1f2e 0%, #111115 100%);
      font-family: sans-serif;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 30px;
      width: 280px;
      text-align: center;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
      color: #fff;
      transition: all 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .card h3 {
      margin: 0 0 10px 0;
      color: #f9bf3f;
    }
    .card p {
      font-size: 13.5px;
      color: #ccc;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .btn {
      background: #2c98f0;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1e82d4;
    }
  </style>
</head>
<body>
  <div class="card">
    <h3>Premium Sandbox</h3>
    <p>This is a live HTML/CSS/JS preview container. Edit code on the left and run it to update!</p>
    <button class="btn" onclick="alert('Hello from the sandboxed iframe!')">Click Me</button>
  </div>
</body>
</html>
`
  },
  python: {
    name: 'Fibonacci Sequence Generator',
    code: `# Python: Fibonacci Sequence
limit = 10
a = 0
b = 1

print("Fibonacci Sequence up to", limit, "terms:")
for i in range(limit):
    print(a)
    temp = a + b
    a = b
    b = temp
`
  }
};

export default function CodePlayground() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(TEMPLATES.javascript.code);
  const [activeTab, setActiveTab] = useState('console'); 
  const [logs, setLogs] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);
  const [isOutputMaximized, setIsOutputMaximized] = useState(false);

  const iframeRef = useRef(null);

  
  useEffect(() => {
    if (location.state && location.state.code) {
      setCode(location.state.code);
      if (location.state.language) {
        setLanguage(location.state.language.toLowerCase());
      }
      
      if (location.state.language && location.state.language.toLowerCase() === 'html') {
        setActiveTab('preview');
      } else {
        setActiveTab('console');
      }
      return;
    }

    const params = new URLSearchParams(location.search);
    const codeParam = params.get('code');
    const langParam = params.get('lang');

    if (codeParam) {
      try {
        
        const decodedCode = decodeURIComponent(escape(atob(codeParam)));
        setCode(decodedCode);
        if (langParam) {
          setLanguage(langParam.toLowerCase());
          if (langParam.toLowerCase() === 'html') {
            setActiveTab('preview');
          }
        }
      } catch (err) {
        console.error('Failed to decode playground query string:', err);
      }
    }
  }, [location]);

  
  const handleTemplateChange = (e) => {
    const key = e.target.value;
    if (TEMPLATES[key]) {
      setCode(TEMPLATES[key].code);
      if (key.includes('html')) {
        setLanguage('html');
        setActiveTab('preview');
      } else if (key.includes('python')) {
        setLanguage('python');
        setActiveTab('console');
      } else {
        setLanguage('javascript');
        setActiveTab('console');
      }
    }
  };

  


  
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'PLAYGROUND_CONSOLE_LOG') {
        setLogs((prev) => [...prev, { type: e.data.logType, text: e.data.text }]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  
  const runCode = () => {
    setLogs([{ type: 'system', text: 'Compiling and executing script...' }]);

    if (language === 'javascript') {
      setActiveTab('console');
      executeJavaScript(code);
    } else if (language === 'html') {
      setActiveTab('preview');
      executeHTML(code);
    } else if (language === 'python') {
      setActiveTab('console');
      executePython(code);
    }
  };

  
  const executeJavaScript = (jsCode) => {
    
    setLogs([{ type: 'system', text: 'Running JS Sandbox...' }]);

    
    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <script>
          const sendLog = (type, text) => {
            window.parent.postMessage({ type: 'PLAYGROUND_CONSOLE_LOG', logType: type, text }, '*');
          };
          window.console.log = (...args) => {
            sendLog('log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };
          window.console.error = (...args) => {
            sendLog('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };
          window.console.warn = (...args) => {
            sendLog('log', '[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          };
          window.onerror = (message, source, lineno, colno, error) => {
            sendLog('error', \`\${message} (line \${lineno})\`);
            return true;
          };
        </script>
      </head>
      <body>
        <script>
          try {
            ${jsCode}
            sendLog('system', 'Execution finished successfully.');
          } catch (err) {
            sendLog('error', err.name + ': ' + err.message);
          }
        </script>
      </body>
      </html>
    `;

    
    if (iframeRef.current) {
      iframeRef.current.srcdoc = iframeHtml;
    }
  };

  
  const executeHTML = (htmlCode) => {
    
    const injectionScript = `
      <script>
        const sendLog = (type, text) => {
          window.parent.postMessage({ type: 'PLAYGROUND_CONSOLE_LOG', logType: type, text }, '*');
        };
        window.console.log = (...args) => {
          sendLog('log', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        window.console.error = (...args) => {
          sendLog('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        window.onerror = (message, source, lineno, colno, error) => {
          sendLog('error', \`\${message} (line \${lineno})\`);
          return true;
        };
      </script>
    `;

    
    let updatedHtml = htmlCode;
    if (htmlCode.includes('<head>')) {
      updatedHtml = htmlCode.replace('<head>', '<head>' + injectionScript);
    } else if (htmlCode.includes('<html>')) {
      updatedHtml = htmlCode.replace('<html>', '<html>' + injectionScript);
    } else {
      updatedHtml = injectionScript + htmlCode;
    }

    if (iframeRef.current) {
      iframeRef.current.srcdoc = updatedHtml;
    }
  };

  
  const executePython = (pyCode) => {
    try {
      const simLogs = [];
      simLogs.push({ type: 'system', text: 'Initializing Python 3.x (Simulated Environment)...' });

      const lines = pyCode.split('\n');
      let jsCode = '';
      let loopIndentStack = [];
      let indentSpaces = 4; 

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        
        const leadingSpaces = line.length - line.trimStart().length;

        
        while (loopIndentStack.length > 0 && leadingSpaces < loopIndentStack[loopIndentStack.length - 1]) {
          jsCode += '}\n';
          loopIndentStack.pop();
        }

        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        
        
        if (trimmed.startsWith('print(')) {
          const contents = trimmed.substring(6, trimmed.lastIndexOf(')'));
          
          
          jsCode += `console.log(${contents});\n`;
        }
        
        
        
        
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed)) {
          const varName = trimmed.split('=')[0].trim();
          const valPart = trimmed.substring(trimmed.indexOf('=') + 1).trim();
          
          
          jsCode += `if (typeof ${varName} === 'undefined') { var ${varName} = ${valPart}; } else { ${varName} = ${valPart}; }\n`;
        }

        
        
        else if (trimmed.startsWith('for ') && trimmed.includes(' in range(') && trimmed.endsWith(':')) {
          const loopVar = trimmed.substring(4, trimmed.indexOf(' in ')).trim();
          const rangeExpr = trimmed.substring(trimmed.indexOf('range(') + 6, trimmed.lastIndexOf('):')).trim();
          
          
          let loopStart = 0;
          let loopEnd = rangeExpr;
          if (rangeExpr.includes(',')) {
            const rangeParts = rangeExpr.split(',');
            loopStart = rangeParts[0].trim();
            loopEnd = rangeParts[1].trim();
          }

          jsCode += `for (var ${loopVar} = ${loopStart}; ${loopVar} < ${loopEnd}; ${loopVar}++) {\n`;
          loopIndentStack.push(leadingSpaces + indentSpaces);
        }
        
        
        else {
          jsCode += trimmed + ';\n';
        }
      }

      
      while (loopIndentStack.length > 0) {
        jsCode += '}\n';
        loopIndentStack.pop();
      }

      
      const capturedLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        capturedLogs.push({ 
          type: 'log', 
          text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') 
        });
      };

      
      try {
        const executor = new Function(jsCode);
        executor();
      } catch (err) {
        simLogs.push({ type: 'error', text: `RuntimeError: ${err.message}` });
      }

      
      console.log = originalLog;

      if (capturedLogs.length > 0) {
        simLogs.push(...capturedLogs);
      }
      simLogs.push({ type: 'system', text: 'Execution completed.' });
      setLogs((prev) => [...prev, ...simLogs]);

    } catch (err) {
      setLogs((prev) => [...prev, { type: 'error', text: `SyntaxError: ${err.message}` }]);
    }
  };

  
  const clearConsole = () => {
    setLogs([]);
  };

  
  const shareCode = () => {
    try {
      
      const base64Code = btoa(unescape(encodeURIComponent(code)));
      const shareUrl = `${window.location.origin}/playground?code=${base64Code}&lang=${language}`;
      
      navigator.clipboard.writeText(shareUrl);
      setToastMessage('Playground URL copied to clipboard!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to generate sharing URL:', err);
    }
  };

  
  const lineCount = code ? code.split('\n').length : 0;

  return (
    <div className={`playground-container ${isFullscreen ? 'playground-fullscreen' : ''}`}>
      {showToast && (
        <div className="playground-toast" id="playground-toast-alert">
          <i className="fa fa-check-circle" style={{ color: 'var(--teal)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <AnimateBox effect="fadeInLeft">
        <div className="playground-header-wrap">
          <div className="playground-title-desc">
            <h1>Online Developer Playground &amp; Code Sandbox</h1>
            <p>Write custom scripts, design responsive markup, or experiment with code logic right in your browser.</p>
          </div>

          <div className="playground-controls">
            <div className="playground-control-group">
              <label htmlFor="language-select">Language:</label>
              <select
                id="language-select"
                className="playground-select"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  if (e.target.value === 'html') {
                    setActiveTab('preview');
                  } else {
                    setActiveTab('console');
                  }
                }}
              >
                <option value="javascript">JavaScript (ES6)</option>
                <option value="html">HTML / CSS / JS</option>
                <option value="python">Python 3.x (Simulated)</option>
              </select>
            </div>

            <div className="playground-control-group">
              <label htmlFor="template-select">Templates:</label>
              <select
                id="template-select"
                className="playground-select"
                defaultValue="javascript"
                onChange={handleTemplateChange}
              >
                <option value="javascript">JavaScript: Quick Sort</option>
                <option value="async_javascript">JavaScript: Fetch API</option>
                <option value="html">Web: Glassmorphic Card UI</option>
                <option value="python">Python: Fibonacci Generator</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button 
                id="playground-run-btn" 
                className="playground-btn playground-btn-run"
                onClick={runCode}
              >
                <i className="fa fa-play" /> Run Code
              </button>

              <button 
                id="playground-clear-btn" 
                className="playground-btn playground-btn-secondary"
                onClick={clearConsole}
              >
                <i className="fa fa-trash-o" /> Clear
              </button>

              <button 
                id="playground-share-btn" 
                className="playground-btn playground-btn-share"
                onClick={shareCode}
              >
                <i className="fa fa-share-alt" /> Share Code
              </button>

              <button 
                id="playground-fullscreen-btn" 
                className="playground-btn playground-btn-secondary"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <i className={`fa ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} /> {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      </AnimateBox>

      {}
      <div className="playground-workspace" style={{ display: (isEditorMaximized || isOutputMaximized) ? 'block' : undefined }}>
        {}
        <div className="playground-editor-wrapper" style={{ display: isOutputMaximized ? 'none' : 'flex' }}>
          <div className="playground-editor-header">
            <span className="editor-filename">
              <i className="fa fa-file-code-o" />
              {language === 'javascript' && 'index.js'}
              {language === 'html' && 'index.html'}
              {language === 'python' && 'script.py'}
            </span>
            <span className="editor-actions">
              Tab indents 4 spaces
              <button 
                onClick={() => setIsEditorMaximized(!isEditorMaximized)} 
                style={{ marginLeft: '12px', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
                title="Toggle Maximize"
              >
                <i className={`fa ${isEditorMaximized ? 'fa-compress' : 'fa-expand'}`} />
              </button>
            </span>
          </div>

          <div className="playground-editor-body" style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            <div className="playground-editor-container" style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  fontFamily: "'Consolas', 'Fira Code', 'Courier New', monospace"
                }}
              />
            </div>
          </div>

          <div className="playground-editor-footer">
            <span>Encoding: UTF-8</span>
            <span>Lines: {lineCount} | Chars: {code.length}</span>
          </div>
        </div>

        {}
        <div className="playground-output-wrapper" style={{ display: isEditorMaximized ? 'none' : 'flex', flexDirection: 'column' }}>
          <div className="playground-output-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <button
                id="tab-console"
                className={`playground-output-tab${activeTab === 'console' ? ' active' : ''}`}
                onClick={() => setActiveTab('console')}
              >
                <i className="fa fa-terminal" style={{ marginRight: '6px' }} />
                Terminal Console
              </button>
              
              <button
                id="tab-preview"
                className={`playground-output-tab${activeTab === 'preview' ? ' active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <i className="fa fa-eye" style={{ marginRight: '6px' }} />
                Live Preview
              </button>
            </div>
            
            <button 
              onClick={() => setIsOutputMaximized(!isOutputMaximized)}
              style={{ background: 'transparent', border: 'none', color: '#abb2bf', cursor: 'pointer', padding: '0 15px' }}
              title="Toggle Maximize"
            >
              <i className={`fa ${isOutputMaximized ? 'fa-compress' : 'fa-expand'}`} />
            </button>
          </div>

          <div className="playground-console" id="playground-terminal-console" style={{ display: activeTab === 'console' ? 'flex' : 'none' }}>
            {logs.length === 0 ? (
              <div className="console-empty">
                <i className="fa fa-code" />
                <p>Console is empty. Click "Run Code" above to execute your script.</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`console-line ${log.type}`}>
                  {log.text}
                </div>
              ))
            )}
          </div>
          
          <div className="playground-preview-container" style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
            {language !== 'html' && language !== 'javascript' ? (
              <div className="playground-preview-placeholder">
                <i className="fa fa-ban" />
                <p>Live Preview is only available for Web (HTML/CSS/JS) projects.</p>
              </div>
            ) : (
              <iframe
                id="playground-preview-frame"
                ref={iframeRef}
                className="playground-preview-iframe"
                title="Code Preview Sandbox"
                sandbox="allow-scripts allow-popups"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
