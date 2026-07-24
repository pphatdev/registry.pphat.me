"use client";

import React, { useState } from 'react';

interface TerminalShowcaseProps {
    heroPkgManager: 'npm' | 'pnpm' | 'bun';
    copyToClipboard: (text: string, id: string) => void;
    copiedCommand: string | null;
}

export function TerminalShowcase({
    heroPkgManager,
    copyToClipboard,
    copiedCommand,
}: TerminalShowcaseProps) {
    const terminalViewportRef = React.useRef<HTMLDivElement>(null);

    const installCmd = heroPkgManager === 'npm'
        ? "npm install -g @pphatdev/registry"
        : heroPkgManager === 'pnpm'
        ? "pnpm add -g @pphatdev/registry"
        : "bun add -g @pphatdev/registry";

    const cliSteps = React.useMemo(() => [
        installCmd,
        "pphat",
        "pphat init",
        "pphat list icons",
        "pphat add react -f nextjs"
    ], [installCmd]);

    const [currentCmdIndex, setCurrentCmdIndex] = useState<number>(0);
    const [typedChars, setTypedChars] = useState<number>(0);
    const [completedStepCount, setCompletedStepCount] = useState<number>(0);
    const [initSubStep, setInitSubStep] = useState<number>(0);
    const [activeOptionIndex, setActiveOptionIndex] = useState<number>(0);
    const [selectOptionChecked, setSelectOptionChecked] = useState<boolean>(false);
    const [isTerminalPlaying, setIsTerminalPlaying] = useState<boolean>(true);

    React.useEffect(() => {
        if (terminalViewportRef.current) {
            terminalViewportRef.current.scrollTo({
                top: terminalViewportRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [typedChars, completedStepCount, currentCmdIndex, initSubStep, activeOptionIndex, selectOptionChecked]);

    React.useEffect(() => {
        if (!isTerminalPlaying) return;

        // Auto Replay After Completion (5s reading buffer)
        if (completedStepCount >= 5) {
            const autoReplayTimer = setTimeout(() => {
                setCurrentCmdIndex(0);
                setTypedChars(0);
                setCompletedStepCount(0);
                setInitSubStep(0);
                setActiveOptionIndex(0);
                setSelectOptionChecked(false);
            }, 5000);
            return () => clearTimeout(autoReplayTimer);
        }

        const targetText = cliSteps[currentCmdIndex];

        // 1. Smooth, clear typing speed (45ms per character)
        if (typedChars < targetText.length) {
            const timer = setTimeout(() => {
                setTypedChars((prev) => prev + 1);
            }, 45);
            return () => clearTimeout(timer);
        }

        // 2. Output response when command finishes typing (350ms)
        if (completedStepCount === currentCmdIndex) {
            const responseTimer = setTimeout(() => {
                setCompletedStepCount((prev) => prev + 1);
            }, 350);
            return () => clearTimeout(responseTimer);
        }

        // 3. STEP-BY-STEP REAL-LIFE CLI PPHAT INIT (step index 2, completedStepCount 3)
        if (currentCmdIndex === 2 && completedStepCount === 3) {
            // SubStep 0: Enter default config name ("Default configuration")
            if (initSubStep === 0) {
                const submitTimer = setTimeout(() => {
                    setInitSubStep(1);
                    setActiveOptionIndex(0);
                    setSelectOptionChecked(false);
                }, 850);
                return () => clearTimeout(submitTimer);
            }

            // SubStep 1: Selecting "Icons" (select = single-select: ↓ Arrow down -> Enter submit)
            if (initSubStep === 1) {
                if (activeOptionIndex === 0) {
                    const arrowDownTimer = setTimeout(() => {
                        setActiveOptionIndex(1);
                    }, 450);
                    return () => clearTimeout(arrowDownTimer);
                } else {
                    const enterSubmitTimer = setTimeout(() => {
                        setInitSubStep(2);
                        setActiveOptionIndex(0);
                        setSelectOptionChecked(false);
                    }, 700);
                    return () => clearTimeout(enterSubmitTimer);
                }
            }

            // SubStep 2: Selecting "Nextjs format (.tsx)" (↓ Arrow down -> Space select -> Enter submit)
            if (initSubStep === 2) {
                if (activeOptionIndex === 0) {
                    const arrowDownTimer = setTimeout(() => {
                        setActiveOptionIndex(1);
                    }, 450);
                    return () => clearTimeout(arrowDownTimer);
                } else if (!selectOptionChecked) {
                    const spaceSelectTimer = setTimeout(() => {
                        setSelectOptionChecked(true);
                    }, 450);
                    return () => clearTimeout(spaceSelectTimer);
                } else {
                    const enterSubmitTimer = setTimeout(() => {
                        setInitSubStep(3);
                    }, 600);
                    return () => clearTimeout(enterSubmitTimer);
                }
            }

            // SubStep 3: Enter default store directory ("components/icons")
            if (initSubStep === 3) {
                const submitTimer = setTimeout(() => {
                    setInitSubStep(4);
                }, 850);
                return () => clearTimeout(submitTimer);
            }

            // SubStep 4: Success Message -> Advance to `pphat list icons`
            if (initSubStep === 4) {
                const nextCmdDelayTimer = setTimeout(() => {
                    setCurrentCmdIndex(3);
                    setTypedChars(0);
                }, 2200);
                return () => clearTimeout(nextCmdDelayTimer);
            }
        }

        // 4. Delay before starting to type the next command for standard steps (1800ms)
        if (completedStepCount > currentCmdIndex && currentCmdIndex < cliSteps.length - 1) {
            const nextCmdDelayTimer = setTimeout(() => {
                setCurrentCmdIndex((prev) => prev + 1);
                setTypedChars(0);
            }, 1800);
            return () => clearTimeout(nextCmdDelayTimer);
        }
    }, [isTerminalPlaying, typedChars, currentCmdIndex, completedStepCount, initSubStep, activeOptionIndex, selectOptionChecked, cliSteps]);

    const replayTerminalSession = () => {
        setCurrentCmdIndex(0);
        setTypedChars(0);
        setCompletedStepCount(0);
        setInitSubStep(0);
        setActiveOptionIndex(0);
        setSelectOptionChecked(false);
        setIsTerminalPlaying(true);
    };

    const isFirstRender = React.useRef(true);
    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        replayTerminalSession();
    }, [heroPkgManager]);

    return (
        <div className="w-full rounded-3xl bg-[#0d1117] border border-border/80 shadow-2xl overflow-hidden flex flex-col font-mono text-xs max-w-4xl mx-auto">
            {/* Window Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[#161b22] border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    <span className="text-xs text-zinc-400 font-bold ml-2">bash — pphat CLI Session</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {/* Play / Pause Toggle Button */}
                    <button
                        onClick={() => setIsTerminalPlaying(!isTerminalPlaying)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-xs ${
                            isTerminalPlaying
                                ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25"
                                : "text-amber-400 bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25"
                        }`}
                        title={isTerminalPlaying ? "Pause Terminal Stream" : "Play Terminal Stream"}
                    >
                        {isTerminalPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        )}
                    </button>

                    {/* Replay Stream Button */}
                    <button
                        onClick={replayTerminalSession}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-xs"
                        title="Replay Terminal Stream"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                    </button>

                    {/* Live Stream Indicator Badge */}
                    <div
                        className="p-1.5 flex items-center justify-center min-w-6.75 h-6.75 relative"
                        title={isTerminalPlaying ? "Live Stream Active" : "Stream Paused"}
                    >
                        <div className="relative flex items-center justify-center w-2 h-2">
                            {isTerminalPlaying && (
                                <span className="absolute inline-flex w-4 h-4 rounded-full bg-emerald-400/50 animate-ping" />
                            )}
                            <span className={`relative inline-flex w-2 h-2 rounded-full ${isTerminalPlaying ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" : "bg-amber-400"}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal Content Stream Viewport */}
            <div ref={terminalViewportRef} className="p-5 sm:p-7 flex flex-col gap-6 text-zinc-200 h-100 overflow-y-auto leading-relaxed select-text font-mono scroll-smooth scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                
                {/* LINE BLOCK 1: npm install */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">~project</span>
                            <span className="text-emerald-400 font-bold">$</span>
                            <code className="text-zinc-100 font-bold select-all">
                                {completedStepCount >= 1
                                    ? cliSteps[0]
                                    : cliSteps[0].slice(0, currentCmdIndex === 0 ? typedChars : 0)}
                                {currentCmdIndex === 0 && completedStepCount === 0 && (
                                    <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                )}
                            </code>
                        </div>
                        {completedStepCount >= 1 && (
                            <button
                                onClick={() => copyToClipboard(cliSteps[0], 'term-cmd-1')}
                                className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                                {copiedCommand === 'term-cmd-1' ? 'Copied' : 'Copy'}
                            </button>
                        )}
                    </div>
                    {completedStepCount >= 1 && (
                        <div className="text-zinc-400 text-[11px] leading-relaxed animate-in fade-in duration-300">
                            added 2 packages, changed 14 packages, and audited 531 packages in 15s
                            <br />
                            <span className="text-zinc-400">253 packages are looking for funding</span>
                        </div>
                    )}
                </div>

                {/* LINE BLOCK 2: pphat overview */}
                {completedStepCount >= 1 && currentCmdIndex >= 1 && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-bold">~project</span>
                                <span className="text-emerald-400 font-bold">$</span>
                                <code className="text-zinc-100 font-bold select-all">
                                    {completedStepCount >= 2
                                        ? cliSteps[1]
                                        : cliSteps[1].slice(0, currentCmdIndex === 1 ? typedChars : 0)}
                                    {currentCmdIndex === 1 && completedStepCount === 1 && (
                                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                    )}
                                </code>
                            </div>
                            {completedStepCount >= 2 && (
                                <button
                                    onClick={() => copyToClipboard(cliSteps[1], 'term-cmd-2')}
                                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                    {copiedCommand === 'term-cmd-2' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {completedStepCount >= 2 && (
                            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                                <pre className="text-emerald-400 font-extrabold text-[10px] sm:text-xs leading-tight select-none my-1">
{`  ____  ____  _   _    _  _____ 
 |  _ \\|  _ \\| | | |  / \\|_   _|
 | |_) | |_) | |_| | / _ \\ | |  
 |  __/|  __/|  _  |/ ___ \\| |  
 |_|   |_|   |_| |_/_/   \\_\\_|  `}
                                </pre>

                                <div className="text-emerald-400 font-bold text-xs pl-2">
                                    Welcome to @pphatdev/registry! 🚀
                                </div>
                                <div className="text-zinc-400 text-[11px] mt-1">
                                    <span className="text-zinc-200 font-bold">Usage:</span> pphat [options] [command]
                                    <br />
                                    <span className="text-zinc-400">A powerful and extremely fast CLI tool to instantly download and manage custom UI components and icons.</span>
                                </div>
                                <div className="text-zinc-300 text-[11px] mt-1">
                                    <span className="text-amber-400 font-bold">Options:</span>
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">-v, -V, --version</span>     Output the current version
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">-h, --help</span>        display help for command
                                </div>
                                <div className="text-zinc-300 text-[11px] mt-1">
                                    <span className="text-amber-400 font-bold">Commands:</span>
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">add-icon|add [options] [names...]</span>       Download and copy icons or components into your project
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">add-component [options] [names...]</span>      Download and copy components into your project
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">init</span>                                    Initialize configuration (pphatdev.json) and set up your project preferences
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">list|ls &lt;type&gt;</span>                          List all available items in the registry (icons or components)
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">config [command]</span>                        Manage @pphatdev/registry configuration
                                    <br />
                                    {"  "}<span className="text-emerald-400 font-bold">help [command]</span>                          display help for command
                                </div>
                                <div className="text-zinc-300 text-[11px] mt-1">
                                    <span className="text-amber-400 font-bold">Examples:</span>
                                    <br />
                                    {"  "}$ pphat init
                                    <br />
                                    {"  "}$ pphat add-icon react vue github
                                    <br />
                                    {"  "}$ pphat add-icon react -f nextjs -d src/components/icons
                                    <br />
                                    {"  "}$ pphat add-component button card
                                    <br />
                                    {"  "}$ pphat list icons
                                    <br />
                                    {"  "}$ pphat config get icons.nextjs.dir
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* LINE BLOCK 3: pphat init */}
                {completedStepCount >= 2 && currentCmdIndex >= 2 && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-bold">~project</span>
                                <span className="text-emerald-400 font-bold">$</span>
                                <code className="text-zinc-100 font-bold select-all">
                                    {completedStepCount >= 3
                                        ? cliSteps[2]
                                        : cliSteps[2].slice(0, currentCmdIndex === 2 ? typedChars : 0)}
                                    {currentCmdIndex === 2 && completedStepCount === 2 && (
                                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                    )}
                                </code>
                            </div>
                            {completedStepCount >= 3 && (
                                <button
                                    onClick={() => copyToClipboard(cliSteps[2], 'term-cmd-3')}
                                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                    {copiedCommand === 'term-cmd-3' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {completedStepCount >= 3 && (
                            <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                                <div className="text-zinc-300 font-bold text-[11px]">
                                    Welcome to @pphatdev/registry initialization!
                                    <br />
                                    <span className="text-zinc-400 font-normal">This will create a pphatdev.json config file in your project.</span>
                                </div>

                                <div className="flex flex-col gap-1 text-[11px] font-medium">
                                    {/* Question 1 */}
                                    {initSubStep === 0 && (
                                        <div className="text-cyan-400 font-bold animate-in fade-in">
                                            <span className="text-amber-400 font-bold">?</span> What is name of config ? <span className="text-zinc-400 font-normal">(Default configuration)</span>{" "}
                                            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                        </div>
                                    )}
                                    {initSubStep >= 1 && (
                                        <div className="text-emerald-400 font-bold animate-in fade-in">
                                            ✔ What is name of config ? <span className="text-zinc-100 font-bold ml-1">Default configuration</span>
                                        </div>
                                    )}

                                    {/* Question 2 — @inquirer/prompts `select` (single choice) */}
                                    {initSubStep === 1 && (
                                        <div className="flex flex-col gap-1 text-cyan-400 font-bold animate-in fade-in py-0.5">
                                            <div><span className="text-amber-400 font-bold">?</span> What do you want to use ? <span className="text-zinc-400 font-normal">(required must select one)</span></div>
                                            <div className="pl-3 font-mono flex flex-col gap-0.5 text-zinc-400">
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 0 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 0 && <span>❯</span>} Components
                                                </div>
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 1 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 1 && <span>❯</span>} <span className={activeOptionIndex === 1 ? 'underline decoration-emerald-400 underline-offset-2' : ''}>Icons</span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 2 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 2 && <span>❯</span>} Both Components and Icons
                                                </div>
                                            </div>
                                            <div className="text-zinc-400 text-[10px] font-normal pl-3 mt-0.5">(Use arrow keys)</div>
                                        </div>
                                    )}
                                    {initSubStep >= 2 && (
                                        <div className="text-emerald-400 font-bold animate-in fade-in">
                                            ✔ What do you want to use ? <span className="text-zinc-100 font-bold ml-1">Icons</span>
                                        </div>
                                    )}

                                    {/* Question 3 — @inquirer/prompts `checkbox` (multi choice) */}
                                    {initSubStep === 2 && (
                                        <div className="flex flex-col gap-1 text-cyan-400 font-bold animate-in fade-in py-0.5">
                                            <div><span className="text-amber-400 font-bold">?</span> Which directory you want to use ? <span className="text-zinc-400 font-normal">(required must select one)</span></div>
                                            <div className="pl-3 font-mono flex flex-col gap-0.5 text-zinc-400">
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 0 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 0 && <span>❯</span>} <span>◯</span> SVG format (.svg)
                                                </div>
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 1 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 1 && <span>❯</span>} <span className="transition-all duration-200">{activeOptionIndex === 1 && selectOptionChecked ? '◉' : '◯'}</span> <span className={activeOptionIndex === 1 ? 'underline decoration-emerald-400 underline-offset-2' : ''}>Nextjs format (.tsx)</span>
                                                </div>
                                                <div className={`flex items-center gap-1.5 transition-colors duration-150 ${activeOptionIndex === 2 ? 'text-emerald-400 font-bold' : 'opacity-60 pl-3.75'}`}>
                                                    {activeOptionIndex === 2 && <span>❯</span>} <span>◯</span> Nuxtjs format (.vue)
                                                </div>
                                            </div>
                                            <div className="text-zinc-400 text-[10px] font-normal pl-3 mt-0.5">(Press &lt;space&gt; to select, &lt;a&gt; to toggle all, &lt;i&gt; to invert selection, and &lt;enter&gt; to proceed)</div>
                                        </div>
                                    )}
                                    {initSubStep >= 3 && (
                                        <div className="text-emerald-400 font-bold animate-in fade-in">
                                            ✔ Which directory you want to use ? <span className="text-zinc-100 font-bold ml-1">Nextjs format (.tsx)</span>
                                        </div>
                                    )}

                                    {/* Question 4 */}
                                    {initSubStep === 3 && (
                                        <div className="text-cyan-400 font-bold animate-in fade-in">
                                            <span className="text-amber-400 font-bold">?</span> Where do you store icon of nextjs ? <span className="text-zinc-400 font-normal">(components/icons)</span>{" "}
                                            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                        </div>
                                    )}
                                    {initSubStep >= 4 && (
                                        <div className="text-emerald-400 font-bold animate-in fade-in">
                                            ✔ Where do you store icon of nextjs ? <span className="text-zinc-100 font-bold ml-1">components/icons</span>
                                        </div>
                                    )}
                                </div>

                                {/* Final Config Success Banner */}
                                {initSubStep >= 4 && (
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] mt-1 animate-in fade-in duration-300">
                                        Success! Configuration saved to pphatdev.json. Your items will be saved to your configured directories.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* LINE BLOCK 4: pphat list icons */}
                {completedStepCount >= 3 && currentCmdIndex >= 3 && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-bold">~project</span>
                                <span className="text-emerald-400 font-bold">$</span>
                                <code className="text-zinc-100 font-bold select-all">
                                    {completedStepCount >= 4
                                        ? cliSteps[3]
                                        : cliSteps[3].slice(0, currentCmdIndex === 3 ? typedChars : 0)}
                                    {currentCmdIndex === 3 && completedStepCount === 3 && (
                                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                    )}
                                </code>
                            </div>
                            {completedStepCount >= 4 && (
                                <button
                                    onClick={() => copyToClipboard(cliSteps[3], 'term-cmd-4')}
                                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                    {copiedCommand === 'term-cmd-4' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {completedStepCount >= 4 && (
                            <div className="flex flex-col gap-0.5 text-[11px] animate-in fade-in duration-300 font-mono">
                                <div className="text-blue-400 font-extrabold mt-1">Available Brands Icons:</div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">github</span></div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">nextjs</span></div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">nuxtjs</span></div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">react</span></div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">tailwind</span></div>
                                <div className="text-zinc-200 pl-2">- <span className="text-emerald-400">vue</span></div>
                            </div>
                        )}
                    </div>
                )}

                {/* LINE BLOCK 5: pphat add react -f nextjs */}
                {completedStepCount >= 4 && currentCmdIndex >= 4 && (
                    <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800/60 transition-all duration-300">
                        <div className="flex items-center justify-between font-bold">
                            <div className="flex items-center gap-2">
                                <span className="text-cyan-400 font-bold">~project</span>
                                <span className="text-emerald-400 font-bold">$</span>
                                <code className="text-zinc-100 font-bold select-all">
                                    {completedStepCount >= 5
                                        ? cliSteps[4]
                                        : cliSteps[4].slice(0, currentCmdIndex === 4 ? typedChars : 0)}
                                    {currentCmdIndex === 4 && completedStepCount === 4 && (
                                        <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
                                    )}
                                </code>
                            </div>
                            {completedStepCount >= 5 && (
                                <button
                                    onClick={() => copyToClipboard(cliSteps[4], 'term-cmd-5')}
                                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                    {copiedCommand === 'term-cmd-5' ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>

                        {completedStepCount >= 5 && (
                            <div className="text-emerald-400 text-[11px] font-bold animate-in fade-in duration-300">
                                ✔ Successfully downloaded <span className="text-zinc-100">react</span> into <span className="text-zinc-100">components/icons</span> directory for format: nextjs
                            </div>
                        )}
                    </div>
                )}

                {/* FINAL COMPLETED PROMPT CURSOR */}
                {completedStepCount >= 5 && (
                    <div className="flex items-center gap-2 pt-2 text-emerald-400 font-bold animate-in fade-in duration-300">
                        <span className="text-cyan-400 font-bold">~project</span>
                        <span className="text-emerald-400 font-bold">$</span>
                        <span className="text-zinc-400 text-[11px] font-mono font-normal">
                            session complete — ready for commands <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle" />
                        </span>
                    </div>
                )}

            </div>
        </div>
    );
}
