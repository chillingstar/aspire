"use client";

import 'animate.css';
import * as React from 'react';
import {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {socket} from "../socket";

/**
 * Creates a custom theme with dark mode and primary/secondary color settings.
 */
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

/**
 * Home component that renders the main UI.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    useEffect(() => {
        socket.on("connect", () => {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            const msgList = document.getElementById("msgList");
            if (msgList) {
                const message = document.createElement("div");
                message.innerText = "System: " + "Successfully connected to server";
                message.className = "p-2 m-2 bg-gray-700 rounded-lg shadow animate__animated animate__fadeInDown";
                msgList.appendChild(message);
                msgList.scrollTop = msgList.scrollHeight;
            }
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setTransport("N/A");

            const msgList = document.getElementById("msgList");
            if (msgList) {
                const message = document.createElement("div");
                message.innerText = "System: " + "You're disconnected from the server.";
                message.className = "p-2 m-2 bg-gray-700 rounded-lg shadow animate__animated animate__fadeInDown";
                msgList.appendChild(message);
                msgList.scrollTop = msgList.scrollHeight;
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    });

    /**
     * Handles sending a message.
     * Retrieves the message input value, creates a new message element,
     * appends it to the message list, and clears the input field.
     */
    const sendMessage = () => {
        const messageInput: HTMLInputElement | null = document.getElementById("messageInput") as HTMLInputElement | null;

        const msgList = document.getElementById("msgList");
        if (msgList && messageInput) {
            const trimmedValue = messageInput.value.trim();

            if (trimmedValue === "") {
                return;
            }

            const message = document.createElement("div");
            message.innerText = "You: " + trimmedValue;
            message.className = "p-2 m-2 bg-gray-700 rounded-lg shadow animate__animated animate__fadeInDown";
            msgList.appendChild(message);
            msgList.scrollTop = msgList.scrollHeight;

            messageInput.value = "";
        }
    }

    return (
        <main>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white shadow">
                    <div
                        className="absolute top-1/10 left-1/8 w-3/4 h-4/5 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between">
                        <div id="msgList" className="flex-grow overflow-y-auto max-h-3/4 text-lg">

                        </div>
                        <div className="flex mt-4">
                            <input
                                type="text"
                                placeholder="Message"
                                id={"messageInput"}
                                className="flex-grow p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none mr-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className="rounded shadow ml-1"
                                onClick={() => {
                                    sendMessage();
                                }}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        </main>
    );
}