// TODO: import EmojiPicker from 'emoji-picker-react'
import EmojiJs from 'emoji-js'
export const emojiJs = () => {
	const emojiJs = new EmojiJs()
	emojiJs.replace_mode = 'unified'
	return emojiJs
}

// const emoji = emojiJs()
// emojiJs.img_set = 'emojione'
// emojiJs.img_sets.emojione.path = 'https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/'
// emojiJs.supports_css = false
// emojiJs.allow_native = false
