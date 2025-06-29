import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            if (!editorRef.current) {
                editorRef.current = Codemirror.fromTextArea(
                    document.getElementById('realtimeEditor'),
                    {
                        mode: { name: 'javascript', json: true },
                        theme: 'dracula',
                        autoCloseTags: true,
                        autoCloseBrackets: true,
                        lineNumbers: true,
                    }
                );

                editorRef.current.on('change', (instance, changes) => {
                    const { origin } = changes;
                    const code = instance.getValue();
                    onCodeChange(code);
                    if (origin !== 'setValue' && socketRef.current) {
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                            roomId,
                            code,
                        });
                    }
                });
            }
        }
        init();
        // eslint-disable-next-line
    }, []); // <-- Only run once on mount

    useEffect(() => {
        const socket = socketRef.current; // Copy ref to local variable
        if (socket) {
            const handler = ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            };
            socket.on(ACTIONS.CODE_CHANGE, handler);

            return () => {
                socket.off(ACTIONS.CODE_CHANGE, handler);
            };
        }
        // eslint-disable-next-line
    }, [socketRef]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
