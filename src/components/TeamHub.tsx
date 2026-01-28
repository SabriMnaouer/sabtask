
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_CHANNELS, MOCK_MESSAGES } from '../constants';
import { ChatMessage, Channel } from '../types';
import { GoogleGenAI } from "@google/genai";

// Sub Components
import { ChannelSidebar } from './team-hub/ChannelSidebar';
import { HubHeader } from './team-hub/HubHeader';
import { ChatArea } from './team-hub/ChatArea';
import { VoiceStage } from './team-hub/VoiceStage';
import { MessageInput } from './team-hub/MessageInput';
import { VoiceControls } from './team-hub/VoiceControls';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const TeamHub: React.FC = () => {
  const { state } = useApp();
  const { user, users } = state;

  // --- State ---
  const [activeChannelId, setActiveChannelId] = useState('c1');
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  
  // File Attachment State
  const [attachment, setAttachment] = useState<{ type: 'image' | 'file', url: string, name: string } | null>(null);
  
  // Voice Room State
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  
  // AI State
  const [isAiThinking, setIsAiThinking] = useState(false);

  // UI State
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const activeChannel = channels.find(c => c.id === activeChannelId);

  // --- Actions ---

  const handleChannelSelect = (channelId: string) => {
      setActiveChannelId(channelId);
      setMobileView('chat');
  };

  // --- File Handling ---

  const processFile = (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        alert("File size too large (max 5MB)");
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result as string;
        const isImage = file.type.startsWith('image/');
        setAttachment({ type: isImage ? 'image' : 'file', url: result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        processFile(e.target.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file') {
            const file = items[i].getAsFile();
            if (file) processFile(file);
        }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachment) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      channelId: activeChannelId,
      userId: user.id,
      text: inputMessage,
      attachment: attachment ? { ...attachment } : undefined,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentText = inputMessage;
    setInputMessage('');
    setAttachment(null);

    // AI Bot Logic
    if (currentText.toLowerCase().includes('@ai') || currentText.toLowerCase().includes('@gemini')) {
       setIsAiThinking(true);
       try {
          const prompt = `You are a helpful team assistant for SabTask. User said: "${currentText}". Reply briefly and helpfully.`;
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
          });

          const botResponse: ChatMessage = {
              id: Math.random().toString(),
              channelId: activeChannelId,
              userId: 'ai',
              text: response.text || "I'm not sure how to help with that yet.",
              createdAt: new Date().toISOString(),
              isAi: true
          };
          setMessages(prev => [...prev, botResponse]);
       } catch (err) {
          console.error(err);
       } finally {
          setIsAiThinking(false);
       }
    }
  };

  const toggleVoiceRoom = (channelId: string) => {
     if (isJoined && activeChannelId === channelId) {
         setIsJoined(false);
         setChannels(prev => prev.map(c => 
             c.id === channelId 
             ? { ...c, connectedUserIds: c.connectedUserIds?.filter(id => id !== user.id) }
             : c
         ));
     } else {
         if (isJoined) {
             setChannels(prev => prev.map(c => ({...c, connectedUserIds: c.connectedUserIds?.filter(id => id !== user.id)})));
         }
         setActiveChannelId(channelId);
         setMobileView('chat'); 
         setIsJoined(true);
         setChannels(prev => prev.map(c => 
            c.id === channelId
            ? { ...c, connectedUserIds: [...(c.connectedUserIds || []), user.id] }
            : c
         ));
     }
  };

  const handleCreateChannel = (name: string, type: 'TEXT' | 'VOICE') => {
      const newChannel: Channel = {
          id: Math.random().toString(36).substr(2, 9),
          name: name,
          type: type,
          connectedUserIds: []
      };
      setChannels(prev => [...prev, newChannel]);
      setActiveChannelId(newChannel.id);
      setMobileView('chat');
  };

  const handleDeleteChannel = (id: string) => {
      setChannels(prev => prev.filter(c => c.id !== id));
      if(activeChannelId === id) {
          const next = channels.find(c => c.id !== id);
          if (next) setActiveChannelId(next.id);
      }
  };

  return (
    <div className="flex h-full bg-white dark:bg-dark-surface rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm relative">
      
      <ChannelSidebar 
        channels={channels}
        activeChannelId={activeChannelId}
        onSelect={handleChannelSelect}
        users={users}
        currentUser={user}
        onCreateChannel={handleCreateChannel}
        onDeleteChannel={handleDeleteChannel}
        mobileView={mobileView}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-dark-bg/50 w-full h-full relative z-10">
          
          <HubHeader 
            activeChannel={activeChannel}
            isJoined={isJoined && activeChannelId === activeChannel?.id}
            onToggleVoiceRoom={toggleVoiceRoom}
            onBack={() => setMobileView('list')}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {activeChannel?.type === 'TEXT' ? (
                 <ChatArea 
                    messages={messages.filter(m => m.channelId === activeChannelId)}
                    users={users}
                    currentUser={user}
                    isAiThinking={isAiThinking}
                 />
              ) : (
                 <VoiceStage 
                    channel={activeChannel}
                    users={users}
                    currentUser={user}
                    isJoined={isJoined}
                    isMuted={isMuted}
                    onJoin={() => toggleVoiceRoom(activeChannelId)}
                 />
              )}
          </div>

          {/* Footer Controls */}
          <div className="p-3 md:p-4 bg-white dark:bg-dark-surface border-t border-slate-200 dark:border-white/5 relative">
              {activeChannel?.type === 'TEXT' ? (
                  <MessageInput 
                    value={inputMessage}
                    onChange={setInputMessage}
                    onSend={handleSendMessage}
                    onFileSelect={handleFileSelect}
                    onPaste={handlePaste}
                    attachment={attachment}
                    onClearAttachment={() => setAttachment(null)}
                    isDisabled={!inputMessage.trim() && !attachment}
                  />
              ) : (
                  isJoined && (
                    <VoiceControls 
                        isMuted={isMuted}
                        isVideoOn={isVideoOn}
                        onToggleMute={() => setIsMuted(!isMuted)}
                        onToggleVideo={() => setIsVideoOn(!isVideoOn)}
                        onLeave={() => toggleVoiceRoom(activeChannelId)}
                    />
                  )
              )}
          </div>
      </div>
    </div>
  );
};