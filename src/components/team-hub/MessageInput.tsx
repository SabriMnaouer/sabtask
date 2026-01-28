import React, { useRef } from 'react';
import { Paperclip, Send, X, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MessageInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: (e: React.FormEvent) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPaste: (e: React.ClipboardEvent) => void;
    attachment: { type: 'image' | 'file', url: string, name: string } | null;
    onClearAttachment: () => void;
    isDisabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    value, onChange, onSend, onFileSelect, onPaste, attachment, onClearAttachment, isDisabled
}) => {
    const { state } = useApp();
    const { t } = state;
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <form onSubmit={onSend} className="flex gap-2 md:gap-3 items-end">
            
            {/* Attachment Preview (Absolute Overlay) */}
            {attachment && (
                <div className="absolute bottom-full left-4 mb-2 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="relative group">
                    {attachment.type === 'image' ? (
                        <img src={attachment.url} className="h-16 w-16 object-cover rounded-lg border border-slate-200 dark:border-slate-600" />
                    ) : (
                        <div className="h-16 w-16 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-600 text-slate-500">
                            <FileText size={24} />
                        </div>
                    )}
                    <button 
                        type="button"
                        onClick={() => {
                            onClearAttachment();
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }} 
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-sm hover:bg-rose-600 transition-colors"
                    >
                        <X size={12}/>
                    </button>
                    </div>
                    <div className="pr-2">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[150px] truncate">{attachment.name}</p>
                        <p className="text-[10px] text-slate-400">Ready to send</p>
                    </div>
                </div>
            )}

            <div className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={onFileSelect}
                />
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-400 hover:text-primary-600 transition-colors"
                    title="Attach file or image"
                >
                    <Paperclip size={20} />
                </button>
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onPaste={onPaste}
                    placeholder={t('typeMessage')}
                    className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-sm min-w-0"
                />
            </div>
            <button 
                type="submit" 
                disabled={isDisabled}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 flex-shrink-0"
            >
                <Send size={20} />
            </button>
        </form>
    );
};