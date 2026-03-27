"use client";

import React, { useState, useEffect } from "react";
import { compress, decompress, stats } from "ctx-compressor";
import {
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Cpu,
  Zap,
  ChevronRight,
  Info,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebHaptics } from "web-haptics/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stats interface for ctx-compressor
interface CompressionStats {
  originalChars: number;
  compressedChars: number;
  ratio: number;
  savings: string;
}

export default function CompressorPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [statsData, setStatsData] = useState<CompressionStats | null>(null);
  const { trigger } = useWebHaptics();
  const [mode, setMode] = useState<"compress" | "decompress">("compress");
  const [format, setFormat] = useState<"ctx" | "toon">("ctx");
  const [suggestion, setSuggestion] = useState<{ better: "ctx" | "toon"; savingsDiff: string } | null>(null);
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Add global mouse listener for profile cursor effect
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const images = {
    manas: "/authors/manas.jpg",
    vinod: "/authors/vinod.jpg"
  };

  // Initial demo data
  useEffect(() => {
    const demo = [
      {
        "name": "Adeel Solangi",
        "language": "Sindhi",
        "id": "V59OF92YF627HFY0",
        "bio": "Donec lobortis eleifend condimentum. Cras dictum dolor lacinia lectus vehicula rutrum. Maecenas quis nisi nunc. Nam tristique feugiat est vitae mollis. Maecenas quis nisi nunc.",
        "version": 6.1
      },
      {
        "name": "Afzal Ghaffar",
        "language": "Sindhi",
        "id": "ENTOCR13RSCLZ6KU",
        "bio": "Aliquam sollicitudin ante ligula, eget malesuada nibh efficitur et. Pellentesque massa sem, scelerisque sit amet odio id, cursus tempor urna. Etiam congue dignissim volutpat. Vestibulum pharetra libero et velit gravida euismod.",
        "version": 1.88
      },
      {
        "name": "Aamir Solangi",
        "language": "Sindhi",
        "id": "IAKPO3R4761JDRVG",
        "bio": "Vestibulum pharetra libero et velit gravida euismod. Quisque mauris ligula, efficitur porttitor sodales ac, lacinia non ex. Fusce eu ultrices elit, vel posuere neque.",
        "version": 7.27
      },
      {
        "name": "Abla Dilmurat",
        "language": "Uyghur",
        "id": "5ZVOEPMJUI4MB4EN",
        "bio": "Donec lobortis eleifend condimentum. Morbi ac tellus erat.",
        "version": 2.53
      },
      {
        "name": "Adil Eli",
        "language": "Uyghur",
        "id": "6VTI8X6LL0MMPJCC",
        "bio": "Vivamus id faucibus velit, id posuere leo. Morbi vitae nisi lacinia, laoreet lorem nec, egestas orci. Suspendisse potenti.",
        "version": 6.49
      },
      {
        "name": "Adile Qadir",
        "language": "Uyghur",
        "id": "F2KEU5L7EHYSYFTT",
        "bio": "Duis commodo orci ut dolor iaculis facilisis. Morbi ultricies consequat ligula posuere eleifend. Aenean finibus in tortor vel aliquet. Fusce eu ultrices elit, vel posuere neque.",
        "version": 1.9
      },
      {
        "name": "Abdukerim Ibrahim",
        "language": "Uyghur",
        "id": "LO6DVTZLRK68528I",
        "bio": "Vivamus id faucibus velit, id posuere leo. Nunc aliquet sodales nunc a pulvinar. Nunc aliquet sodales nunc a pulvinar. Ut viverra quis eros eu tincidunt.",
        "version": 5.9
      },
      {
        "name": "Adil Abro",
        "language": "Sindhi",
        "id": "LJRIULRNJFCNZJAJ",
        "bio": "Etiam malesuada blandit erat, nec ultricies leo maximus sed. Fusce congue aliquam elit ut luctus. Etiam malesuada blandit erat, nec ultricies leo maximus sed. Cras dictum dolor lacinia lectus vehicula rutrum. Integer vehicula, arcu sit amet egestas efficitur, orci justo interdum massa, eget ullamcorper risus ligula tristique libero.",
        "version": 9.32
      },
      {
        "name": "Afonso Vilarchán",
        "language": "Galician",
        "id": "JMCL0CXNXHPL1GBC",
        "bio": "Fusce eu ultrices elit, vel posuere neque. Morbi ac tellus erat. Nunc tincidunt laoreet laoreet.",
        "version": 5.21
      },
      {
        "name": "Mark Schembri",
        "language": "Maltese",
        "id": "KU4T500C830697CW",
        "bio": "Nam laoreet, nunc non suscipit interdum, justo turpis vestibulum massa, non vulputate ex urna at purus. Morbi ultricies consequat ligula posuere eleifend. Vivamus id faucibus velit, id posuere leo. Sed laoreet posuere sapien, ut feugiat nibh gravida at. Ut maximus, libero nec facilisis fringilla, ex sem sollicitudin leo, non congue tortor ligula in eros.",
        "version": 3.17
      },
      {
        "name": "Antía Sixirei",
        "language": "Galician",
        "id": "XOF91ZR7MHV1TXRS",
        "bio": "Pellentesque massa sem, scelerisque sit amet odio id, cursus tempor urna. Phasellus massa ligula, hendrerit eget efficitur eget, tincidunt in ligula. Morbi finibus dui sed est fringilla ornare. Duis pellentesque ultrices convallis. Morbi ultricies consequat ligula posuere eleifend.",
        "version": 6.44
      },
      {
        "name": "Aygul Mutellip",
        "language": "Uyghur",
        "id": "FTSNV411G5MKLPDT",
        "bio": "Duis commodo orci ut dolor iaculis facilisis. Nam semper gravida nunc, sit amet elementum ipsum. Donec pellentesque ultrices mi, non consectetur eros luctus non. Pellentesque massa sem, scelerisque sit amet odio id, cursus tempor urna.",
        "version": 9.1
      },
      {
        "name": "Awais Shaikh",
        "language": "Sindhi",
        "id": "OJMWMEEQWMLDU29P",
        "bio": "Nunc aliquet sodales nunc a pulvinar. Ut dictum, ligula eget sagittis maximus, tellus mi varius ex, a accumsan justo tellus vitae leo. Donec pellentesque ultrices mi, non consectetur eros luctus non. Nulla finibus massa at viverra facilisis. Nunc tincidunt laoreet laoreet.",
        "version": 1.59
      },
      {
        "name": "Ambreen Ahmed",
        "language": "Sindhi",
        "id": "5G646V7E6TJW8X2M",
        "bio": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam consequat enim lorem, at tincidunt velit ultricies et. Ut maximus, libero nec facilisis fringilla, ex sem sollicitudin leo, non congue tortor ligula in eros.",
        "version": 2.35
      },
      {
        "name": "Celtia Anes",
        "language": "Galician",
        "id": "Z53AJY7WUYPLAWC9",
        "bio": "Nullam ac sodales dolor, eu facilisis dui. Maecenas non arcu nulla. Ut viverra quis eros eu tincidunt. Curabitur quis commodo quam.",
        "version": 8.34
      },
      {
        "name": "George Mifsud",
        "language": "Maltese",
        "id": "N1AS6UFULO6WGTLB",
        "bio": "Phasellus tincidunt sollicitudin posuere. Ut accumsan, est vel fringilla varius, purus augue blandit nisl, eu rhoncus ligula purus vel dolor. Donec congue sapien vel euismod interdum. Cras dictum dolor lacinia lectus vehicula rutrum. Phasellus massa ligula, hendrerit eget efficitur eget, tincidunt in ligula.",
        "version": 7.47
      },
      {
        "name": "Aytürk Qasim",
        "language": "Uyghur",
        "id": "70RODUVRD95CLOJL",
        "bio": "Curabitur ultricies id urna nec ultrices. Aliquam scelerisque pretium tellus, sed accumsan est ultrices id. Duis commodo orci ut dolor iaculis facilisis.",
        "version": 1.32
      },
      {
        "name": "Dialè Meso",
        "language": "Sesotho sa Leboa",
        "id": "VBLI24FKF7VV6BWE",
        "bio": "Maecenas non arcu nulla. Vivamus id faucibus velit, id posuere leo. Nullam sodales convallis mauris, sit amet lobortis magna auctor sit amet.",
        "version": 6.29
      },
      {
        "name": "Breixo Galáns",
        "language": "Galician",
        "id": "4VRLON0GPEZYFCVL",
        "bio": "Integer vehicula, arcu sit amet egestas efficitur, orci justo interdum massa, eget ullamcorper risus ligula tristique libero. Morbi ac tellus erat. In id elit malesuada, pulvinar mi eu, imperdiet nulla. Vestibulum pharetra libero et velit gravida euismod. Cras dictum dolor lacinia lectus vehicula rutrum.",
        "version": 1.62
      },
      {
        "name": "Bieito Lorme",
        "language": "Galician",
        "id": "5DRDI1QLRGLP29RC",
        "bio": "Ut viverra quis eros eu tincidunt. Morbi vitae nisi lacinia, laoreet lorem nec, egestas orci. Curabitur quis commodo quam. Morbi ac tellus erat.",
        "version": 4.45
      },
      {
        "name": "Azrugul Osman",
        "language": "Uyghur",
        "id": "5RCTVD3C5QGVAKTQ",
        "bio": "Maecenas tempus neque ut porttitor malesuada. Donec lobortis eleifend condimentum.",
        "version": 3.18
      },
      {
        "name": "Brais Verdiñas",
        "language": "Galician",
        "id": "BT407GHCC0IHXCD3",
        "bio": "Quisque maximus sodales mauris ut elementum. Ut viverra quis eros eu tincidunt. Sed eu libero maximus nunc lacinia lobortis et sit amet nisi. In id elit malesuada, pulvinar mi eu, imperdiet nulla. Curabitur quis commodo quam.",
        "version": 5.01
      },
      {
        "name": "Ekber Sadir",
        "language": "Uyghur",
        "id": "AGZDAP8D8OVRRLTY",
        "bio": "Quisque efficitur vel sapien ut imperdiet. Phasellus massa ligula, hendrerit eget efficitur eget, tincidunt in ligula. In id elit malesuada, pulvinar mi eu, imperdiet nulla. Sed nec suscipit ligula. Integer vehicula, arcu sit amet egestas efficitur, orci justo interdum massa, eget ullamcorper risus ligula tristique libero.",
        "version": 2.04
      },
      {
        "name": "Doreen Bartolo",
        "language": "Maltese",
        "id": "59QSX02O2XOZGRLH",
        "bio": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam consequat enim lorem, at tincidunt velit ultricies et. Nam semper gravida nunc, sit amet elementum ipsum. Ut viverra quis eros eu tincidunt. Curabitur sed condimentum felis, ut luctus eros.",
        "version": 9.31
      },
      {
        "name": "Ali Ayaz",
        "language": "Sindhi",
        "id": "3WNLUZ5LT2F7MYVU",
        "bio": "Cras dictum dolor lacinia lectus vehicula rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam consequat enim lorem, at tincidunt velit ultricies et. Etiam malesuada blandit erat, nec ultricies leo maximus sed.",
        "version": 7.8
      },
      {
        "name": "Guzelnur Polat",
        "language": "Uyghur",
        "id": "I6QQHAEGV4CYDXLP",
        "bio": "Nam laoreet, nunc non suscipit interdum, justo turpis vestibulum massa, non vulputate ex urna at purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam consequat enim lorem, at tincidunt velit ultricies et. Nulla finibus massa at viverra facilisis.",
        "version": 8.56
      },
      {
        "name": "John Falzon",
        "language": "Maltese",
        "id": "U3AWXHDTSU0H82SL",
        "bio": "Sed nec suscipit ligula. Nullam sodales convallis mauris, sit amet lobortis magna auctor sit amet.",
        "version": 9.96
      },
      {
        "name": "Erkin Qadir",
        "language": "Uyghur",
        "id": "GV6TA1AATZYBJ3VR",
        "bio": "Phasellus massa ligula, hendrerit eget efficitur eget, tincidunt in ligula. .",
        "version": 3.53
      },
      {
        "name": "Anita Rajput",
        "language": "Sindhi",
        "id": "XLLVD0NO2ZFEP4AK",
        "bio": "Nam semper gravida nunc, sit amet elementum ipsum. Etiam congue dignissim volutpat.",
        "version": 5.16
      },
      {
        "name": "Ayesha Khalique",
        "language": "Sindhi",
        "id": "Q9A5QNGA0OSU8P6Y",
        "bio": "Morbi vitae nisi lacinia, laoreet lorem nec, egestas orci. Etiam mauris magna, fermentum vitae aliquet eu, cursus vitae sapien.",
        "version": 3.9
      },
      {
        "name": "Pheladi Rammala",
        "language": "Sesotho sa Leboa",
        "id": "EELSIRT2T4Q0M3M4",
        "bio": "Quisque efficitur vel sapien ut imperdiet. Morbi ac tellus erat. Aliquam scelerisque pretium tellus, sed accumsan est ultrices id. Ut maximus, libero nec facilisis fringilla, ex sem sollicitudin leo, non congue tortor ligula in eros.",
        "version": 1.88
      },
      {
        "name": "Antón Caneiro",
        "language": "Galician",
        "id": "ENTAPNU3MMFUGM1W",
        "bio": "Integer vehicula, arcu sit amet egestas efficitur, orci justo interdum massa, eget ullamcorper risus ligula tristique libero. Vestibulum pharetra libero et velit gravida euismod.",
        "version": 4.84
      },
      {
        "name": "Qahar Abdulla",
        "language": "Uyghur",
        "id": "OGLODUPEHKEW0K83",
        "bio": "Duis commodo orci ut dolor iaculis facilisis. Aliquam sollicitudin ante ligula, eget malesuada nibh efficitur et. Fusce congue aliquam elit ut luctus. Integer vehicula, arcu sit amet egestas efficitur, orci justo interdum massa, eget ullamcorper risus ligula tristique libero. Quisque maximus sodales mauris ut elementum.",
        "version": 3.65
      },
      {
        "name": "Reyhan Murat",
        "language": "Uyghur",
        "id": "Y91F4D54794E9ANT",
        "bio": "Suspendisse sit amet ullamcorper sem. Curabitur sed condimentum felis, ut luctus eros.",
        "version": 2.69
      },
      {
        "name": "Tatapi Phogole",
        "language": "Sesotho sa Leboa",
        "id": "7JA42P5CMCWDVPNR",
        "bio": "Duis luctus, lacus eu aliquet convallis, purus elit malesuada ex, vitae rutrum ipsum dui ut magna. Nullam ac sodales dolor, eu facilisis dui. Ut viverra quis eros eu tincidunt.",
        "version": 3.78
      },
      {
        "name": "Marcos Amboade",
        "language": "Galician",
        "id": "WPX7H97C7D70CZJR",
        "bio": "Nulla finibus massa at viverra facilisis. Pellentesque massa sem, scelerisque sit amet odio id, cursus tempor urna. Curabitur ultricies id urna nec ultrices. Ut maximus, libero nec facilisis fringilla, ex sem sollicitudin leo, non congue tortor ligula in eros. Nunc aliquet sodales nunc a pulvinar.",
        "version": 7.37
      },
      {
        "name": "Grace Tabone",
        "language": "Maltese",
        "id": "K4XO8G8DMRNSHF2B",
        "bio": "Curabitur sed condimentum felis, ut luctus eros. Duis luctus, lacus eu aliquet convallis, purus elit malesuada ex, vitae rutrum ipsum dui ut magna.",
        "version": 5.36
      },
      {
        "name": "Shafqat Memon",
        "language": "Sindhi",
        "id": "D8VFLVRXBXMVBRVI",
        "bio": "Aliquam scelerisque pretium tellus, sed accumsan est ultrices id. . Curabitur quis commodo quam. Quisque maximus sodales mauris ut elementum. Quisque mauris ligula, efficitur porttitor sodales ac, lacinia non ex.",
        "version": 8.95
      },
      {
        "name": "Zeynep Semet",
        "language": "Uyghur",
        "id": "Z324TZV8S0FGDSAO",
        "bio": "Quisque mauris ligula, efficitur porttitor sodales ac, lacinia non ex. Fusce eu ultrices elit, vel posuere neque. Nulla finibus massa at viverra facilisis.",
        "version": 1.03
      },
      {
        "name": "Meladi Papo",
        "language": "Sesotho sa Leboa",
        "id": "RJAZQ6BBLRT72CD9",
        "bio": "Quisque efficitur vel sapien ut imperdiet. Pellentesque massa sem, scelerisque sit amet odio id, cursus tempor urna. Ut accumsan, est vel fringilla varius, purus augue blandit nisl, eu rhoncus ligula purus vel dolor. Etiam congue dignissim volutpat. Donec congue sapien vel euismod interdum.",
        "version": 7.22
      }
    ];
    setInput(JSON.stringify(demo, null, 2));

    // Trigger initial conversion after a small delay to ensure state is ready
    setTimeout(() => {
      document.querySelector('button[title*="Convert"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, 100);
  }, []);

  // Custom TOON formatter (Text-Oriented Object Notation)
  const toToon = (obj: any, indent = ""): string => {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      if (typeof obj[0] === 'object' && obj[0] !== null) {
        const keys = Object.keys(obj[0]);
        const header = `[${obj.length}]{${keys.join(',')}}`;
        const rows = obj.map(item => `  ${keys.map(k => String(item[k])).join(',')}`).join('\n');
        return `${header}:\n${rows}`;
      }
      return `[${obj.length}]: ${obj.join(', ')}`;
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).map(([key, val]) => {
        if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'object') {
          const keys = Object.keys(val[0]);
          const header = `${key}[${val.length}]{${keys.join(',')}}`;
          const rows = val.map(item => `  ${keys.map(k => String(item[k])).join(',')}`).join('\n');
          return `${header}:\n${rows}`;
        }
        if (typeof val === 'object' && val !== null) {
          return `${key}:\n${toToon(val, "  ").split('\n').map(l => "  " + l).join('\n')}`;
        }
        return `${key}: ${String(val)}`;
      }).join('\n');
    }
    return String(obj);
  };

  const handleConvert = () => {
    setError(null);
    setSuggestion(null);
    try {
      if (!input.trim()) {
        setError("Please enter some JSON data.");
        return;
      }

      if (mode === "compress") {
        let parsed;
        try {
          parsed = JSON.parse(input);
        } catch (e) {
          setError("Invalid JSON format. Please check your syntax.");
          return;
        }

        // Calculate both in background for comparison
        const toonStr = toToon(parsed);
        const ctxStr = compress(parsed);

        const origJson = JSON.stringify(parsed);
        const origLen = origJson.length;

        // Calculate savings for both
        const toonSavingsNum = (1 - (toonStr.length / origLen)) * 100;
        const ctxStats = stats(origJson, ctxStr);
        const ctxSavingsNum = (1 - (ctxStr.length / origLen)) * 100;

        // Set output based on current format
        if (format === "toon") {
          setOutput(toonStr);
          setStatsData({
            originalChars: origLen,
            compressedChars: toonStr.length,
            ratio: toonStr.length / origLen,
            savings: `${toonSavingsNum.toFixed(1)}%`
          });
        } else {
          setOutput(ctxStr);
          setStatsData(ctxStats as CompressionStats);
        }
        trigger("success");

        // Generate suggestion if the other one is significantly better (>2% difference)
        if (format === "ctx" && toonSavingsNum > ctxSavingsNum + 2) {
          setSuggestion({ better: "toon", savingsDiff: (toonSavingsNum - ctxSavingsNum).toFixed(1) });
        } else if (format === "toon" && ctxSavingsNum > toonSavingsNum + 2) {
          setSuggestion({ better: "ctx", savingsDiff: (ctxSavingsNum - toonSavingsNum).toFixed(1) });
        }
      } else {
        // Decompress mode
        try {
          const restored = decompress(input);
          setOutput(JSON.stringify(restored, null, 2));
          setStatsData(null);
        } catch (e) {
          trigger("error");
          setError("Not a valid CTX/2 compressed string.");
        }
      }
    } catch (err: any) {
      trigger("error");
      setError(err.message || "An error occurred during processing.");
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
    setStatsData(null);
    setSuggestion(null);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    trigger("selection");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === "compress" ? "decompress" : "compress");
    handleReset();
  };

  return (
    <main className="min-h-screen bg-grid flex flex-col items-center justify-start p-4 pt-8 md:p-12 selection:bg-indigo-500/30">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mb-12 text-center"
      >
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
          </div>
          <h1 className="text-2xl min-[400px]:text-3xl sm:text-5xl font-bold tracking-tight text-white whitespace-nowrap">
            Context-Compressor
          </h1>
        </div>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto px-4">
          High-density JSON compression for LLM-context pipelines. Optimized via <span className="text-indigo-400 font-semibold italic">CTX-Core</span> and structured <span className="text-sky-400 font-semibold italic">TOON</span> packetization.
        </p>
      </motion.div>

      {/* Main UI */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch lg:h-[600px] relative">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 relative"
        >
          <div className="flex items-center justify-between">
            <label className="text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <Layers className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-400" />
              <span className="text-xs md:text-sm">
                {mode === "compress" ? "Input JSON" : "Compressed String"}
              </span>
            </label>
            <div className="flex gap-2">
              <div className="flex bg-slate-800 rounded-full p-0.5 border border-slate-700 mr-2">
                <button
                  onClick={() => {
                    setFormat("ctx");
                    trigger("selection");
                  }}
                  className={cn(
                    "text-[10px] px-3 py-1 rounded-full transition-all uppercase font-bold tracking-widest",
                    format === "ctx" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  CTX
                </button>
                <button
                  onClick={() => {
                    setFormat("toon");
                    trigger("nudge");
                  }}
                  className={cn(
                    "text-[10px] px-3 py-1 rounded-full transition-all uppercase font-bold tracking-widest",
                    format === "toon" ? "bg-sky-600 text-white" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  TOON
                </button>
              </div>
              <button
                onClick={toggleMode}
                className="text-[10px] md:text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 md:px-3 py-1 rounded-full border border-slate-700 transition"
              >
                <span className="hidden sm:inline">Switch to </span>
                {mode === "compress" ? "Decompress" : "Compress"}
              </button>
            </div>
          </div>

          <div className="flex-1 glass editor-glass rounded-2xl overflow-hidden relative group flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "compress" ? "Paste your JSON here..." : "Paste CTX/2 string here..."}
              className="flex-1 w-full bg-transparent p-4 md:p-6 font-mono text-sm text-indigo-100 placeholder:text-slate-600 outline-none resize-none min-h-[300px] lg:min-h-0"
            />
            {/* TOON Box / Footer info */}
            <div className="bg-slate-900/50 px-6 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              <span>Maximum support: 262,144 tokens</span>
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Ready
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-12 left-4 right-4 bg-red-900/80 border border-red-500/50 backdrop-blur-md p-3 rounded-lg flex items-center gap-2 text-sm text-red-100 z-20"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Mobile Actions - only visible on small screens between Editor panels */}
        <div className="flex lg:hidden flex-wrap gap-3 w-full">
          <button
            onClick={handleConvert}
            className="flex-[2.5] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <span className="text-sm uppercase tracking-wide">
              {mode === "compress" ? (format === "toon" ? "Run TOON" : "Compress") : "Reverse"}
            </span>
            <ArrowRight className={cn("w-5 h-5", mode === "decompress" && "rotate-180")} />
          </button>

          <button
            onClick={() => {
              if (!output) return;
              setInput(output);
              setOutput("");
              setMode(mode === "compress" ? "decompress" : "compress");
            }}
            title="Swap"
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 px-2 rounded-2xl border border-slate-700 active:scale-95 transition shadow-lg"
          >
            <ArrowRight className="w-5 h-5 rotate-90" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Swap</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset"
            className="flex-1 flex flex-col items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-rose-400/80 py-3 px-2 rounded-2xl border border-slate-700 active:scale-95 transition shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Clear</span>
          </button>
        </div>

        {/* Action Buttons (Floating in middle for larger screens) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleConvert}
              title={mode === "compress" ? (format === "toon" ? "Convert to TOON" : "Compress to CTX/2") : "Decompress to JSON"}
              className="group relative flex items-center justify-center p-4 bg-indigo-600 rounded-full border-4 border-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
              {mode === "compress" ? (
                <ArrowRight className="w-8 h-8 text-white relative z-10" />
              ) : (
                <motion.div initial={{ rotate: 180 }} className="relative z-10">
                  <ArrowRight className="w-8 h-8 text-white" />
                </motion.div>
              )}
            </button>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-1">
              {mode === "compress" ? (format === "toon" ? "TOON" : "Compress") : "Reverse"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                if (!output) return;
                const oldOutput = output;
                const oldInput = input;
                setInput(oldOutput);
                setOutput("");
                setMode(mode === "compress" ? "decompress" : "compress");
                setStatsData(null);
              }}
              title="Swap Input & Output"
              className="flex items-center justify-center p-3 bg-slate-800/80 hover:bg-indigo-900/40 hover:text-indigo-400 group rounded-full border border-slate-700 shadow-xl transition-all"
            >
              <ArrowRight className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
              Swap
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleReset}
              title="Reset All"
              className="flex items-center justify-center p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 shadow-xl transition-all"
            >
              <RotateCcw className="w-5 h-5 text-slate-400" />
            </button>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">
              Reset
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-slate-400 font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-400" />
                <span className="text-xs md:text-sm">
                  {mode === "compress" ? (format === "ctx" ? "CTX/2 Result" : "TOON Result") : "Original JSON"}
                </span>
              </label>
              <div className={cn(
                "text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
                format === "ctx" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              )}>
                {mode === "compress" ? (format === "ctx" ? "CTX Core" : "TOON Object") : "RESTORED"}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {mode === "compress" && format === "ctx" && (
                <div className="group relative cursor-help">
                  {/* <button className="flex items-center justify-center p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30 transition-all">
                    <Info className="w-3.5 h-3.5" />
                  </button> */}
                  <div className="absolute right-0 bottom-full mb-3 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl text-[11px] text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 shadow-[-20px_20px_60px_rgba(0,0,0,0.6)] pointer-events-none translate-y-3 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-amber-500/20 p-1.5 rounded-lg">
                        <Info className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className="text-white font-bold uppercase tracking-widest text-[10px]">Cognitive Alert</span>
                    </div>
                    <p className="leading-relaxed leading-5">
                      CTX/2 achieves <span className="text-amber-400 font-extrabold italic">highest token density</span>. We recommend TOON mode for complex reasoning tasks that require <span className="text-sky-400 font-extrabold italic">maximum model attention focus</span>.
                    </p>
                  </div>
                </div>
              )}
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/30 transition-all"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 glass editor-glass rounded-2xl overflow-hidden group relative">
            <textarea
              readOnly
              value={output}
              placeholder="Result will appear here..."
              className="w-full h-full bg-transparent p-4 md:p-6 font-mono text-sm text-sky-100 placeholder:text-slate-600 outline-none resize-none cursor-default min-h-[300px] lg:h-full"
            />

            <AnimatePresence>
              {suggestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-4 left-4 right-4 bg-indigo-900/90 border border-indigo-500/50 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between shadow-2xl z-30"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 p-1.5 rounded-lg">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-wide">Better Token Performance Available</p>
                      <p className="text-indigo-200 text-[10px] mt-0.5">
                        Switch to <span className="text-white font-bold">{suggestion.better.toUpperCase()}</span> for <span className="text-emerald-400 font-bold">+{suggestion.savingsDiff}%</span> better savings.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFormat(suggestion.better);
                      // Auto-convert to show the better version
                      setTimeout(handleConvert, 10);
                    }}
                    className="bg-white hover:bg-indigo-100 text-indigo-900 text-[10px] font-bold px-4 py-2 rounded-lg transition-colors uppercase tracking-widest"
                  >
                    Switch
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!output && !error && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <ChevronRight className="w-24 h-24 text-slate-600 rotate-90 lg:rotate-0" />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <AnimatePresence>
        {statsData && mode === "compress" && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-7xl mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              label="Original Size"
              value={`${statsData.originalChars} chars`}
              icon={<Layers className="w-4 h-4" />}
              color="indigo"
            />
            <StatCard
              label="Compressed Size"
              value={`${statsData.compressedChars} chars`}
              icon={<Zap className="w-4 h-4 text-sky-400" />}
              color="sky"
            />
            <StatCard
              label="Efficiency"
              value={statsData.savings}
              icon={<TrendingIcon className="w-4 h-4 text-emerald-400 font-bold" />}
              color="emerald"
              highlight
            />
            <StatCard
              label="Context Density"
              value={`${(1 / statsData.ratio).toFixed(1)}x`}
              icon={<Info className="w-4 h-4 text-amber-400 hover:text-amber-300" />}
              color="amber"
              description="More data in the same context"
            />
          </motion.div>
        )}
      </AnimatePresence>



      <footer className="mt-24 sm:mt-24 w-full max-w-7xl border-t border-white/5 ">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Features</h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24">
          <FeatureCard
            title="LLM-Ready Output"
            description="Specifically designed for passing large JSON data to models like GPT-4, Claude and Gemini while saving tokens."
            icon={<Cpu className="w-6 h-6 text-sky-400" />}
          />
          <FeatureCard
            title="Lossless & Reversible"
            description="The compression is 100% reversible. Use the Reverse mode to get back your original JSON structure instantly."
            icon={<RotateCcw className="w-6 h-6 text-indigo-400" />}
          />
          <FeatureCard
            title="Human Readable"
            description="Unlike binary compressors, the output remains plain text, allowing you to peek at the data and debug with ease."
            icon={<Layers className="w-6 h-6 text-emerald-400" />}
          />
          <FeatureCard
            title="Cognitive Aware"
            description="Balance density with 'Cognitive Load.' TOON mode offers higher clarity for complex reasoning tasks."
            icon={<Info className="w-4 h-4 text-amber-400" />}
          />
        </div>

        <div className="flex flex-col items-center gap-10 mt-12 bg-slate-900/60 p-6 md:p-12 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group/footer">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full opacity-0 group-hover/footer:opacity-100 transition-opacity duration-1000" />

          <div className="flex flex-col items-center text-center gap-2 relative z-10 w-full">
            <div className="flex flex-col items-center gap-2">
              <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed max-w-lg md:max-w-2xl">
                This project uses <span className="text-white font-bold bg-indigo-500/20 px-2 py-0.5 rounded-lg border border-indigo-500/10">ctx algorithm</span> provided by{" "}
                <a
                  href="https://www.linkedin.com/in/manas-mishra-768a7a24b"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredProfile("manas")}
                  onMouseLeave={() => setHoveredProfile(null)}
                  className="text-white hover:text-indigo-400 underline decoration-indigo-500/30 underline-offset-8 transition-all font-bold hover:decoration-indigo-400"
                >
                  Manas Mishra
                </a>
              </p>
              <a
                href="https://www.npmjs.com/package/ctx-compressor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-slate-950/80 rounded-full border border-white/5 hover:border-white/20 hover:bg-slate-900 transition-all group/npm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover/npm:animate-ping" />
                <span className="text-slate-400 group-hover/npm:text-slate-200 text-xs font-mono">npm package: ctx-compressor</span>
              </a>
            </div>

            <div className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-2" />

            <div className="px-6 py-2 bg-slate-950/80 rounded-2xl border border-white/5 backdrop-blur-xl shadow-inner">
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] text-center">
                Context-Compressor • v1.4.0 • Technical LLM Utility
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <p className="text-slate-300 text-base font-medium text-center">
            By{" "}
            <a
              href="https://www.linkedin.com/in/vinod-tanwar-853976179"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredProfile("vinod")}
              onMouseLeave={() => setHoveredProfile(null)}
              className="text-white hover:text-sky-400 font-bold underline decoration-sky-500/30 underline-offset-8 transition-all hover:decoration-sky-400"
            >
              Vinod
            </a>
          </p>
        </div>
      </footer>

      {/* Profile Cursor Preview */}
      <AnimatePresence>
        {hoveredProfile && (
          <motion.div
            className="fixed top-0 left-0 z-[100] pointer-events-none"
            style={{
              x: mousePos.x + 20,
              y: mousePos.y - 120
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
              className="w-24 h-24 rounded-2xl border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden glass p-1 backdrop-blur-xl"
            >
              <img
                src={images[hoveredProfile as keyof typeof images]}
                className="w-full h-full object-cover rounded-xl"
                alt="Profile Preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="mb-4 bg-slate-800/50 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  highlight,
  description
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "indigo" | "sky" | "emerald" | "amber";
  highlight?: boolean;
  description?: string;
}) {
  const colorMap = {
    indigo: "border-indigo-500/20 text-indigo-400",
    sky: "border-sky-500/20 text-sky-400",
    emerald: "border-emerald-500/20 text-emerald-400",
    amber: "border-amber-500/20 text-amber-400",
  };

  return (
    <div className={cn(
      "glass p-4 rounded-2xl border flex flex-col gap-1 transition-all hover:scale-105 duration-300",
      colorMap[color],
      highlight && "bg-gradient-to-br from-indigo-500/10 to-transparent"
    )}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-bold text-white tracking-tight">{value}</div>
      {description && <div className="text-[10px] text-slate-500 mt-1">{description}</div>}
    </div>
  );
}
