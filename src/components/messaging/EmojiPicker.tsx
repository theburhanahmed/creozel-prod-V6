import React from 'react';
interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}
export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect
}) => {
  // Simple emoji set for demo purposes
  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '👍', '👎', '👏', '🙌', '🤝', '👊', '✌️', '🤞', '🤟', '🤘', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣️', '💕', '💞'];
  return <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg p-2 w-[250px]">
      <div className="grid grid-cols-10 gap-1">
        {emojis.map((emoji, index) => <button key={index} className="w-5 h-5 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => onEmojiSelect(emoji)}>
            {emoji}
          </button>)}
      </div>
    </div>;
};